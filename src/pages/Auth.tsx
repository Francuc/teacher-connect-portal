import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Check if user has a teacher profile
        const checkProfile = async () => {
          const { data: teacherProfile } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (teacherProfile) {
            // If profile exists, go to edit page
            navigate(`/profile/edit/${session.user.id}`);
          } else {
            // If no profile, go to create new profile page
            navigate("/profile/new");
          }
        };
        
        checkProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
      />
    </div>
  );
};

export default AuthPage;