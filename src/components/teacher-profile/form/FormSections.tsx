import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonalInfoSection } from "../PersonalInfoSection";
import { LocationSection } from "../LocationSection";
import { BiographySection } from "../BiographySection";
import { SubjectsSection } from "../SubjectsSection";
import { SchoolLevelsSection } from "../SchoolLevelsSection";
import { SubscriptionSection } from "../SubscriptionSection";
import { useAuth } from "@/hooks/useAuth";
import { type FormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FormSectionsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isUpdate: boolean;
}

export const FormSections = ({ 
  formData, 
  setFormData, 
  isLoading, 
  onSubmit,
  isUpdate
}: FormSectionsProps) => {
  const { t } = useLanguage();
  const { session } = useAuth();

  console.log('FormSections - subscription data:', {
    status: formData.subscription_status,
    type: formData.subscription_type,
    endDate: formData.subscription_end_date,
    promoCode: formData.promo_code
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {isUpdate && session?.user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Current Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={formData.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {formData.subscription_status || 'inactive'}
                </Badge>
              </div>
              {formData.subscription_type && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <Badge variant="outline">{formData.subscription_type}</Badge>
                </div>
              )}
              {formData.subscription_end_date && (
                <div>
                  <span className="font-medium">Valid until:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(formData.subscription_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {formData.promo_code && (
                <div>
                  <span className="font-medium">Promo code:</span>
                  <p className="font-mono bg-purple-50 px-2 py-1 rounded inline-block ml-2">
                    {formData.promo_code}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoSection formData={formData} setFormData={setFormData} />
          {isUpdate && session?.user && (
            <SubscriptionSection 
              profile={{
                user_id: session.user.id,
                subscription_status: formData.subscription_status,
                subscription_type: formData.subscription_type,
                subscription_end_date: formData.subscription_end_date,
                promo_code: formData.promo_code
              }} 
              isOwnProfile={true}
            />
          )}
        </div>
        <BiographySection formData={formData} setFormData={setFormData} />
        <SubjectsSection 
          subjects={formData.subjects} 
          onSubjectsChange={(subjects) => setFormData({ ...formData, subjects })}
          isEditing={true}
        />
        <SchoolLevelsSection 
          schoolLevels={formData.schoolLevels}
          onSchoolLevelsChange={(schoolLevels) => setFormData({ ...formData, schoolLevels })}
          isEditing={true}
        />
        <LocationSection formData={formData} setFormData={setFormData} />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdate ? t("update_profile") : t("save_profile")}
          </Button>
        </div>
      </form>
    </div>
  );
};