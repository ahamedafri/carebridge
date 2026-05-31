/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceCategory, SubService, Helper, UserProfile } from "../types";

export const MOCK_SUB_SERVICES: SubService[] = [
  // ELDERLY_ASSISTANCE
  {
    id: "sub-ea-1",
    category: ServiceCategory.ELDERLY_ASSISTANCE,
    name: "Companion at Home",
    description: "Caregiver spends quiet time keeping your parents company, conversing, playing games, or doing simple light walks.",
    basePrice: 50,
    durationOptions: [
      { label: "2 Hours", hours: 2 },
      { label: "4 Hours (Half Day)", hours: 4 },
      { label: "8 Hours (Full Day)", hours: 8 }
    ]
  },
  {
    id: "sub-ea-2",
    category: ServiceCategory.ELDERLY_ASSISTANCE,
    name: "Check-in Visit",
    description: "Brief 1-hour visual visit to verify your parent's wellness, stock up water, check general mood, and report back.",
    basePrice: 30,
    durationOptions: [
      { label: "1 Hour", hours: 1 }
    ]
  },
  {
    id: "sub-ea-3",
    category: ServiceCategory.ELDERLY_ASSISTANCE,
    name: "Errand Support",
    description: "Help with grocery shopping, paying utility bills, or visiting local shops around the neighborhood.",
    basePrice: 40,
    durationOptions: [
      { label: "2 Hours", hours: 2 },
      { label: "4 Hours", hours: 4 }
    ]
  },

  // MEDICINE_PICKUP
  {
    id: "sub-mp-1",
    category: ServiceCategory.MEDICINE_PICKUP,
    name: "Pharmacy/Hospital Pickup",
    description: "Pick up routine prescription refills from government hospitals (e.g. HKL, PPUM) or private pharmacies and deliver with instructions.",
    basePrice: 35,
    durationOptions: [
      { label: "Flexible Delivery", hours: 2 }
    ]
  },
  {
    id: "sub-mp-2",
    category: ServiceCategory.MEDICINE_PICKUP,
    name: "Medicine Reminder Visit",
    description: "In-persion visit to organize pillboxes, explain medication doses, and supervise the first ingestion.",
    basePrice: 30,
    durationOptions: [
      { label: "1 Hour", hours: 1 }
    ]
  },

  // HOSPITAL_COMPANION
  {
    id: "sub-hc-1",
    category: ServiceCategory.HOSPITAL_COMPANION,
    name: "Hospital Accompaniment",
    description: "Accompany parent from their home to the hospital, stay with them through outpatient queues, translate medical advice, and return home.",
    basePrice: 70,
    durationOptions: [
      { label: "4 Hours (Standard Appt)", hours: 4 },
      { label: "6 Hours (Extended Wait)", hours: 6 },
      { label: "8 Hours (Full Day)", hours: 8 }
    ]
  },

  // BABYSITTING
  {
    id: "sub-bs-1",
    category: ServiceCategory.BABYSITTING,
    name: "Emergency Babysitting",
    description: "On-demand reliable home babysitting for children when parents run late, attend emergency meetings or hospital visits.",
    basePrice: 45,
    durationOptions: [
      { label: "3 Hours", hours: 3 },
      { label: "5 Hours", hours: 5 }
    ]
  },

  // HOME_HELP
  {
    id: "sub-hh-1",
    category: ServiceCategory.HOME_HELP,
    name: "House Quick Fixes",
    description: "Handy support for light leaks, changing burnt-out lightbulbs, tighting handles, or minor plug repairs.",
    basePrice: 40,
    durationOptions: [
      { label: "1.5 Hours", hours: 1.5 },
      { label: "3 Hours", hours: 3 }
    ]
  },

  // NURSE_VISIT
  {
    id: "sub-nv-1",
    category: ServiceCategory.NURSE_VISIT,
    name: "Basic Care & Injection support",
    description: "Registered nurse visit for wound dressing, blood sugar checks, insulin instruction, or scheduled intramuscular injections.",
    basePrice: 90,
    durationOptions: [
      { label: "1 Hour Professional Care", hours: 1 }
    ]
  },
  {
    id: "sub-nv-2",
    category: ServiceCategory.NURSE_VISIT,
    name: "Post-Discharge Care Package",
    description: "Active clinical monitoring, vital support checks, and status reports for patients newly discharged from surgical procedures.",
    basePrice: 120,
    durationOptions: [
      { label: "2 Hours Clinical Care", hours: 2 },
      { label: "4 Hours Extended Monitoring", hours: 4 }
    ]
  },

  // PHYSIO_VISIT
  {
    id: "sub-pv-1",
    category: ServiceCategory.PHYSIO_VISIT,
    name: "Home Physiotherapy Sessions",
    description: "Qualified physiotherapist visits to conduct therapeutic stretch exercises, rehabilitation after stroke or fractures, and mobility drills.",
    basePrice: 110,
    durationOptions: [
      { label: "1 Hour Session", hours: 1 }
    ]
  },

  // QUEUE_SERVICE
  {
    id: "sub-qs-1",
    category: ServiceCategory.QUEUE_SERVICE,
    name: "Government Offices / Clinics Queue",
    description: "Helper lines up on your behalf at Immigration, EPF offices, peak clinics, or crowded government counters, letting you arrive right in time.",
    basePrice: 30,
    durationOptions: [
      { label: "2 Hours Queuing", hours: 2 },
      { label: "4 Hours Queuing", hours: 4 }
    ]
  }
];

export const MOCK_HELPERS: Helper[] = [
  {
    id: "helper-1",
    name: "Sarah binti Ahmad",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    completedJobs: 142,
    skills: [ServiceCategory.ELDERLY_ASSISTANCE, ServiceCategory.HOSPITAL_COMPANION, ServiceCategory.MEDICINE_PICKUP],
    languages: ["Malay (Bilingual)", "English (Fluent)", "Tamil (Basic)"],
    bio: "Passionate caregiver with over 4 years of experience supporting elderly parents. Certified in home first-aid. Very patient and an active listener.",
    isVerified: true,
    phoneNumber: "+60 12-345 6789"
  },
  {
    id: "helper-2",
    name: "Dr. Kelvin Wong",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    rating: 5.0,
    completedJobs: 88,
    skills: [ServiceCategory.PHYSIO_VISIT, ServiceCategory.ELDERLY_ASSISTANCE],
    languages: ["English (Fluent)", "Mandarin (Native)", "Malay (Fluent)", "Cantonese"],
    bio: "Licensed Physiotherapist specialized in post-stroke recovery and geriatric mobility exercises. Believes in helping elders regain dignity through movement.",
    isVerified: true,
    phoneNumber: "+60 17-987 6543"
  },
  {
    id: "helper-3",
    name: "Amirul bin Zain",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 4.85,
    completedJobs: 210,
    skills: [ServiceCategory.MEDICINE_PICKUP, ServiceCategory.QUEUE_SERVICE, ServiceCategory.HOME_HELP],
    languages: ["Malay (Native)", "English (Conversational)"],
    bio: "Super active Kuala Lumpur runner. Fast at handling prescriptions and government office queues. Reliable, punctual, and knows the best short routes.",
    isVerified: true,
    phoneNumber: "+60 19-334 1122"
  },
  {
    id: "helper-4",
    name: "Nurse Priya Nair",
    photoUrl: "https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=300&q=80",
    rating: 4.95,
    completedJobs: 64,
    skills: [ServiceCategory.NURSE_VISIT, ServiceCategory.ELDERLY_ASSISTANCE, ServiceCategory.HOSPITAL_COMPANION],
    languages: ["English (Fluent)", "Tamil (Native)", "Malay (Fluent)"],
    bio: "Registered Nurse with 5 years hospital ward experience. Specialized in diabetic wound management and safe home administration of elderly medication.",
    isVerified: true,
    phoneNumber: "+60 11-234 5566"
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Mafa",
  email: "mafa.family@gmail.com",
  phone: "+60 16-123 4567",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  savedAddresses: [
    { label: "Home (Cheras)", address: "No. 12, Jalan Perdana 3/4, Taman Segar, Cheras, 56100 Kuala Lumpur" },
    { label: "Father's House (Petaling Jaya)", address: "Block B-7-3, SS2 Condominium, Jalan SS2/72, 47300 Petaling Jaya, Selangor" },
    { label: "Lembah Pantai Clinic", address: "Klinik Kesihatan Pantai, Jalan Pantai Dalam, 59200 Kuala Lumpur" }
  ],
  familyMembers: [
    {
      name: "Encik Ibrahim (Father)",
      age: 72,
      gender: "Male",
      specialNotes: "Hard of hearing, speaks mostly Malay. Needs help standing up.",
      medicalAlerts: "Hypertension medication at 10 AM, heart patient.",
      mobilityStatus: "Needs Walking Support"
    },
    {
      name: "Puan Aminah (Mother)",
      age: 68,
      gender: "Female",
      specialNotes: "Extremely warm, loves chatting. Likes tea.",
      medicalAlerts: "Type II diabetes. Follows strict diet.",
      mobilityStatus: "Fully Independent"
    }
  ],
  emergencyContacts: [
    { name: "Mafa (Daughter / You)", relation: "Daughter (Primary Account Owner)", phone: "+60 16-123 4567" },
    { name: "Ahmad Suffian (Brother)", relation: "Son", phone: "+60 12-998 8776" }
  ],
  medicalPreferences: "Prefer hospital appointments at Sunway Medical Centre or PPUM. Emergency care is directed to Pantai Hospital Bangsar."
};
