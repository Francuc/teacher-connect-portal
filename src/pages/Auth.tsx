import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message
        });
        return;
      }

      setSession(session);

      if (session) {
        // Get the prefix based on the language
        const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
        
        // Check if this is a recovery flow by looking at the URL hash
        if (location.hash.includes('type=recovery')) {
          // After password reset login, redirect to edit page
          const { data: teacherProfile, error: profileError } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch user profile"
            });
            return;
          }

          if (teacherProfile) {
            navigate(`/${prefix}/edit/${session.user.id}`, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/', { replace: true });
        }
      }
    };

    checkSessionAndRedirect();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session) {
        // Get the prefix based on the language
        const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
        
        try {
          // Check if this is a recovery flow
          if (location.hash.includes('type=recovery')) {
            // After password reset login, redirect to edit page
            const { data: teacherProfile, error: profileError } = await supabase
              .from('teachers')
              .select('user_id')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) throw profileError;

            if (teacherProfile) {
              navigate(`/${prefix}/edit/${session.user.id}`, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          } else {
            navigate('/', { replace: true });
          }
        } catch (error: any) {
          console.error('Auth state change error:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "An error occurred during authentication"
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.hash, language, toast]);

  // Get the current site URL dynamically
  const siteUrl = window.location.origin;

  return (
    <div className="max-w-md mx-auto p-6 mt-12">
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
        providers={[]}
        redirectTo={`${siteUrl}/auth`}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up ...',
            },
          },
        }}
      />
    </div>
  );
}