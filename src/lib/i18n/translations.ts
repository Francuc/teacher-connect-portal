import { en } from "./en";
import { fr } from "./fr";
import { lb } from "./lb";

export type Language = "en" | "fr" | "lb";

export type Translation = {
  welcome: string;
  signInOrSignUp: string;
  error: string;
  success: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  facebookProfile: string;
  showInProfile: string;
  personalInfo: string;
  bio: string;
  biography: string;
  findTeacher: string;
  landingDescription: string;
  selectProfile: string;
  myProfile: string;
  createAd: string;
  loading: string;
  errorLoadingCities: string;
  noCitiesAvailable: string;
  selectCity: string;
  searchCity: string;
  noCityFound: string;
  profilePictureSizeError: string;
  profilePictureTypeError: string;
  personalInformation: string;
  name: string;
  contactInformation: string;
  schoolLevels: string;
  subjects: string;
  teachingLocations: string;
  regions: string;
  cities: string;
  pricePerHour: string;
  availableIn: string;
  viewProfile: string;
  search: string;
  searchPlaceholder: string;
  allSubjects: string;
  allLevels: string;
  noResults: string;
  teacherPlace: string;
  studentPlace: string;
  online: string;
  selectedLocation: string;
  password: string;
  signIn: string;
  signUp: string;
  emailAlreadyExists: string;
  errorLoadingProfile: string;
  signOut: string;
};

export type TranslationKey = keyof Translation;

export const translations = {
  en,
  fr,
  lb,
};
