import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { createRandomTeachers } from "@/lib/createRandomTeachers";
import { useQueryClient } from "@tanstack/react-query";

export const RandomTeachersButton = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const handleCreateRandomTeachers = async () => {
    try {
      console.log('Starting random teachers creation...');
      const result = await createRandomTeachers(10);
      console.log('Random teachers creation result:', result);
      
      // Invalidate the teachers query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['teachers'] });
      
      toast({
        title: t("success"),
        description: `Successfully created ${result.length} random teachers`,
      });
    } catch (error) {
      console.error('Error creating random teachers:', error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleCreateRandomTeachers}
      className="h-12 px-6 text-base"
    >
      Create Random Teachers
    </Button>
  );
};