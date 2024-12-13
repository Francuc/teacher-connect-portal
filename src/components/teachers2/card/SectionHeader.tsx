import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
  return (
    <h4 className="font-semibold flex items-center gap-2 h-8">
      <Icon className="w-4 h-4" />
      {title}
    </h4>
  );
};