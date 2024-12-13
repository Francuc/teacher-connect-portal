import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Get timestamps
        const createdAt = new Date(session?.user?.created_at || '').getTime();
        const signInTime = new Date(session?.user?.last_sign_in_at || '').getTime();
        const timeDifference = Math.abs(signInTime - createdAt);
        
        // If sign in happened within 10 seconds of account creation, consider it a new signup
        if (timeDifference <= 10000) {
          navigate(`/profile/edit/${session.user.id}`);
        } else {
          navigate("/");
        }
      } else if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [navigate]);

  // Handle auth errors separately
  useEffect(() => {
    const handleError = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error?.message?.includes("Invalid login credentials")) {
          setView("sign_up");
          toast({
            title: t("error"),
            description: t("noAccount"),
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };

    handleError();
  }, [toast, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-soft via-background to-purple-light dark:from-purple-dark dark:via-background dark:to-purple-vivid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Nohëllef.lu
          </h1>
          <p className="text-lg font-medium mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600">
            {t("findTeacher")} ✨
          </p>
          <p className="text-muted-foreground mt-2">
            {view === "sign_in" ? "Créer nouveau compte" : t("noAccount")}
          </p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-primary/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-primary">
              {view === "sign_in" ? t("signIn") : t("signUp")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              view={view}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(155, 135, 245)',
                      brandAccent: 'rgb(126, 105, 171)',
                      brandButtonText: 'white',
                      defaultButtonBackground: 'white',
                      defaultButtonBackgroundHover: '#E5DEFF',
                      inputBackground: 'white',
                      inputBorder: 'lightgray',
                      inputBorderHover: 'gray',
                      inputBorderFocus: 'rgb(155, 135, 245)',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '8px',
                      buttonBorderRadius: '8px',
                      inputBorderRadius: '8px',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                  input: 'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 transition-shadow',
                  label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
                }
              }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: t("email"),
                    password_label: t("password"),
                    email_input_placeholder: t("email"),
                    password_input_placeholder: t("password"),
                    button_label: t("signIn"),
                    loading_button_label: t("loading"),
                    link_text: "Créer nouveau compte",
                  },
                  sign_up: {
                    email_label: t("email"),
                    password_label: t("password"),
                    email_input_placeholder: t("email"),
                    password_input_placeholder: t("password"),
                    button_label: t("signUp"),
                    loading_button_label: t("loading"),
                    link_text: t("hasAccount"),
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;