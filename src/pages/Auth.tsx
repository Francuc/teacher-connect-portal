import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('Auth component mounted');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
    });

    return () => {
      console.log('Auth component unmounting, cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      console.log('Handling auth redirect:', {
        pathname: location.pathname,
        hash: location.hash,
        hasSession: !!session?.user?.id
      });

      // Handle hash fragment for recovery tokens
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        
        if (type === 'recovery' && accessToken) {
          console.log('Recovery token found in hash, redirecting to update password');
          navigate('/reset-password', { 
            state: { 
              mode: 'update',
              accessToken 
            },
            replace: true 
          });
          return;
        }
      }

      // Handle recovery token from query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const type = params.get('type');

      if (token && type === 'recovery') {
        console.log('Recovery token found in query params, redirecting to reset password');
        // Set the session directly with the recovery token
        const { data: { session: recoverySession }, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });

        if (!error && recoverySession?.access_token) {
          navigate('/reset-password', { 
            state: { 
              mode: 'update',
              accessToken: recoverySession.access_token 
            },
            replace: true 
          });
        } else {
          console.error('Error setting recovery session:', error);
        }
        return;
      }

      // Only redirect if there's an active session and we're on the auth page
      if (session?.user?.id && location.pathname === '/auth') {
        console.log('Active session found on auth page, redirecting to home');
        navigate('/', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

  // If we're handling a recovery flow, don't show the auth UI
  if (location.pathname === '/reset-password') {
    return null;
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