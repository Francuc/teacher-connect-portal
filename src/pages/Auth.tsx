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
        hash: window.location.hash,
        hasSession: !!session?.user?.id
      });

      // Handle hash fragment for recovery tokens
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        
        if (type === 'recovery') {
          const accessToken = hashParams.get('access_token');
          if (accessToken) {
            console.log('Recovery token found, redirecting to update password');
            navigate('/update-password', { state: { accessToken } });
            return;
          }
        }
      }

      // Handle recovery token from query params (old method)
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const type = params.get('type');

      if (token && type === 'recovery') {
        console.log('Recovery token found in query params, redirecting to update password');
        navigate('/update-password', { state: { token } });
        return;
      }

      // Only redirect if there's an active session and we're on the auth page
      if (session?.user?.id && location.pathname === '/auth') {
        console.log('Active session found on auth page, redirecting to home');
        navigate('/', { replace: true });
      } else {
        console.log('No redirect needed:', {
          hasSession: !!session?.user?.id,
          pathname: location.pathname
        });
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

  // If we're handling a recovery flow, don't show the auth UI
  if (location.pathname === '/update-password') {
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