import { useState } from "react";

export const useTeachersFilter = (initialSearchQuery = "") => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  return {
    selectedSubject,
    setSelectedSubject,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
  };
};