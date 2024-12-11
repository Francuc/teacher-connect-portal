import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  SUBJECTS,
  SCHOOL_LEVELS,
  TEACHING_LOCATIONS,
  type Subject,
  type SchoolLevel,
  type TeachingLocation,
} from "@/lib/constants";
import { User, MapPin, Book, School, Globe, DollarSign } from "lucide-react";

const TeacherProfileForm = () => {
  const { toast } = useToast();
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
      title: "Profile Saved!",
      description: "Your teacher profile has been successfully saved.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="h-32"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Subjects & Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Subjects</Label>
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
            <Label>School Levels</Label>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location & Teaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Your Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="City, State"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Teaching Locations</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEACHING_LOCATIONS.map((location) => (
                <div key={location} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={formData.teachingLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          teachingLocations: checked
                            ? [...formData.teachingLocations, location]
                            : formData.teachingLocations.filter(
                                (l) => l !== location
                              ),
                        });
                      }}
                    />
                    <Label htmlFor={location}>{location}</Label>
                  </div>
                  {formData.teachingLocations.includes(location) && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <Input
                        type="number"
                        placeholder="Price per hour"
                        value={
                          formData.pricePerHour[
                            location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
                          ]
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricePerHour: {
                              ...formData.pricePerHour,
                              [location
                                .toLowerCase()
                                .replace("'s", "")
                                .split(" ")[0]]: e.target.value,
                            },
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default TeacherProfileForm;