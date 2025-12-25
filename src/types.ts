
export enum Language {
  English = 'English',
  Sinhala = 'Sinhala'
}

// Added UserProfile interface as used in App.tsx to resolve missing export error
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  nic: string;
  phone: string;
}

// Added AppNotification interface as used in App.tsx to resolve missing export error
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  relatedInquiryId?: string;
}

export interface MedicineInfo {
  medicineName: string;
  description: string;
  uses: string;
  howToUse: string;
  priceRange: string;
  sideEffects: string[];
  foodInteractions: string;
  disclaimer: string;
}

export interface SymptomAnalysis {
  possibleConditions: string[];
  advice: string;
  suggestedMeds: string[];
  urgency: 'Low' | 'Medium' | 'High';
}

export interface InteractionResult {
  riskLevel: 'Low' | 'Moderate' | 'High';
  summary: string;
  details: string;
}

export interface PharmacyLocation {
  name: string;
  uri: string;
}

export interface DosageSchedule {
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
  notes: string;
}

export interface EmergencyInfo {
  situation: string;
  immediateActions: string[];
  thingsToAvoid: string[];
  emergencyContact: string;
  professionalAdvice: string;
}

export interface UserInquiry {
  id: string;
  userId: string; // Added userId field to resolve compilation errors on lines 249 and 264 of App.tsx
  medicineName: string;
  pricePaid: string;
  pharmacyName: string;
  location: string;
  date: string;
  nic: string;
  phone: string;
  billImage: string; // Base64
  status: 'Pending' | 'Reviewed' | 'Action Taken';
  submittedAt: string;
}

export type UserRole = 'USER' | 'ADMIN' | null;
