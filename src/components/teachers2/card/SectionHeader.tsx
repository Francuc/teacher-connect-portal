import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
  return (
    <h4 className="font-semibold flex items-center gap-1 text-sm h-5">
      <Icon className="w-3 h-3" />
      {title}
    </h4>
  );
};