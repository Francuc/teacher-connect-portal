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
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // Get the prefix based on the language
        const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
        
        // Check if this is a recovery flow by looking at the URL hash
        if (location.hash.includes('type=recovery')) {
          // After password reset login, redirect to edit page
          const { data: teacherProfile } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session) {
        // Get the prefix based on the language
        const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
        
        // Check if this is a recovery flow
        if (location.hash.includes('type=recovery')) {
          // After password reset login, redirect to edit page
          supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data: teacherProfile }) => {
              if (teacherProfile) {
                navigate(`/${prefix}/edit/${session.user.id}`, { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            });
        } else {
          navigate('/', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.hash, language]);

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
        redirectTo={`${window.location.origin}/auth`}
      />
    </div>
  );
}