/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Core View imports
import SplashView from "./components/SplashView";
import OnboardingView from "./components/OnboardingView";
import LoginView from "./components/LoginView";
import HomeDashboard from "./components/HomeDashboard";
import SelectServiceView from "./components/SelectServiceView";
import BookingFormView from "./components/BookingFormView";
import PricingConfirmationView from "./components/PricingConfirmationView";
import MatchingView from "./components/MatchingView";
import HelperAssignedView from "./components/HelperAssignedView";
import TrackingView from "./components/TrackingView";
import RatingFeedbackView from "./components/RatingFeedbackView";
import BookingsTabView from "./components/BookingsTabView";
import MessagesTabView from "./components/MessagesTabView";
import WalletTabView from "./components/WalletTabView";
import ProfileTabView from "./components/ProfileTabView";

// Icons 
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Wallet as WalletIcon, 
  User, 
  Wifi, 
  Battery, 
  Signal
} from "lucide-react";

function InnerApp() {
  const { currentView, navigate, messages } = useApp();

  // Decide if current view supports bottom navigation tabs
  const tabViews = ["home", "bookings_tab", "messages_tab", "wallet_tab", "profile_tab"];
  const showBottomNav = tabViews.includes(currentView);

  const renderActiveView = () => {
    switch (currentView) {
      case "splash":
        return <SplashView />;
      case "onboarding":
        return <OnboardingView />;
      case "login":
        return <LoginView />;
      case "select_service":
        return <SelectServiceView />;
      case "booking_form":
        return <BookingFormView />;
      case "pricing_confirmation":
        return <PricingConfirmationView />;
      case "matching" :
        return <MatchingView />;
      case "helper_assigned":
        return <HelperAssignedView />;
      case "live_tracking":
        return <TrackingView />;
      case "completion_rating":
        return <RatingFeedbackView />;
      
      // Tabs
      case "home":
        return <HomeDashboard />;
      case "bookings_tab":
        return <BookingsTabView />;
      case "messages_tab":
        return <MessagesTabView />;
      case "wallet_tab":
        return <WalletTabView />;
      case "profile_tab":
        return <ProfileTabView />;
      default:
        return <HomeDashboard />;
    }
  };

  // Get current system time for simulating a real smartphone top state bar
  const getSimClockTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const hasUnread = messages.length > 1;

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans antialiased relative overflow-x-hidden flex flex-col items-center justify-center py-6 md:py-12 px-4 select-none">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-teal-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* CORE HIGH-FIDELITY MOBILE EMBED */}
      <div className="relative">
        <div 
          id="mockup-frame" 
          className="w-full max-w-[395px] h-[820px] rounded-[3.2rem] border-[12px] border-slate-900 bg-black shadow-2xl relative overflow-hidden flex flex-col ring-4 ring-slate-800"
        >
          {/* Top Status Bar Notch and Clock */}
          <div className="absolute top-0 inset-x-0 h-7 bg-black z-30 flex justify-between items-center px-6 pr-8 text-white text-[11px] font-bold">
            <span>{getSimClockTime()}</span>
            {/* Camera Notch */}
            <div className="w-28 h-4 bg-black rounded-b-xl absolute left-1/2 transform -translate-x-1/2 top-0" />
            <div className="flex items-center gap-1.5 ml-auto">
              <Signal className="w-3 h-3 text-white" />
              <span className="text-[9px] uppercase tracking-wider">MY-Maxis</span>
              <Wifi className="w-3.5 h-3.5 text-white" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Simulated App Viewport */}
          <div className="flex-grow bg-white overflow-y-auto pt-7 relative flex flex-col h-full rounded-[2.1rem]">
            
            {/* Active views stack */}
            <div className="flex-1 overflow-y-auto flex flex-col relative h-full">
              {renderActiveView()}
            </div>

            {/* Simulated Bottom Navigation */}
            {showBottomNav && (
              <div 
                id="bottom-tab-bar" 
                className="bg-white border-t border-gray-100 flex justify-around items-center py-2 h-16 absolute bottom-0 left-0 right-0 z-20 shadow-lg"
              >
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "bookings_tab", label: "Bookings", icon: Calendar },
                  { id: "messages_tab", label: "Messages", icon: MessageSquare, hasAlert: hasUnread },
                  { id: "wallet_tab", label: "Wallet", icon: WalletIcon },
                  { id: "profile_tab", label: "Profile", icon: User }
                ].map((tab) => {
                  const active = currentView === tab.id;
                  const IconComp = tab.icon;

                  return (
                    <button
                      id={`tab-btn-${tab.id}`}
                      key={tab.id}
                      onClick={() => navigate(tab.id)}
                      className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all relative ${
                        active ? "text-teal-700" : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <span className="relative">
                        <IconComp className="w-5 h-5 transition-transform" />
                        {tab.hasAlert && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                      </span>
                      <span className="text-[9.5px] font-semibold leading-none">{tab.label}</span>
                      
                      {active && (
                        <span className="absolute bottom-[-6px] w-5 h-1 rounded-full bg-teal-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Physical Phone Bottom Home Indicator */}
          <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-20 pointer-events-none" />
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
