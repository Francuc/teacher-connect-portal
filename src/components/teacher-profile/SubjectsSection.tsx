import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "lucide-react";
import { SUBJECTS, SCHOOL_LEVELS, type Subject, type SchoolLevel } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

type SubjectsSectionProps = {
  formData: {
    subjects: Subject[];
    schoolLevels: SchoolLevel[];
  };
  setFormData: (data: any) => void;
};

export const SubjectsSection = ({ formData, setFormData }: SubjectsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          {t("subjects")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("subjects")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={formData.subjects.includes(subject)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      subjects: checked
                        ? [...formData.subjects, subject]
                        : formData.subjects.filter((s) => s !== subject),
                    });
                  }}
                />
                <Label htmlFor={subject}>{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("schoolLevels")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SCHOOL_LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={formData.schoolLevels.includes(level)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      schoolLevels: checked
                        ? [...formData.schoolLevels, level]
                        : formData.schoolLevels.filter((l) => l !== level),
                    });
                  }}
                />
                <Label htmlFor={level}>{level}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};