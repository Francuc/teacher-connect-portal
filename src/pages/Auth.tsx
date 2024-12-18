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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // If we have a session and we're on the auth page with recovery token, redirect to reset password
      if (session && location.pathname === '/auth' && location.hash.includes('type=recovery')) {
        navigate('/reset-password', {
          state: {
            access_token: session.access_token,
            refresh_token: session.refresh_token
          },
          replace: true
        });
        return;
      }
      
      // For normal login (non-recovery), redirect to home
      if (session && location.pathname === '/auth' && !location.hash.includes('type=recovery')) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [session, location.hash, navigate]);

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