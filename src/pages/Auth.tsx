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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      toast({
        title: "Handling Auth Redirect",
        description: `Hash: ${location.hash}`,
      });

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
        toast({
          title: "Active Session Detected",
          description: "Redirecting to home page",
        });
        navigate('/', { replace: true });
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

  // If we're handling a recovery flow, show a loading state
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