import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const CitiesFooter = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*, region:regions(*)')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
  });

  const getLocalizedName = (city: { name_en: string; name_fr: string; name_lb: string }) => {
    switch(language) {
      case 'fr':
        return city.name_fr;
      case 'lb':
        return city.name_lb;
      default:
        return city.name_en;
    }
  };

  const handleCityClick = (cityId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/?city=${cityId}`);
  };

  return (
    <footer className="bg-white border-t border-purple.soft/30 py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {cities?.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city.id)}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
            >
              {getLocalizedName(city)}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};