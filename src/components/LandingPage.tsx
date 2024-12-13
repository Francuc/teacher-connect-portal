import { TeachersGrid2 } from "./teachers2/TeachersGrid2";
import { SubjectFilterHeader } from "./SubjectFilterHeader";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SubjectFilterHeader />
      <TeachersGrid2 />
    </div>
  );
};