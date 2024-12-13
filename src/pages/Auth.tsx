import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetProfileId = params.get('redirect');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in, checking redirect...');
        if (targetProfileId) {
          console.log('Redirecting to specific profile:', targetProfileId);
          navigate(`/profile/${targetProfileId}`);
        } else if (session?.user) {
          console.log('Redirecting to user profile:', session.user.id);
          navigate(`/profile/${session.user.id}`);
        } else {
          console.log('No session available, going to home page');
          navigate('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple.dark">
          {language === 'fr' ? 'Connexion' : 'Sign In'}
        </h2>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                },
              },
            },
            className: {
              container: 'flex flex-col gap-4',
              label: 'text-sm font-medium text-gray-700',
              input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500',
              button: 'bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary transition-colors',
            },
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: language === 'fr' ? 'Adresse e-mail' : 'Email address',
                password_label: language === 'fr' ? 'Mot de passe' : 'Password',
                button_label: language === 'fr' ? 'Se connecter' : 'Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  );
}