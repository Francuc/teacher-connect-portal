import { formatPrice } from "@/lib/utils";

type PriceDisplayProps = {
  price: string;
  onClick: () => void;
};

export const PriceDisplay = ({ price, onClick }: PriceDisplayProps) => {
  return (
    <div 
      onClick={onClick}
      className="p-3 border rounded-md cursor-pointer hover:bg-accent"
    >
      {formatPrice(price)}
    </div>
  );
};