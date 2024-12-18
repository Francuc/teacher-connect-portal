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
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (type === 'recovery' && accessToken) {
        navigate('/reset-password', {
          state: {
            accessToken,
            refreshToken
          },
          replace: true
        });
        return;
      }
    }

    // Only redirect if there's an active session and we're on the auth page
    if (session?.user?.id && location.pathname === '/auth') {
      navigate('/', { replace: true });
    }
  }, [session, location.hash, navigate]);

  // Show loading state during recovery process
  if (location.hash && new URLSearchParams(location.hash.substring(1)).get('type') === 'recovery') {
    return (
      <div className="max-w-md mx-auto p-6 mt-12">
        <h2 className="text-2xl font-bold mb-4">Processing Recovery Request</h2>
        <p className="text-gray-600">Please wait while we process your password recovery request...</p>
      </div>
    );
  }

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