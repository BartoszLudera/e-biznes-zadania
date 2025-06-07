
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Przekierowanie zalogowanych użytkowników
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Obsługa callback z OAuth
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (token && success) {
      localStorage.setItem('sessionToken', token);
      toast({
        title: "Zalogowano przez GitHub",
        description: "Pomyślnie zalogowano przez GitHub",
      });
      navigate('/');
    } else if (error) {
      toast({
        title: "Błąd OAuth",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </h2>
        </div>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
