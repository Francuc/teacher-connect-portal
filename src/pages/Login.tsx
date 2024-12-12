import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-purple-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-vivid">
          {t("welcome")}
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-md',
              input: 'rounded-md px-4 py-2 border focus:ring-2 focus:ring-purple-vivid focus:border-transparent',
              label: 'block text-sm font-medium text-gray-700 mb-1',
              message: 'text-sm text-red-600 mt-1',
            }
          }}
          providers={["google", "facebook"]}
          redirectTo={`${window.location.origin}/`}
          localization={{
            variables: {
              sign_in: {
                email_label: t("email"),
                password_label: t("password"),
                button_label: t("signIn"),
              },
              sign_up: {
                email_label: t("email"),
                password_label: t("password"),
                button_label: t("signUp"),
              },
            }
          }}
        />
      </div>
    </div>
  );
}