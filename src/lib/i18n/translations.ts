import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';

export type Translation = {
  search: string;
  loading: string;
  required: string;
  signIn: string;
  signUp: string;
  signOut: string;
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  resetPassword: string;
  noAccount: string;
  hasAccount: string;
  or: string;
  error: string;
  success: string;
  submit: string;
  cancel: string;
  edit: string;
  delete: string;
  save: string;
  update: string;
  personalInfo: string;
  firstName: string;
  lastName: string;
  phone: string;
  facebookProfile: string;
  showInProfile: string;
  bio: string;
  subjects: string;
  addSubject: string;
  schoolLevels: string;
  addSchoolLevel: string;
  location: string;
  teachingLocation: string;
  studentLocation: string;
  pricePerHour: string;
  teacherPlace: string;
  studentPlace: string;
  online: string;
  city: string;
  region: string;
  selectCity: string;
  selectRegion: string;
  noResults: string;
  searchPlaceholder: string;
  addLocation: string;
  removeLocation: string;
  teacherProfile: string;
  editProfile: string;
  biography: string;
  teachingSubjects: string;
  teachingLevels: string;
  teachingLocations: string;
  price: string;
  hour: string;
  at: string;
  contactInformation: string;
  displayName: string;
  selectedLocation: string;
  errorLoadingProfile: string;
  profilePictureSizeError: string;
  profilePictureTypeError: string;
  // Adding missing translation keys
  findTeacher: string;
  landingDescription: string;
  selectProfile: string;
  createAd: string;
  errorLoadingCities: string;
  noCitiesAvailable: string;
  searchCity: string;
  noCityFound: string;
  cities: string;
  regions: string;
  personalInformation: string;
  name: string;
  startingFrom: string;
  viewProfile: string;
  allSubjects: string;
  allLevels: string;
};

export type TranslationKey = keyof Translation;

export const translations: Record<Language, Translation> = {
  en,
  fr,
  lb,
};