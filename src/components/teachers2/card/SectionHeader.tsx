import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
  return (
    <h4 className="font-semibold flex items-center gap-1.5 h-6 text-sm">
      <Icon className="w-3.5 h-3.5" />
      {title}
    </h4>
  );
};