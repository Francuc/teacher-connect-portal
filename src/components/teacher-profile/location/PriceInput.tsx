import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

type PriceInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const PriceInput = ({ value, onChange }: PriceInputProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-500">€</span>
      <Input
        type="number"
        placeholder={t("pricePerHour")}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-32"
      />
    </div>
  );
};