import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogIn } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Check if user has a teacher profile
        const checkProfile = async () => {
          const { data: teacherProfile } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (teacherProfile) {
            // If profile exists, go to edit page
            navigate(`/profile/edit/${session.user.id}`);
          } else {
            // If no profile, go to create new profile page
            navigate("/profile/new");
          }
        };
        
        checkProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <LogIn className="h-6 w-6" />
            {t("signInOrSignUp")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    brandButtonText: 'white',
                  },
                  radii: {
                    borderRadiusButton: '6px',
                    buttonBorderRadius: '6px',
                    inputBorderRadius: '6px',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full bg-primary text-white hover:bg-primary/90 rounded-md',
                input: 'rounded-md',
              },
            }}
            theme="light"
            providers={[]}
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
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;