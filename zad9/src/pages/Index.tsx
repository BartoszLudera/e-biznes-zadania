
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Witaj, {user.full_name || user.username}!</CardTitle>
                  <CardDescription>
                    Jesteś zalogowany w systemie uwierzytelniania OAuth2.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.username && <p><strong>Username:</strong> {user.username}</p>}
                    {user.full_name && <p><strong>Imię i nazwisko:</strong> {user.full_name}</p>}
                    {user.github_id && <p><strong>GitHub ID:</strong> {user.github_id}</p>}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Funkcjonalności</CardTitle>
                  <CardDescription>
                    System uwierzytelniania został skonfigurowany zgodnie z wymaganiami:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>✅ Logowanie przez aplikację serwerową (bez OAuth2)</li>
                    <li>✅ Rejestracja przez aplikację serwerową (bez OAuth2)</li>
                    <li>✅ Logowanie via GitHub OAuth2</li>
                    <li>✅ Dane użytkownika przechowywane w bazie serwera</li>
                    <li>✅ Własne tokeny sesji (inne niż od dostawcy)</li>
                    <li>✅ Przepływ: React → Serwer → Dostawca → Serwer → React</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Witaj w aplikacji!</CardTitle>
                  <CardDescription>
                    Zaloguj się, aby korzystać z pełnych funkcjonalności.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/auth'}
                  >
                    Przejdź do logowania
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
