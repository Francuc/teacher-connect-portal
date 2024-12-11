import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { type Subject, type SchoolLevel, type TeachingLocation } from "@/lib/constants";
import { PersonalInfoSection } from "./teacher-profile/PersonalInfoSection";
import { SubjectsSection } from "./teacher-profile/SubjectsSection";
import { LocationSection } from "./teacher-profile/LocationSection";
import { useLanguage } from "@/contexts/LanguageContext";

const TeacherProfileForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    subjects: [] as Subject[],
    schoolLevels: [] as SchoolLevel[],
    teachingLocations: [] as TeachingLocation[],
    location: "",
    pricePerHour: {
      teacherPlace: "",
      studentPlace: "",
      online: "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: t("profileSaved"),
      description: t("profileSavedDesc"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <PersonalInfoSection formData={formData} setFormData={setFormData} />
      <SubjectsSection formData={formData} setFormData={setFormData} />
      <LocationSection formData={formData} setFormData={setFormData} />

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {t("saveProfile")}
        </Button>
      </div>
    </form>
  );
};

export default TeacherProfileForm;