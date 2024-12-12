import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { createRandomTeachers } from "@/lib/createRandomTeachers";

export const RandomTeachersButton = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCreateRandomTeachers = async () => {
    try {
      console.log('Starting random teachers creation...');
      const result = await createRandomTeachers();
      console.log('Random teachers creation result:', result);
      
      toast({
        title: t("success"),
        description: t("success"),
      });
    } catch (error) {
      console.error('Error creating random teachers:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleCreateRandomTeachers}
      className="mb-4"
    >
      Create Random Teachers
    </Button>
  );
};