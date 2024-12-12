import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  fr,
  lb,
} as const;

export const lb = {
  firstName: "Virst Numm",
  lastName: "Familljenumm",
  email: "E-Mail",
  phone: "Telefonsnummer",
  facebookProfile: "Facebook Profil",
  showInProfile: "Wéilt Dir dat an Ärem Profil weisen?",
  bio: "Biografie",
  personalInfo: "Perséinlech Informatioun",
  subjects: "Fächer",
  schoolLevels: "Schoul Niveauen",
  teachingLocations: "Léierplazen",
  teacherCity: "Stad vum Léier",
  priceRequired: "Präis ass erfuerderlech",
  profileSaved: "Profil gespäichert",
  error: "Feeler",
  pleaseLoginFirst: "Bitte loggt Iech éischt",
  success: "Succès",
  updateProfile: "Profil aktualiséieren",
  saveProfile: "Profil späicheren",
  emailAlreadyExists: "E Profil mat dëser E-Mail existéiert schon",
  profileAlreadyExists: "Dir hutt schon e Léierprofil",
};
