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

  const { data: cities = [], isLoading, error } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
        
        if (error) {
          console.error('Error fetching cities:', error)
          throw error
        }
        
        return data || []
      } catch (error) {
        console.error('Error in cities query:', error)
        return []
      }
    }
  })

  const getLocalizedName = (city: any) => {
    if (!city) return ''
    switch(language) {
      case 'fr':
        return city.name_fr
      case 'lb':
        return city.name_lb
      default:
        return city.name_en
    }
  }

  if (error) {
    console.error('Error in CityAutocomplete:', error)
    return (
      <Button variant="outline" className="w-full justify-between">
        {t("errorLoadingCities")}
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? cities.find((city) => getLocalizedName(city) === value)
              ? value
              : value
            : t("selectCity")}
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
            ) : cities && cities.length > 0 ? (
              cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={getLocalizedName(city)}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === getLocalizedName(city) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {getLocalizedName(city)}
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