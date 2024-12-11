export const translations = {
  fr: {
    personalInfo: "Informations personnelles",
    fullName: "Nom complet",
    email: "Email",
    bio: "Biographie",
    subjects: "Matières",
    schoolLevels: "Niveaux scolaires",
    location: "Emplacement",
    teachingLocations: "Lieux d'enseignement",
    pricePerHour: "Prix par heure",
    saveProfile: "Enregistrer le profil",
    profileSaved: "Profil enregistré !",
    profileSavedDesc: "Votre profil d'enseignant a été enregistré avec succès.",
  },
  lb: {
    personalInfo: "Perséinlech Informatiounen",
    fullName: "Vollstännegen Numm",
    email: "Email",
    bio: "Biographie",
    subjects: "Fächer",
    schoolLevels: "Schoulniveauen",
    location: "Standuert",
    teachingLocations: "Unterrechtsplazen",
    pricePerHour: "Präis pro Stonn",
    saveProfile: "Profil späicheren",
    profileSaved: "Profil gespäichert!",
    profileSavedDesc: "Äre Profil gouf erfollegräich gespäichert.",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;