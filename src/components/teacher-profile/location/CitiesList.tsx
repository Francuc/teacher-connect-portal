import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/LanguageContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { type TeachingLocation } from "@/lib/constants"

type CitiesListProps = {
  formData: {
    teachingLocations: TeachingLocation[];
    teacherCity: string;
    studentRegions: string[];
    studentCities: string[];
    pricePerHour: {
      teacherPlace: string;
      studentPlace: string;
      online: string;
    };
  };
  setFormData: (data: any) => void;
};

export const CitiesList = ({ formData, setFormData }: CitiesListProps) => {
  const { t, language } = useLanguage()

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('*')
        if (error) throw error
        return data || []
      } catch (error) {
        console.error('Error fetching regions:', error)
        return []
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 300000, // 5 minutes
  })

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', formData.studentRegions],
    queryFn: async () => {
      if (formData.studentRegions.length === 0) return []

      try {
        const selectedRegionIds = regions
          .filter(region => 
            formData.studentRegions.includes(
              language === 'fr' ? region.name_fr : 
              language === 'lb' ? region.name_lb : 
              region.name_en
            )
          )
          .map(region => region.id)

        if (selectedRegionIds.length === 0) {
          return []
        }

        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .in('region_id', selectedRegionIds)

        if (error) throw error
        return data || []
      } catch (error) {
        console.error('Error in cities query:', error)
        return []
      }
    },
    enabled: formData.studentRegions.length > 0 && regions.length > 0,
    retry: 3,
    retryDelay: 1000,
    staleTime: 300000, // 5 minutes
  })

  const getLocalizedName = (item: any) => {
    if (!item) return ''
    switch(language) {
      case 'fr':
        return item.name_fr
      case 'lb':
        return item.name_lb
      default:
        return item.name_en
    }
  }

  if (isLoadingRegions || isLoadingCities) {
    return <div className="text-sm text-muted-foreground">{t("loading")}</div>
  }

  if (!cities || cities.length === 0) {
    return <div className="text-sm text-muted-foreground">{t("noCitiesAvailable")}</div>
  }

  return (
    <div className="space-y-2">
      <Label>{t("cities")}</Label>
      <div className="grid grid-cols-2 gap-2">
        {cities.map((city) => (
          <div key={city.id} className="flex items-center space-x-2">
            <Checkbox
              id={`city-${city.id}`}
              checked={formData.studentCities.includes(getLocalizedName(city))}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  studentCities: checked
                    ? [...formData.studentCities, getLocalizedName(city)]
                    : formData.studentCities.filter(
                        (c) => c !== getLocalizedName(city)
                      ),
                })
              }
            />
            <Label htmlFor={`city-${city.id}`}>{getLocalizedName(city)}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}