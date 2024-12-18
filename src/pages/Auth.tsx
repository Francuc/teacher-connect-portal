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
    console.log('Current location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    });
    
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
        search: location.search,
        hash: location.hash,
        pathname: location.pathname
      });

      // Handle URL parameters for recovery
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (type === 'recovery' && token) {
        console.log('Recovery token found in URL params:', { token, type });
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          console.log('OTP verification result:', { data, error });

          if (error) throw error;

          // If successful, redirect to reset password with the new session
          if (data.session) {
            console.log('Redirecting to reset password with session');
            navigate('/reset-password', {
              state: {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token
              },
              replace: true
            });
            return;
          }
        } catch (error) {
          console.error('Error verifying recovery token:', error);
        }
      }

      // Handle hash fragment for recovery tokens (existing flow)
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const hashType = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Hash params:', { 
          type: hashType, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });
        
        if (hashType === 'recovery' && accessToken) {
          console.log('Recovery token found in hash, redirecting to reset password');
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
        console.log('Active session found on auth page, redirecting to home');
        navigate('/', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

  // If we're handling a recovery flow, don't show the auth UI
  if ((location.search && new URLSearchParams(location.search).get('type') === 'recovery') ||
      (location.hash && new URLSearchParams(location.hash.substring(1)).get('type') === 'recovery')) {
    console.log('Recovery flow detected, not showing auth UI');
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