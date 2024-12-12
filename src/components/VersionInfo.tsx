import { VERSION, VERSION_DATE } from "@/version";

export const VersionInfo = () => {
  return (
    <div className="text-xs text-muted-foreground">
      Version {VERSION} ({VERSION_DATE})
    </div>
  );
};