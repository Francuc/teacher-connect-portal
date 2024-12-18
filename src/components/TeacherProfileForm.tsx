import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { PasswordResetBox } from "./auth/PasswordResetBox";

export default function TeacherProfileForm() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subjects: "",
    description: "",
    price_per_hour: "",
    location: "",
    online_possible: false,
    user_id: "",
  });

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (teacherId) {
          const { data, error } = await supabase
            .from("teachers")
            .select("*")
            .eq("user_id", teacherId)
            .single();

          if (error) throw error;

          if (data) {
            setFormData(data);
            setIsOwnProfile(session?.user?.id === data.user_id);
          }
        } else if (session) {
          setFormData(prev => ({ ...prev, user_id: session.user.id }));
          setIsOwnProfile(true);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile"
        });
      }
    };

    fetchTeacherProfile();
  }, [teacherId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = teacherId
        ? await supabase
            .from("teachers")
            .update(formData)
            .eq("user_id", teacherId)
        : await supabase
            .from("teachers")
            .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile saved successfully"
      });

      const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
      navigate(`/${prefix}`);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, online_possible: checked }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects</Label>
            <Input
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price_per_hour">Price per Hour</Label>
              <Input
                id="price_per_hour"
                name="price_per_hour"
                type="number"
                value={formData.price_per_hour}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="online_possible"
              checked={formData.online_possible}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="online_possible">Online lessons possible</Label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>

        {isOwnProfile && (
          <div className="mt-8">
            <PasswordResetBox />
          </div>
        )}
      </div>
    </div>
  );
}