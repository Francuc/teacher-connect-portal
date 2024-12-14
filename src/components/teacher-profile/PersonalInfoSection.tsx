import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type PersonalInfoProps = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    facebookProfile: string;
    showEmail: boolean;
    showPhone: boolean;
    showFacebook: boolean;
    profilePicture: File | null;
    profilePictureUrl?: string;
  };
  setFormData: (data: any) => void;
};

export const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("profilePictureSizeError"),
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("profilePictureTypeError"),
        });
        return;
      }

      setFormData({ 
        ...formData, 
        profilePicture: file,
        profilePictureUrl: URL.createObjectURL(file)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {t("personalInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              {(formData.profilePictureUrl || formData.profilePicture) ? (
                <AvatarImage 
                  src={formData.profilePictureUrl || (formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : '')} 
                  alt={`${formData.firstName} ${formData.lastName}`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-4 h-4 text-white" />
            </label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="showEmail"
              checked={formData.showEmail}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, showEmail: checked })
              }
            />
            <Label htmlFor="showEmail" className="text-sm text-muted-foreground">{t("showInProfile")}</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="showPhone"
              checked={formData.showPhone}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, showPhone: checked })
              }
            />
            <Label htmlFor="showPhone" className="text-sm text-muted-foreground">{t("showInProfile")}</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebookProfile">{t("facebookProfile")}</Label>
          <Input
            id="facebookProfile"
            type="url"
            value={formData.facebookProfile}
            onChange={(e) =>
              setFormData({ ...formData, facebookProfile: e.target.value })
            }
            placeholder="https://facebook.com/profile"
          />
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="showFacebook"
              checked={formData.showFacebook}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, showFacebook: checked })
              }
            />
            <Label htmlFor="showFacebook" className="text-sm text-muted-foreground">{t("showInProfile")}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};