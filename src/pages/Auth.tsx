import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Handle hash fragment for recovery tokens
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        
        if (type === 'recovery') {
          const accessToken = hashParams.get('access_token');
          if (accessToken) {
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
        navigate('/update-password', { state: { token } });
        return;
      }

      // Redirect authenticated users
      if (session) {
        navigate(`/profile/${session.user.id}`);
      }
    };

    handleAuthRedirect();
  }, [session, navigate, location]);

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