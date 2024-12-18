import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're on a recovery flow
    const isRecoveryFlow = location.hash.includes('type=recovery');

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // If we have a session and we're in recovery flow, redirect to reset password
      if (session && isRecoveryFlow) {
        navigate('/reset-password', { replace: true });
        return;
      }
      
      // For normal login (non-recovery), redirect to home if logged in
      if (session && !isRecoveryFlow) {
        navigate('/', { replace: true });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // If we have a session and we're in recovery flow, redirect to reset password
      if (session && isRecoveryFlow) {
        navigate('/reset-password', { replace: true });
        return;
      }
      
      // For normal login (non-recovery), redirect to home if logged in
      if (session && !isRecoveryFlow) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.hash]);

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