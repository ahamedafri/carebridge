/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Booking, 
  BookingStatus, 
  Helper, 
  Message, 
  ServiceCategory, 
  SubService, 
  UserProfile 
} from "../types";
import { DEFAULT_USER_PROFILE, MOCK_HELPERS } from "../data/mockData";

export interface AppContextType {
  currentView: string; // 'splash' | 'onboarding' | 'login' | 'home' | 'select_service' | 'booking_form' | 'pricing_confirmation' | 'matching' | 'helper_assigned' | 'live_tracking' | 'completion_rating' | 'bookings_tab' | 'messages_tab' | 'wallet_tab' | 'profile_tab'
  previousView: string | null;
  selectedCategory: ServiceCategory | null;
  selectedSubService: SubService | null;
  activeBooking: Booking | null;
  bookingsHistory: Booking[];
  messages: Message[];
  currentUser: UserProfile;
  activeHelper: Helper | null;
  matchingProgress: number; // 0 to 100
  matchingStep: number; // 0: searching, 1: verifying, 2: assigning, 3: completed
  
  // Navigation actions
  navigate: (view: string) => void;
  goBack: () => void;
  selectCategoryAction: (category: ServiceCategory) => void;
  selectSubServiceAction: (sub: SubService) => void;
  
  // Booking actions
  initiateBooking: (sub: SubService) => void;
  updateDraftBooking: (updates: Partial<Booking>) => void;
  confirmBookingOrder: () => void;
  cancelBookingAction: (id: string) => void;
  rebookAction: (booking: Booking) => void;
  submitRatingAction: (stars: number, feedback: { punctual: boolean; respectful: boolean; wouldBookAgain: boolean; comments: string; tags: string[] }) => void;
  
  // Message actions
  sendUserMessage: (text: string) => void;
  sendHelperQuickReply: (text: string) => void;

  // Simulator actions
  startHelperSimulation: () => void;
  progressSimulationStep: () => void;
  simulateCheckpointUpload: (checkpoint: "arrivedPhoto" | "medicineCollectedPhoto" | "parentCheckedInPhoto" | "completedPhoto") => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<string>("splash");
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  
  // History starts with a pre-filled past booking to look authentic and realistic
  const [bookingsHistory, setBookingsHistory] = useState<Booking[]>([
    {
      id: "bk-prev",
      category: ServiceCategory.MEDICINE_PICKUP,
      subService: {
        id: "sub-mp-1",
        category: ServiceCategory.MEDICINE_PICKUP,
        name: "Pharmacy/Hospital Pickup",
        description: "Pick up routine prescription refills from government hospitals (e.g. HKL, PPUM) or private pharmacies and deliver with instructions.",
        basePrice: 35,
        durationOptions: [{ label: "Flexible Delivery", hours: 2 }]
      },
      recipient: DEFAULT_USER_PROFILE.familyMembers[0], // Father En. Ibrahim
      location: {
        address: "No. 12, Jalan Perdana 3/4, Taman Segar, Cheras, 56100 Kuala Lumpur",
        landmark: "Home (Cheras)",
        type: "Home"
      },
      schedule: {
        type: "Custom",
        timeString: "10:30 AM",
        customDate: "2026-05-25"
      },
      additionalInstructions: "Please ask pharmacist if we should keep this in the fridge. Thank you.",
      selectedDuration: { label: "Flexible Delivery", hours: 2 },
      addOns: {
        priorityHelper: false,
        femalePreference: false,
        medicalTrained: true,
        photoUpdates: true,
        extraTime: false
      },
      paymentMethod: "Card",
      pricing: {
        baseFee: 35,
        distanceFee: 5.5,
        extraTimeFee: 0,
        platformFee: 2.0,
        addOnsTotal: 15,
        total: 57.5
      },
      status: BookingStatus.COMPLETED,
      createdAt: "2026-05-25T09:00:00Z",
      helperId: "helper-4", // Nurse Priya
      checkpoints: {
        arrivedPhoto: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80", // clinical check
        medicineCollectedPhoto: "https://images.unsplash.com/photo-1547847436-137a893d9972?auto=format&fit=crop&w=400&q=80", // medicines list
        parentCheckedInPhoto: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80", // checked in
        completedPhoto: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80", // warm handshake
        arrivedTime: "10:15 AM",
        medicineTime: "10:28 AM",
        checkedInTime: "10:45 AM",
        completedTime: "11:22 AM"
      },
      rating: {
        stars: 5,
        punctual: true,
        respectful: true,
        wouldBookAgain: true,
        tags: ["Professional", "Kind", "Helpful"],
        comments: "Nurse Priya was outstanding. She was very meticulous and even explained each drug dosage clearly to my dad."
      }
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init-1",
      bookingId: "bk-prev",
      sender: "system",
      text: "Booking completed. Your feedback has been sent to Priya. Thank you for choosing CareBridge!",
      timestamp: "11:30 AM"
    }
  ]);

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [activeHelper, setActiveHelper] = useState<Helper | null>(null);
  
  // Matching Animation States
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchingStep, setMatchingStep] = useState(0);

  // Simple Router
  const navigate = (view: string) => {
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentView(prev);
    } else {
      setCurrentView("home");
    }
  };

  const selectCategoryAction = (category: ServiceCategory) => {
    setSelectedCategory(category);
    navigate("select_service");
  };

  const selectSubServiceAction = (sub: SubService) => {
    setSelectedSubService(sub);
    initiateBooking(sub);
  };

  const initiateBooking = (sub: SubService) => {
    const id = "bk-" + Math.floor(Math.random() * 10000);
    const draft: Booking = {
      id,
      category: sub.category,
      subService: sub,
      recipient: currentUser.familyMembers[0] || {
        name: currentUser.name,
        age: 32,
        gender: "Female",
        specialNotes: "",
        medicalAlerts: "",
        mobilityStatus: "Fully Independent"
      },
      location: {
        address: currentUser.savedAddresses[0]?.address || "Kuala Lumpur, Malaysia",
        landmark: currentUser.savedAddresses[0]?.label || "Home",
        type: "Home"
      },
      schedule: {
        type: "Now",
        timeString: "Within 30 mins"
      },
      additionalInstructions: "",
      selectedDuration: sub.durationOptions[0] || { label: "1 Hour", hours: 1 },
      addOns: {
        priorityHelper: false,
        femalePreference: false,
        medicalTrained: false,
        photoUpdates: true,
        extraTime: false
      },
      paymentMethod: "Card",
      pricing: {
        baseFee: sub.basePrice,
        distanceFee: 4.5,
        extraTimeFee: 0,
        platformFee: 2.0,
        addOnsTotal: 0,
        total: sub.basePrice + 4.5 + 2.0
      },
      status: BookingStatus.DRAFT,
      createdAt: new Date().toISOString(),
      checkpoints: {}
    };
    setActiveBooking(draft);
    navigate("booking_form");
  };

  // Recalculate price whenever updates to durations / add-ons happen
  const updateDraftBooking = (updates: Partial<Booking>) => {
    if (!activeBooking) return;

    const newBooking = { ...activeBooking, ...updates };

    // Calculate add-on cost
    let addOnsCost = 0;
    if (newBooking.addOns.priorityHelper) addOnsCost += 10;
    if (newBooking.addOns.femalePreference) addOnsCost += 5;
    if (newBooking.addOns.medicalTrained) addOnsCost += 15;
    if (newBooking.addOns.extraTime) addOnsCost += 15; // Extra 30 mins

    const base = newBooking.subService.basePrice;
    const distanceFee = newBooking.location.landmark.includes("PJ") || newBooking.location.landmark.includes("Father's") ? 6.5 : 4.5;
    const platform = 2.0;
    const total = base + distanceFee + platform + addOnsCost;

    newBooking.pricing = {
      baseFee: base,
      distanceFee,
      extraTimeFee: newBooking.addOns.extraTime ? 15 : 0,
      platformFee: platform,
      addOnsTotal: addOnsCost,
      total
    };

    setActiveBooking(newBooking);
  };

  // Triggers Screen 7 -> Screen 8 Matching
  const confirmBookingOrder = () => {
    if (!activeBooking) return;
    
    const updated = {
      ...activeBooking,
      status: BookingStatus.MATCHING,
      createdAt: new Date().toISOString()
    };
    setActiveBooking(updated);
    navigate("matching");

    // Initialize simulation automatically
    setMatchingProgress(0);
    setMatchingStep(0);
  };

  // Interactive step-by-step matchmaking simulator
  useEffect(() => {
    if (currentView === "matching" && activeBooking?.status === BookingStatus.MATCHING) {
      let currentProgress = 0;
      let stepNum = 0;

      const interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          // Match helper based on skill or fallback
          const matchedId = activeBooking.category === ServiceCategory.PHYSIO_VISIT ? "helper-2" :
                            activeBooking.category === ServiceCategory.NURSE_VISIT ? "helper-4" :
                            activeBooking.category === ServiceCategory.MEDICINE_PICKUP ? "helper-3" : "helper-1";
          
          const chosenHelper = MOCK_HELPERS.find(h => h.id === matchedId) || MOCK_HELPERS[0];
          
          setActiveHelper(chosenHelper);
          setMatchingProgress(100);
          setMatchingStep(3);

          // Auto update active booking is matched
          const updated = {
            ...activeBooking,
            status: BookingStatus.ASSIGNED,
            helperId: chosenHelper.id
          };
          setActiveBooking(updated);

          // Add greeting system message
          const welcomeMessage: Message = {
            id: "msg-" + Date.now(),
            bookingId: activeBooking.id,
            sender: "system",
            text: `CareBridge: ${chosenHelper.name} has been assigned to your request! They are now preparing and will head towards your recipient shortly.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          const helloMessage: Message = {
            id: "msg-h-" + Date.now(),
            bookingId: activeBooking.id,
            sender: "helper",
            text: `Hello Mafa, I've accepted your order for "${activeBooking.subService.name}". I'm preparing to depart soon. Do you have any last-minute reminders for ${activeBooking.recipient.name}?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => [...prev, welcomeMessage, helloMessage]);
          
          // Jump to Helper Assigned Screen
          setTimeout(() => {
            navigate("helper_assigned");
          }, 1200);

        } else {
          if (currentProgress < 35) {
            stepNum = 0; // searching
          } else if (currentProgress < 75) {
            stepNum = 1; // verifying
          } else {
            stepNum = 2; // assigning
          }
          setMatchingProgress(currentProgress);
          setMatchingStep(stepNum);
        }
      }, 200); // Quick match in ~4 seconds for high-paced interactivity

      return () => clearInterval(interval);
    }
  }, [currentView, activeBooking]);

  const cancelBookingAction = (id: string) => {
    if (activeBooking && activeBooking.id === id) {
      setActiveBooking(null);
    }
    setBookingsHistory(prev => prev.map(b => b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b));
    navigate("home");
  };

  const rebookAction = (booking: Booking) => {
    // Fill active booking draft with details from historic entry
    const id = "bk-" + Math.floor(Math.random() * 10000);
    const draft: Booking = {
      ...booking,
      id,
      status: BookingStatus.DRAFT,
      createdAt: new Date().toISOString(),
      checkpoints: {},
      rating: undefined,
      helperId: undefined
    };
    setActiveBooking(draft);
    setSelectedCategory(booking.category);
    setSelectedSubService(booking.subService);
    navigate("booking_form");
  };

  const submitRatingAction = (stars: number, feedback: { punctual: boolean; respectful: boolean; wouldBookAgain: boolean; comments: string; tags: string[] }) => {
    if (!activeBooking) return;

    const ratedBooking: Booking = {
      ...activeBooking,
      status: BookingStatus.COMPLETED,
      rating: {
        stars,
        punctual: feedback.punctual,
        respectful: feedback.respectful,
        wouldBookAgain: feedback.wouldBookAgain,
        tags: feedback.tags,
        comments: feedback.comments
      }
    };

    setBookingsHistory(prev => [ratedBooking, ...prev.filter(b => b.id !== activeBooking.id)]);
    setActiveBooking(null);
    // Add completed feedback message
    const systemFeedback: Message = {
      id: "msg-fb-" + Date.now(),
      bookingId: ratedBooking.id,
      sender: "system",
      text: `Feedback submitted! Thank you for rating ${activeHelper?.name}. Your review was successfully shared with CareBridge Quality Operations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemFeedback]);
    navigate("bookings_tab");
  };

  // Custom User Chat Actions
  const sendUserMessage = (text: string) => {
    if (!activeBooking) return;
    
    const userMsg: Message = {
      id: "msg-user-" + Date.now(),
      bookingId: activeBooking.id,
      sender: "customer",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    // Fast, automated AI-helper replies depending on words triggered for incredible immersion!
    setTimeout(() => {
      let replyText = "Understood. I will take note of that. Thank you!";
      const lower = text.toLowerCase();
      
      if (lower.includes("hello") || lower.includes("hi")) {
        replyText = `Hello there! Rest assured I'm fully prepared to help ${activeBooking.recipient.name} today. Let me know if you need anything else!`;
      } else if (lower.includes("parent") || lower.includes("father") || lower.includes("mother")) {
        replyText = `Yes, I will assist ${activeBooking.recipient.name} carefully. I've read the instructions about mobility status: ${activeBooking.recipient.mobilityStatus}.`;
      } else if (lower.includes("medicine") || lower.includes("pill") || lower.includes("pharmacy")) {
        replyText = "Got it! I will secure the drug package immediately and cross-check the expiration and label instructions.";
      } else if (lower.includes("where") || lower.includes("arrived") || lower.includes("location")) {
        if (activeBooking.status === BookingStatus.ON_THE_WAY) {
          replyText = "I'm currently on route. Smooth traffic in KL today, should arrive within 10-15 minutes!";
        } else if (activeBooking.status === BookingStatus.ARRIVED) {
          replyText = "I've just arrived at the lobby/entrance. Let me coordinate with security now.";
        } else if (activeBooking.status === BookingStatus.IN_PROGRESS) {
          replyText = `We are currently carrying out the service: "${activeBooking.subService.name}". Everything is going really well!`;
        }
      }

      const helperReply: Message = {
        id: "msg-auto-" + Date.now(),
        bookingId: activeBooking.id,
        sender: "helper",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, helperReply]);
    }, 1500);
  };

  // Quick helper action from chat buttons (e.g. "Arrived", "Delayed by 10 mins")
  const sendHelperQuickReply = (text: string) => {
    if (!activeBooking) return;
    const msg: Message = {
      id: "msg-qr-" + Date.now(),
      bookingId: activeBooking.id,
      sender: "helper",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
  };

  // HELPER SIMULATION ENGINE (Lets the user act as helper / simulate them via a control panel)
  const startHelperSimulation = () => {
    if (!activeBooking || !activeHelper) return;
    
    // Progress status step
    const updated = { ...activeBooking, status: BookingStatus.ON_THE_WAY };
    setActiveBooking(updated);
    
    const sysMsg: Message = {
      id: "msg-sim-" + Date.now(),
      bookingId: activeBooking.id,
      sender: "system",
      text: `${activeHelper.name} is on their way! You can track their moving location in real-time.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, sysMsg]);
    navigate("live_tracking");
  };

  const progressSimulationStep = () => {
    if (!activeBooking || !activeHelper) return;

    let nextStatus: BookingStatus = activeBooking.status;
    let text = "";
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const checkpts = { ...activeBooking.checkpoints };

    switch (activeBooking.status) {
      case BookingStatus.ASSIGNED:
        nextStatus = BookingStatus.ON_THE_WAY;
        text = `CareBridge: ${activeHelper.name} has departed and is on the way.`;
        break;
      case BookingStatus.ON_THE_WAY:
        nextStatus = BookingStatus.ARRIVED;
        text = `CareBridge: ${activeHelper.name} has arrived at the service location.`;
        checkpts.arrivedPhoto = "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=400&q=80"; // lobby/gate picture
        checkpts.arrivedTime = timeFormatted;
        break;
      case BookingStatus.ARRIVED:
        nextStatus = BookingStatus.IN_PROGRESS;
        text = `CareBridge: Service is now active. Helper is assisting ${activeBooking.recipient.name}.`;
        
        // Pick custom photo upload based on service
        if (activeBooking.category === ServiceCategory.MEDICINE_PICKUP) {
          checkpts.medicineCollectedPhoto = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80";
          checkpts.medicineTime = timeFormatted;
        } else {
          checkpts.parentCheckedInPhoto = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80";
          checkpts.checkedInTime = timeFormatted;
        }
        break;
      case BookingStatus.IN_PROGRESS:
        nextStatus = BookingStatus.COMPLETED;
        text = `CareBridge: Service successfully completed by ${activeHelper.name}. Thank you!`;
        checkpts.completedPhoto = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80";
        checkpts.completedTime = timeFormatted;
        break;
      default:
        break;
    }

    const updated = {
      ...activeBooking,
      status: nextStatus,
      checkpoints: checkpts
    };
    setActiveBooking(updated);

    const msg: Message = {
      id: "msg-sim-" + Date.now(),
      bookingId: activeBooking.id,
      sender: "system",
      text,
      timestamp: timeFormatted
    };
    setMessages(prev => [...prev, msg]);

    if (nextStatus === BookingStatus.COMPLETED) {
      setTimeout(() => {
        navigate("completion_rating");
      }, 1500);
    }
  };

  const simulateCheckpointUpload = (checkpoint: "arrivedPhoto" | "medicineCollectedPhoto" | "parentCheckedInPhoto" | "completedPhoto") => {
    if (!activeBooking) return;
    
    let photoUrl = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80";
    if (checkpoint === "medicineCollectedPhoto") {
      photoUrl = "https://images.unsplash.com/photo-1547847436-137a893d9972?auto=format&fit=crop&w=400&q=80";
    } else if (checkpoint === "parentCheckedInPhoto") {
      photoUrl = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80";
    } else if (checkpoint === "completedPhoto") {
      photoUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80";
    }

    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const checkpts = {
      ...activeBooking.checkpoints,
      [checkpoint]: photoUrl,
      [`${checkpoint.replace("Photo", "Time")}`]: timeFormatted
    };

    const updated = {
      ...activeBooking,
      checkpoints: checkpts
    };
    setActiveBooking(updated);

    const label = checkpoint === "arrivedPhoto" ? "Arrived Location" :
                  checkpoint === "medicineCollectedPhoto" ? "Medicine Collected" :
                  checkpoint === "parentCheckedInPhoto" ? "Parent Checked In" : "Task Completed";

    const feedbackMsg: Message = {
      id: "msg-sim-cp-" + Date.now(),
      bookingId: activeBooking.id,
      sender: "helper",
      text: `[Photo Uploaded: ${label}] I've submitted the progress photo for this milestone. Check it out on your tracking map!`,
      timestamp: timeFormatted
    };
    setMessages(prev => [...prev, feedbackMsg]);
  };

  const resetAll = () => {
    setCurrentView("splash");
    setViewHistory([]);
    setSelectedCategory(null);
    setSelectedSubService(null);
    setActiveBooking(null);
    setActiveHelper(null);
  };

  return (
    <AppContext.Provider value={{
      currentView,
      previousView: viewHistory.length > 0 ? viewHistory[viewHistory.length - 1] : null,
      selectedCategory,
      selectedSubService,
      activeBooking,
      bookingsHistory,
      messages,
      currentUser,
      activeHelper,
      matchingProgress,
      matchingStep,
      
      navigate,
      goBack,
      selectCategoryAction,
      selectSubServiceAction,
      
      initiateBooking,
      updateDraftBooking,
      confirmBookingOrder,
      cancelBookingAction,
      rebookAction,
      submitRatingAction,
      
      sendUserMessage,
      sendHelperQuickReply,
      
      startHelperSimulation,
      progressSimulationStep,
      simulateCheckpointUpload,
      resetAll
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
