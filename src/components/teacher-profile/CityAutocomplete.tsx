import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/contexts/LanguageContext"

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const { language, t } = useLanguage()

  const { data: cities = [], isLoading, isError } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select(`
            *,
            region:regions(
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .order('name_en');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
      }
    },
  })

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  }

  const getCityWithRegion = (city: any) => {
    if (!city || !city.region) return '';
    const cityName = getLocalizedName(city);
    const regionName = getLocalizedName(city.region);
    return `${cityName}, ${regionName}`;
  }

  const selectedCity = React.useMemo(() => {
    if (!value || !cities) return null;
    return cities.find((city) => city.id === value);
  }, [value, cities]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            t("loading")
          ) : selectedCity ? (
            getCityWithRegion(selectedCity)
          ) : (
            t("selectCity")
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t("searchCity")} />
          <CommandEmpty>{t("noCityFound")}</CommandEmpty>
          <CommandGroup>
            {isLoading ? (
              <CommandItem disabled>{t("loading")}</CommandItem>
            ) : isError ? (
              <CommandItem disabled>{t("errorLoadingCities")}</CommandItem>
            ) : cities && cities.length > 0 ? (
              cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={getCityWithRegion(city)}
                  onSelect={() => {
                    onChange(city.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {getCityWithRegion(city)}
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>{t("noCitiesAvailable")}</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}