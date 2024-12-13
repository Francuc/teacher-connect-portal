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
    // Get the target profile ID from the URL if it exists
    const params = new URLSearchParams(location.search);
    const targetProfileId = params.get('redirect');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in, redirecting...');
        if (targetProfileId) {
          navigate(`/profile/${targetProfileId}`);
        } else {
          navigate('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#7C3AED',
                brandAccent: '#6D28D9',
              },
            },
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: language === 'fr' ? 'Adresse e-mail' : 'Email address',
              password_label: language === 'fr' ? 'Mot de passe' : 'Password',
            },
          },
        }}
      />
    </div>
  );
}