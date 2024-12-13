import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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
            title: "Account not found",
            description: "This account doesn't exist. Please sign up instead.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };

    handleError();
  }, [toast]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        theme="light"
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up ...',
            },
          },
        }}
      />
    </div>
  );
};

export default AuthPage;