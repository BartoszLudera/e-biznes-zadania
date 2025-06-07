
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Wymiana kodu na token GitHub
    const githubTokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: Deno.env.get('GITHUB_CLIENT_ID'),
        client_secret: Deno.env.get('GITHUB_CLIENT_SECRET'),
        code: code,
      }),
    })

    const githubTokenData = await githubTokenResponse.json()

    if (githubTokenData.error) {
      return new Response(
        JSON.stringify({ error: 'GitHub OAuth failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Pobieranie danych użytkownika z GitHub
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubTokenData.access_token}`,
      },
    })

    const githubUser = await githubUserResponse.json()

    // Rejestracja/logowanie przez Supabase z danymi GitHub
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        skipBrowserRedirect: true,
      }
    })

    // Alternatywnie: ręczne zarządzanie użytkownikiem
    let user
    const { data: existingUser } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('github_id', githubUser.id.toString())
      .single()

    if (existingUser) {
      user = existingUser
    } else {
      // Tworzenie nowego użytkownika
      const { data: newAuthUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email: githubUser.email,
        email_confirm: true,
        user_metadata: {
          full_name: githubUser.name,
          user_name: githubUser.login,
          avatar_url: githubUser.avatar_url,
          provider_id: githubUser.id.toString(),
        }
      })

      if (createError) {
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      user = newAuthUser.user
    }

    // Generowanie własnego tokena sesji
    const sessionToken = crypto.randomUUID()
    
    // Zapisanie sesji z tokenami OAuth
    const { error: sessionError } = await supabaseClient
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        oauth_access_token: githubTokenData.access_token,
        oauth_refresh_token: githubTokenData.refresh_token,
        provider: 'github',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      })

    if (sessionError) {
      console.error('Session error:', sessionError)
    }

    // Przekierowanie z tokenem do frontend
    const redirectUrl = `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/auth/callback?token=${sessionToken}&success=true`
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    })

  } catch (error) {
    const redirectUrl = `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/auth/callback?error=${encodeURIComponent(error.message)}`
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    })
  }
})
