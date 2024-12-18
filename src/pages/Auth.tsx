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
    toast({
      title: "Auth Component Mounted",
      description: `Current location: ${location.pathname}${location.search}${location.hash}`,
    });
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      toast({
        title: "Initial Session Check",
        description: session ? "Session exists" : "No session",
      });
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      toast({
        title: "Auth State Changed",
        description: `Event: ${_event}, Session: ${session ? "exists" : "none"}`,
      });
      setSession(session);
    });

    return () => {
      toast({
        title: "Auth Component Unmounting",
        description: "Cleaning up subscription",
      });
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      toast({
        title: "Handling Auth Redirect",
        description: `Search: ${location.search}, Hash: ${location.hash}`,
      });

      // Handle URL parameters for recovery
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (type === 'recovery' && token) {
        toast({
          title: "Recovery Token Found",
          description: `Token: ${token.substring(0, 10)}...`,
        });
        
        try {
          toast({
            title: "Verifying OTP",
            description: `Attempting verification with token: ${token.substring(0, 10)}...`,
          });
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (error) {
            toast({
              title: "OTP Verification Error",
              description: error.message,
              variant: "destructive",
            });
            throw error;
          }

          if (data.session) {
            toast({
              title: "OTP Verification Success",
              description: "Redirecting to reset password page",
            });
            
            const redirectState = {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token
            };
            
            navigate('/reset-password', {
              state: redirectState,
              replace: true
            });
            return;
          } else {
            toast({
              title: "No Session Data",
              description: "Verification successful but no session received",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Recovery Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }

      // Handle hash fragment for recovery tokens
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const hashType = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        toast({
          title: "Hash Parameters Found",
          description: `Type: ${hashType}, Has Access Token: ${!!accessToken}`,
        });
        
        if (hashType === 'recovery' && accessToken) {
          toast({
            title: "Recovery from Hash",
            description: "Redirecting to reset password page",
          });
          
          const redirectState = {
            accessToken,
            refreshToken
          };
          
          navigate('/reset-password', { 
            state: redirectState,
            replace: true
          });
          return;
        }
      }

      // Only redirect if there's an active session and we're on the auth page
      if (session?.user?.id && location.pathname === '/auth') {
        toast({
          title: "Active Session Detected",
          description: "Redirecting to home page",
        });
        navigate('/', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

  // If we're handling a recovery flow, don't show the auth UI
  if ((location.search && new URLSearchParams(location.search).get('type') === 'recovery') ||
      (location.hash && new URLSearchParams(location.hash.substring(1)).get('type') === 'recovery')) {
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