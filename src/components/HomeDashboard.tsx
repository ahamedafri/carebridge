/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { ServiceCategory } from "../types";
import { 
  Search, 
  MapPin, 
  HeartHandshake, 
  Pill, 
  BriefcaseMedical, 
  Baby, 
  Wrench, 
  Timer, 
  Activity, 
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
  ChevronRight
} from "lucide-react";

const CATEGORY_META = [
  {
    category: ServiceCategory.ELDERLY_ASSISTANCE,
    label: "Elderly Assistance",
    desc: "At-home companion, checks & companion walks",
    icon: HeartHandshake,
    bg: "from-emerald-50 to-emerald-100/50 text-emerald-800 border-emerald-500/10",
    iconColor: "text-emerald-700"
  },
  {
    category: ServiceCategory.MEDICINE_PICKUP,
    label: "Medicine Pickup",
    desc: "Refills from HKL/PPUM or pharmacies",
    icon: Pill,
    bg: "from-blue-50 to-blue-100/50 text-blue-800 border-blue-500/10",
    iconColor: "text-blue-700"
  },
  {
    category: ServiceCategory.HOSPITAL_COMPANION,
    label: "Hospital Companion",
    desc: "Queue companionship & clinic translator",
    icon: BriefcaseMedical,
    bg: "from-teal-50 to-teal-100/50 text-teal-800 border-teal-500/10",
    iconColor: "text-teal-700"
  },
  {
    category: ServiceCategory.BABYSITTING,
    label: "Emergency Babysitting",
    desc: "On-demand childcare for few hours",
    icon: Baby,
    bg: "from-pink-50 to-pink-100/50 text-pink-800 border-pink-500/10",
    iconColor: "text-pink-700"
  },
  {
    category: ServiceCategory.HOME_HELP,
    label: "House Quick Fixes",
    desc: "Handyman, lights, small leaks & plugs",
    icon: Wrench,
    bg: "from-amber-50 to-amber-100/50 text-amber-800 border-amber-500/10",
    iconColor: "text-amber-700"
  },
  {
    category: ServiceCategory.NURSE_VISIT,
    label: "Nurse Visit",
    desc: "Wound care, blood tests & injections",
    icon: Activity,
    bg: "from-indigo-50 to-indigo-100/50 text-indigo-800 border-indigo-500/10",
    iconColor: "text-indigo-700"
  },
  {
    category: ServiceCategory.PHYSIO_VISIT,
    label: "Physio Visit",
    desc: "Therapy exercises & stroke movement",
    icon: BookOpen,
    bg: "from-purple-50 to-purple-100/50 text-purple-800 border-purple-500/10",
    iconColor: "text-purple-700"
  },
  {
    category: ServiceCategory.QUEUE_SERVICE,
    label: "Queue Service",
    desc: "Wait on behalf at Immigration or Clinic",
    icon: Timer,
    bg: "from-cyan-50 to-cyan-100/50 text-cyan-800 border-cyan-500/10",
    iconColor: "text-cyan-700"
  }
];

export default function HomeDashboard() {
  const { 
    currentUser, 
    selectCategoryAction, 
    activeBooking, 
    bookingsHistory, 
    navigate,
    rebookAction 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationLabel, setSelectedLocationLabel] = useState(currentUser.savedAddresses[0]?.label || "Home");

  // Get temporal greeting
  const getGreeting = () => {
    const hours = new Date().getUTCHours() + 8; // Malaysia Time Zone UTC+8
    const malaysianHour = hours % 24;
    if (malaysianHour >= 5 && malaysianHour < 12) return { text: "Good morning", icon: "🌅" };
    if (malaysianHour >= 12 && malaysianHour < 17) return { text: "Good afternoon", icon: "☀️" };
    return { text: "Good evening", icon: "🌙" };
  };

  const { text: timeGreeting, icon: greetingIcon } = getGreeting();

  // Filter categories by search
  const filteredCategories = CATEGORY_META.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active or most recent booking
  const displayActiveCard = activeBooking && activeBooking.status !== "Draft";
  const recentHistoric = bookingsHistory.length > 0 ? bookingsHistory[0] : null;

  return (
    <div id="home-dashboard" className="flex flex-col gap-6 w-full min-h-[640px] h-full pb-20 bg-gray-50/50">
      
      {/* Top Header Block: Greeting, Location Selector, and search bar */}
      <div className="bg-gradient-to-b from-teal-900 to-teal-950 text-white rounded-b-[2.5rem] px-6 pt-9 md:pb-40 pb-56 shadow-xl shadow-teal-950/15 relative overflow-hidden">
        
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-teal-800/40 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="md:flex justify-between items-start md:mb-8 mb-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-teal-150 text-xs font-bold uppercase tracking-wider mb-1.5 ">
              <span>{greetingIcon}</span>
              {timeGreeting}
            </div>
            <h2 id="greeting-username" className="text-2xl font-extrabold tracking-tight mt-1.5 mb-3.5 md:mb-0">
              {currentUser.name}
            </h2>
          </div>

          {/* Location Selector */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-[1.25rem] px-4.5 py-3 flex items-center gap- transition-all text-xs font-semibold cursor-pointer">
            <MapPin className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <select 
              id="location-picker-select"
              value={selectedLocationLabel} 
              onChange={(e) => setSelectedLocationLabel(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none font-medium cursor-pointer text-xs py-0.5 px-6 md:px-0"
            >
              {currentUser.savedAddresses.map((addr) => (
                <option key={addr.label} value={addr.label} className="text-teal-950 text-xs">
                  {addr.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-white/40" />
          <input
            id="search-services-input"
            type="text"
            placeholder="Search care, medicine, queue help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 focus:border-white/30 focus:bg-white/15 focus:outline-none rounded-2xl text-xs font-medium placeholder-white/50 text-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Main Containers */}
      <div className="px-6 flex flex-col gap-6">

        {/* Dynamic Booking Alert Card */}
        {displayActiveCard && activeBooking && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-emerald-600 via-teal-700 to-teal-800 text-white p-4.5 rounded-2xl shadow-lg border border-teal-500/20 shadow-teal-950/10 cursor-pointer flex justify-between items-center"
            onClick={() => {
              if (activeBooking.status === "Matching State") {
                navigate("matching");
              } else if (activeBooking.status === "Assigned") {
                navigate("helper_assigned");
              } else {
                navigate("live_tracking");
              }
            }}
          >
            <div className="flex items-center gap-3.5">
              <span className="flex items-center justify-center w-11 h-11 bg-white/10 rounded-xl relative">
                <Activity className="w-5 h-5 text-amber-300 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 bg-red-500"></span>
                </span>
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-100 opacity-80">Active Service Tracker</p>
                <h4 className="text-[13px] font-extrabold">{activeBooking.subService.name}</h4>
                <p className="text-[11px] text-amber-200 font-semibold mt-0.5">Status: {activeBooking.status}</p>
              </div>
            </div>
            <span className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-bold flex items-center gap-1">
              Track
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>
        )}

        {/* Quick Actions Panel */}
        <div>
          <h3 className="text-xs font-extrabold text-teal-950/50 uppercase tracking-widest mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              id="action-book-now"
              onClick={() => selectCategoryAction(ServiceCategory.ELDERLY_ASSISTANCE)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-teal-500/5 hover:border-teal-500/20 hover:shadow-md hover:shadow-teal-950/2 tracking-tight text-center transition-all cursor-pointer group"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-teal-50 rounded-xl group-hover:bg-teal-100/80 transition-colors">
                <Sparkles className="w-5 h-5 text-teal-700" />
              </span>
              <span className="text-xs font-bold text-teal-950">Book Now</span>
            </button>

            <button
              id="action-repeat-last"
              disabled={!recentHistoric}
              onClick={() => recentHistoric && rebookAction(recentHistoric)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-teal-500/5 hover:border-teal-500/20 hover:shadow-md hover:shadow-teal-950/2 tracking-tight text-center transition-all cursor-pointer group ${!recentHistoric ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded-xl group-hover:bg-amber-100/80 transition-colors">
                <Calendar className="w-5 h-5 text-amber-700" />
              </span>
              <span className="text-xs font-bold text-teal-950">Repeat Last</span>
            </button>

            <button
              id="action-support-parent"
              onClick={() => {
                selectCategoryAction(ServiceCategory.ELDERLY_ASSISTANCE);
              }}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-teal-500/5 hover:border-teal-500/20 hover:shadow-md hover:shadow-teal-950/2 tracking-tight text-center transition-all cursor-pointer group"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl group-hover:bg-indigo-100/80 transition-colors">
                <Layers className="w-5 h-5 text-indigo-700" />
              </span>
              <span className="text-xs font-bold text-teal-950">Care Parent</span>
            </button>
          </div>
        </div>

        {/* Main Service Grid Container */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-extrabold text-teal-950/50 uppercase tracking-widest">CareBridge Services</h3>
            <span className="text-[11px] font-bold text-teal-700">{filteredCategories.length} categories</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map((item) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.category}
                  onClick={() => selectCategoryAction(item.category)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`bg-white hover:bg-gray-50/20 rounded-2xl p-4 flex flex-col justify-between border ${item.bg} hover:border-teal-600/30 shadow-sm cursor-pointer transition-all relative overflow-hidden`}
                >
                  {/* Small absolute highlight */}
                  <div className="absolute right-[-10%] top-[-10%] w-16 h-16 rounded-full opacity-5 pointer-events-none bg-teal-950" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-white border border-teal-900/5 shadow-inner">
                      <IconComp className={`w-5 h-5 ${item.iconColor}`} />
                    </span>
                    <ChevronRight className="w-4 h-4 text-teal-950/30" />
                  </div>

                  <div>
                    <h4 className="text-[13px] font-extrabold text-teal-950 leading-tight">
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-teal-950/60 leading-tight mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bento Promotion Box: Care Packages Advertising */}
        <div className="bg-gradient-to-tr from-amber-500/5 via-amber-600/5 to-orange-500/10 rounded-2xl p-5 border border-amber-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between justify-between gap-4">
          <div className="max-w-[280px]">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
              ⭐ Monthly Subscription plans
            </span>
            <h4 className="text-sm font-extrabold text-amber-950">CareBridge Golden Package</h4>
            <p className="text-[11px] text-amber-950/70 leading-normal mt-1">
              Priority medically trained helpers, weekly health check-ins, and free ambulance priority transport for elder parents.
            </p>
          </div>
          <button
            onClick={() => navigate("wallet_tab")}
            className="self-start sm:self-center bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-200"
          >
            Explore Plans
          </button>
        </div>

        {/* Urgent Emergency / Hotline Panel */}
        <div className="p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 flex items-center justify-between gap-4 pb-7 mb-20 transition-all">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center p-2 rounded-xl bg-red-100 text-red-700 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-xs font-extrabold text-red-950">Immediate Emergency Hotline</h4>
              <p className="text-[10px] text-red-950/60 mt-0.5">Need immediate medical ambulance or urgent response support?</p>
            </div>
          </div>
          <a
            href="tel:999"
            className="p-2.5 px-3.5 bg-red-650 bg-white text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-700/10 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Emergency (999)
          </a>
        </div>

      </div>
    </div>
  );
}
