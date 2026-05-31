/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ServiceCategory {
  ELDERLY_ASSISTANCE = "Elderly Assistance",
  MEDICINE_PICKUP = "Medicine Pickup",
  HOSPITAL_COMPANION = "Hospital Companion",
  BABYSITTING = "Babysitting",
  HOME_HELP = "Home Help",
  NURSE_VISIT = "Nurse Visit",
  PHYSIO_VISIT = "Physio Visit",
  QUEUE_SERVICE = "Queue Service",
}

export interface SubService {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice: number;
  durationOptions: Array<{ label: string; hours: number }>;
}

export enum BookingStatus {
  DRAFT = "Draft",
  MATCHING = "Matching State",
  ASSIGNED = "Assigned",
  ON_THE_WAY = "Helper On the Way",
  ARRIVED = "Helper Arrived",
  IN_PROGRESS = "Service in Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface RecipientDetails {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  specialNotes: string;
  medicalAlerts: string;
  mobilityStatus: "Fully Independent" | "Needs Walking Support" | "Wheelchair Bound" | "Bedridden";
}

export interface LocationDetails {
  address: string;
  landmark: string;
  type: "Home" | "Hospital" | "Clinic" | "Other";
}

export interface Booking {
  id: string;
  category: ServiceCategory;
  subService: SubService;
  recipient: RecipientDetails;
  location: LocationDetails;
  schedule: {
    type: "Now" | "Later Today" | "Tomorrow" | "Custom";
    timeString: string;
    customDate?: string;
  };
  additionalInstructions: string;
  selectedDuration: { label: string; hours: number };
  addOns: {
    priorityHelper: boolean; // +RM10
    femalePreference: boolean; // +RM5
    medicalTrained: boolean; // +RM15
    photoUpdates: boolean; // +RM0
    extraTime: boolean; // +RM15 (30 mins)
  };
  paymentMethod: "Card" | "FPX / Online Banking" | "E-wallet";
  pricing: {
    baseFee: number;
    distanceFee: number;
    extraTimeFee: number;
    platformFee: number;
    addOnsTotal: number;
    total: number;
  };
  status: BookingStatus;
  createdAt: string;
  helperId?: string;
  checkpoints: {
    arrivedPhoto?: string;
    medicineCollectedPhoto?: string;
    parentCheckedInPhoto?: string;
    completedPhoto?: string;
    arrivedTime?: string;
    medicineTime?: string;
    checkedInTime?: string;
    completedTime?: string;
  };
  rating?: {
    stars: number;
    punctual: boolean;
    respectful: boolean;
    wouldBookAgain: boolean;
    tags: string[];
    comments: string;
  };
}

export interface Helper {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  completedJobs: number;
  skills: ServiceCategory[];
  languages: string[];
  bio: string;
  isVerified: boolean;
  phoneNumber: string;
}

export interface Message {
  id: string;
  bookingId: string;
  sender: "customer" | "helper" | "system";
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  savedAddresses: Array<{ label: string; address: string }>;
  familyMembers: Array<RecipientDetails>;
  emergencyContacts: Array<{ name: string; relation: string; phone: string }>;
  medicalPreferences: string;
}
