/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Phone, 
  MessageSquare, 
  Share2, 
  X, 
  MapPin, 
  Star, 
  Languages, 
  ShieldCheck, 
  BookmarkCheck, 
  ChevronRight,
  Clock
} from "lucide-react";

export default function HelperAssignedView() {
  const { 
    activeBooking, 
    activeHelper, 
    navigate, 
    cancelBookingAction,
    startHelperSimulation 
  } = useApp();

  if (!activeBooking || !activeHelper) {
    return (
      <div className="p-6 text-center text-xs text-teal-950/60">
        Finding matched helper profile...
      </div>
    );
  }

  const handleOpenSimAlert = () => {
    alert(`Calling ${activeHelper.name} (${activeHelper.phoneNumber}). In this demo we will simulate helper replies in the "Chat" option!`);
  };

  const handleShareDetails = () => {
    const text = `Hi, I've booked ${activeHelper.name} (Verified caregiver) on CareBridge to assist with ${activeBooking.subService.name} today. Track live here: https://carebridge.my/track/${activeBooking.id}`;
    alert(`Details copied to clipboard! Share this link to WhatsApp/SMS:\n\n${text}`);
  };

  return (
    <div id="helper-assigned-screen" className="flex flex-col min-h-[640px] h-full pb-24 bg-gray-50/50">
      
      {/* Top Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between shadow-xs sticky top-0 z-15">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <h2 className="text-sm font-black text-teal-950">Helper Matched</h2>
        </div>
        <button
          id="btn-cancel-service"
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel this booking?")) {
              cancelBookingAction(activeBooking.id);
            }
          }}
          className="p-2 -mr-2 rounded-lg hover:bg-red-50 text-red-550 transition duration-150 flex items-center gap-1 text-[10.5px] font-bold"
        >
          <X className="w-4 h-4" />
          Cancel Order
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        
        {/* 1. Primary Helper Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-4">
          <div className="flex gap-4">
            
            {/* Ava picture */}
            <div className="relative">
              <img
                src={activeHelper.photoUrl}
                alt={activeHelper.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100"
              />
              <span className="absolute bottom-[-4px] right-[-4px] bg-emerald-600 text-white p-0.5 rounded-full border-2 border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-teal-950 leading-tight">
                  {activeHelper.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-3.5 mt-1 text-xs">
                <span className="flex items-center gap-0.5 text-amber-600 font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {activeHelper.rating}
                </span>
                <span className="text-teal-950/40">•</span>
                <span className="text-teal-950/60 font-semibold">{activeHelper.completedJobs} jobs completed</span>
              </div>

              <div className="mt-2 text-[10px] bg-emerald-500/5 text-emerald-800 border border-emerald-500/10 px-2 py-0.5 rounded-lg inline-flex items-center gap-1 font-bold uppercase tracking-wider">
                <BookmarkCheck className="w-3 h-3" /> CareBridge Verified Helper
              </div>
            </div>

          </div>

          <p className="text-[11.5px] text-teal-950/65 leading-relaxed bg-gray-55 p-3 rounded-xl">
            "{activeHelper.bio}"
          </p>

          {/* Helper details like languages fluencies */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] text-teal-950/60">
            <span className="flex items-center gap-1 font-bold">
              <Languages className="w-4 h-4 text-teal-700" /> Fluencies:
            </span>
            <span className="font-semibold text-teal-900">{activeHelper.languages.join(", ")}</span>
          </div>
        </div>

        {/* 2. Instant contact row */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            id="btn-helper-call"
            onClick={handleOpenSimAlert}
            className="p-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold text-teal-950"
          >
            <Phone className="w-4.5 h-4.5 text-teal-700" />
            <span>Call Helper</span>
          </button>

          <button
            id="btn-helper-chat"
            onClick={() => {
              navigate("messages_tab");
            }}
            className="p-3.5 rounded-xl border border-teal-600/20 bg-teal-50/15 hover:bg-teal-50/35 flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold text-teal-950"
          >
            <MessageSquare className="w-4.5 h-4.5 text-teal-700" />
            <span>Chat Secure</span>
          </button>

          <button
            id="btn-helper-share"
            onClick={handleShareDetails}
            className="p-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold text-teal-950"
          >
            <Share2 className="w-4.5 h-4.5 text-teal-700" />
            <span>Share Link</span>
          </button>
        </div>

        {/* 3. Helper status timeline */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <h4 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1">Status Timeline</h4>
          
          <div className="flex flex-col gap-4 pl-2 relative">
            {/* Visual connector line */}
            <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-gray-200" />

            {[
              { id: "assigned", label: "Caregiver Assigned", sub: "Sarah accepted and is securing medication refill receipts.", completed: true },
              { id: "ontheway", label: "departing transit", sub: "Preparing travel to location.", completed: false },
              { id: "arrived", label: "Arrived Destination", sub: "Checking in with residence gate guards.", completed: false },
              { id: "inprogress", label: "In-Service care active", sub: "Carrying out assigned check-ins.", completed: false },
              { id: "done", label: "Feedback & Complete", sub: "Invoicing and quality feedback reports.", completed: false }
            ].map((step, idx) => {
              return (
                <div key={step.id} className="flex gap-4 relative z-5">
                  <span className={`w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 mt-1 shadow-sm ${idx === 0 ? "bg-emerald-600 ring-2 ring-emerald-500/30" : "bg-gray-300"}`} />
                  <div>
                    <span className={`text-xs font-bold block ${idx === 0 ? "text-emerald-800" : "text-teal-950/45"}`}>{step.label}</span>
                    <span className="text-[10px] text-teal-950/55">{step.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Primary Continue Tracker navigation bar */}
      <div className="bg-white px-6 py-4.5 border-t border-gray-100 shadow-lg shadow-teal-950/5 flex items-center justify-between z-10 gap-4 fixed bottom-0 left-0 right-0">
        <div className="flex flex-col text-left">
          <p className="text-[10px] text-teal-950/45 uppercase font-bold tracking-wider leading-none flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-700" /> Ready to Track
          </p>
          <p className="text-xs font-bold text-teal-950 mt-1">Simulate Transit</p>
        </div>
        <button
          id="btn-start-simulation"
          onClick={startHelperSimulation}
          className="flex-1 py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs tracking-wide shadow-md shadow-teal-800/10 flex items-center justify-center gap-2 max-w-xs transition duration-200"
        >
          Begin Real-Time Tracking
          <ChevronRight className="w-4 h-4 text-white animate-bounce" style={{ animationDuration: "1.5s" }} />
        </button>
      </div>

    </div>
  );
}
