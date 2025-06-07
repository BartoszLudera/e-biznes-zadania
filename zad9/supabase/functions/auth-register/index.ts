
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, fullName, username } = await req.json()

    // Rejestracja przez Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_name: username,
        }
      }
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Registration failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generowanie własnego tokena sesji
    const sessionToken = crypto.randomUUID()
    
    // Zapisanie sesji w bazie danych
    const { error: sessionError } = await supabaseClient
      .from('user_sessions')
      .insert({
        user_id: authData.user.id,
        session_token: sessionToken,
        provider: 'email',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      })

    if (sessionError) {
      console.error('Session error:', sessionError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
        sessionToken: authData.session ? sessionToken : null,
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
          username
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
