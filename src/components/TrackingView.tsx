/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { BookingStatus, ServiceCategory } from "../types";
import { 
  ArrowLeft, 
  Clock, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Image, 
  MapPin, 
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  Star,
  Activity,
  UserCheck,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function TrackingView() {
  const { 
    activeBooking, 
    activeHelper, 
    navigate,
    progressSimulationStep,
    simulateCheckpointUpload,
    goBack 
  } = useApp();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer simulation
  useEffect(() => {
    let timer: any = null;
    if (activeBooking?.status === BookingStatus.IN_PROGRESS) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeBooking?.status]);

  if (!activeBooking || !activeHelper) {
    return (
      <div className="p-6 text-center text-xs text-teal-950/60">
        No active tracked booking found.
      </div>
    );
  }

  const { status, checkpoints, subService, recipient, location, pricing } = activeBooking;

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Switch positions for animated vector map depending on helper transit status
  const helperCoordinates = {
    [BookingStatus.ASSIGNED]: { x: 30, y: 155, label: "Preparing" },
    [BookingStatus.ON_THE_WAY]: { x: 130, y: 110, label: "On the way via Jalan Cheras" },
    [BookingStatus.ARRIVED]: { x: 250, y: 55, label: "Arrived at Lobby" },
    [BookingStatus.IN_PROGRESS]: { x: 265, y: 48, label: "At Recipient Residence" },
    [BookingStatus.COMPLETED]: { x: 265, y: 48, label: "Completed" },
    [BookingStatus.CANCELLED]: { x: 0, y: 0, label: "Cancelled" },
    [BookingStatus.DRAFT]: { x: 0, y: 0, label: "Draft" },
    [BookingStatus.MATCHING]: { x: 0, y: 0, label: "Matching State" }
  };

  const coords = helperCoordinates[status] || { x: 30, y: 155, label: "Base" };

  return (
    <div id="tracking-screen" className="flex flex-col min-h-[640px] h-full pb-24 bg-gray-50/50">
      
      {/* Top Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between shadow-xs sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            id="btn-tracking-back"
            onClick={goBack}
            className="p-2 rounded-xl hover:bg-gray-100/85 text-teal-950 transition duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-teal-950 leading-tight">
              {status === BookingStatus.COMPLETED ? "Booking Receipt" : "Live Care Tracker"}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-wider text-teal-900/60 mt-0.5">
              Ref: {activeBooking.id}
            </p>
          </div>
        </div>

        {status !== BookingStatus.COMPLETED && (
          <span className="p-1 px-3 bg-red-500/10 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse border border-red-500/10">
            ● Live
          </span>
        )}
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">

        {status !== BookingStatus.COMPLETED ? (
          /* ========================================================= */
          /* SCREEN 10: IN-SERVICE LIVE TRACKING                       */
          /* ========================================================= */
          <>
            {/* 1. Animated SVG Map */}
            <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm relative h-56 w-full">
              
              {/* SVG Vector Drawing */}
              <svg className="w-full h-full bg-teal-50/20" viewBox="0 0 320 220">
                {/* Grid guidelines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(13, 148, 136, 0.04)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Simulated Roads */}
                <path d="M 10 160 Q 150 140 200 80 T 270 50" fill="none" stroke="#e2e8f0" strokeWidth="22" strokeLinecap="round" />
                <path d="M 10 160 Q 150 140 200 80 T 270 50" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                
                <path d="M 120 220 L 120 10 L 220 10" fill="none" stroke="#e2e8f0" strokeWidth="16" />
                
                {/* Labels of Landmarks in Kuala Lumpur */}
                <text x="12" y="195" fill="rgba(13, 148, 136, 0.4)" fontSize="8" fontWeight="bold" fontFamily="monospace">Jln Ampang</text>
                <text x="180" y="25" fill="rgba(13, 148, 136, 0.4)" fontSize="8" fontWeight="bold" fontFamily="monospace">Jln Cheras</text>
                
                {/* Recipient House Destination Node */}
                <circle cx="270" cy="50" r="16" fill="rgba(13, 148, 136, 0.15)" />
                <circle cx="270" cy="50" r="6" fill="#0d9488" className="animate-pulse" />
                <text x="235" y="30" fill="#115e59" fontSize="10" fontWeight="extrabold">Recipient</text>

                {/* Helper Node marker */}
                {status !== BookingStatus.ASSIGNED && (
                  <g className="transition-all duration-1000 ease-in-out">
                    <circle cx={coords.x} cy={coords.y} r="14" fill="rgba(245, 158, 11, 0.2)" />
                    <circle cx={coords.x} cy={coords.y} r="7" fill="#f59e0b" />
                    {/* Helper Name tooltip tag */}
                    <rect x={coords.x - 30} y={coords.y - 26} width="60" height="15" rx="5" fill="#111827" opacity="0.9" />
                    <text x={coords.x} y={coords.y - 16} fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">
                      {activeHelper.name.split(" ")[0]}
                    </text>
                  </g>
                )}
              </svg>

              {/* Float Map Overlay Label */}
              <div className="absolute top-3 left-3 bg-teal-950/80 backdrop-blur-md text-white rounded-xl p-2.5 px-3.5 flex items-center gap-2 text-[10px] font-bold border border-white/10 max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{coords.label}</span>
              </div>
            </div>

            {/* 2. Status Counter Panel */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm grid grid-cols-2 gap-4 divide-x divide-gray-100">
              <div className="flex flex-col gap-1 items-left">
                <span className="text-[10px] text-teal-950/40 uppercase font-black tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-700" /> Care Status
                </span>
                <span id="text-live-status-label" className="text-sm font-black text-teal-950 mt-1 capitalize leading-tight">
                  {status}
                </span>
              </div>
              <div className="flex flex-col gap-1 pl-4 items-left">
                <span className="text-[10px] text-teal-950/40 uppercase font-black tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-700 animate-pulse" /> Timer Counter
                </span>
                <span className="text-base font-black text-teal-950 mt-1 font-mono">
                  {status === BookingStatus.IN_PROGRESS ? formatElapsed(elapsedSeconds) : "00:00"}
                </span>
              </div>
            </div>

            {/* 3. Proof Checkpoints section */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1">
                  Proof Checkpoints Uploaded
                </h3>
                <p className="text-[10.5px] text-teal-950/50 mt-1 leading-normal">
                  Our helper uploads visual timestamps in Malaysia for verification.
                </p>
              </div>

              {/* Dynamic Grid list of checkpoint structures */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { 
                    key: "arrivedPhoto", 
                    label: "Helper Arrived Location", 
                    timeKey: "arrivedTime", 
                    placeholder: "Waiting for arrival..." 
                  },
                  { 
                    key: "medicineCollectedPhoto", 
                    label: activeBooking.category === ServiceCategory.MEDICINE_PICKUP ? "Medicine Collected Checklist" : "Recipient Checked In Handshake", 
                    timeKey: activeBooking.category === ServiceCategory.MEDICINE_PICKUP ? "medicineTime" : "checkedInTime", 
                    placeholder: "Active checklist..." 
                  }
                ].map((cp) => {
                  const hasPhoto = (checkpoints as any)[cp.key];
                  const timestamp = (checkpoints as any)[cp.timeKey];
                  return (
                    <div key={cp.key} className="p-3.5 rounded-xl bg-gray-55 border border-gray-200/60 flex flex-col gap-3 relative">
                      <span className="text-[10px] font-bold text-teal-950 block leading-tight">{cp.label}</span>
                      
                      {hasPhoto ? (
                        <div className="relative h-28 rounded-lg overflow-hidden border border-gray-200 bg-white">
                          <img
                            src={(checkpoints as any)[cp.key]}
                            alt={cp.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-2 bg-teal-950/80 text-[8px] font-extrabold text-teal-100 px-1.5 py-0.5 rounded uppercase">
                            {timestamp}
                          </span>
                        </div>
                      ) : (
                        <div className="h-28 rounded-lg border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center px-2">
                          <Image className="w-5 h-5 text-gray-400 mb-1" />
                          <span className="text-[9.5px] text-teal-950/40 leading-snug">{cp.placeholder}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standard action contact bar */}
            <div className="grid grid-cols-2 gap-3.5 mt-2">
              <button
                id="btn-contacts-helper"
                onClick={() => alert(`Direct call line active: ${activeHelper.phoneNumber}`)}
                className="py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-950"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                Contact Helper
              </button>
              <button
                id="btn-contacts-chat"
                onClick={() => navigate("messages_tab")}
                className="py-3 px-4 rounded-xl border border-teal-500/15 bg-teal-50/15 hover:bg-teal-50/30 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-950"
              >
                <MessageSquare className="w-4 h-4 text-teal-700" />
                Chat Secure Room
              </button>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* SCREEN 11: JOB COMPLETION                                 */
          /* ========================================================= */
          <div className="flex flex-col gap-5">
            {/* Visual Success Accent */}
            <div className="flex flex-col items-center text-center py-6 bg-white rounded-3xl border border-emerald-500/10 shadow-sm">
              <span className="flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full mb-3.5">
                <ShieldCheck className="w-8 h-8" />
              </span>
              <h3 className="text-lg font-black text-teal-950">Micro-Service Completed</h3>
              <p className="text-xs text-teal-950/60 max-w-[240px] mt-1 leading-normal">
                CareBridge Helper {activeHelper.name} successfully updated milestone checklists!
              </p>
            </div>

            {/* Official Summary specifications Invoice Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
              <h4 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-100 pb-2 leading-none mb-1">
                Receipt Summary
              </h4>

              <div className="flex flex-col gap-3 text-xs leading-none">
                <div className="flex justify-between items-center">
                  <span className="text-teal-950/55 font-semibold">Service Executed</span>
                  <span className="font-extrabold text-teal-950">{subService.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-950/55 font-semibold">Care Recipient</span>
                  <span className="font-extrabold text-teal-950">{recipient.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-950/55 font-semibold">Assigned Caregiver</span>
                  <span className="font-extrabold text-teal-950">{activeHelper.name}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-teal-950/45">
                  <span>Line Breakdown</span>
                  <span>Amount MYR</span>
                </div>

                <div className="flex justify-between text-teal-950/60 leading-none">
                  <span>Base Duration Surcharge</span>
                  <span className="font-semibold text-teal-950">RM {pricing.baseFee}.00</span>
                </div>
                <div className="flex justify-between text-teal-950/60 leading-none">
                  <span>Transport Travel fee</span>
                  <span className="font-semibold text-teal-950">RM {pricing.distanceFee}.00</span>
                </div>
                {pricing.addOnsTotal > 0 && (
                  <div className="flex justify-between text-teal-950/60 leading-none">
                    <span>Configured Add-ons Surcharge</span>
                    <span className="font-semibold text-teal-950">RM {pricing.addOnsTotal}.00</span>
                  </div>
                )}

                <div className="border-t border-gray-150 pt-3.5 mt-2 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase text-teal-950">Final Charges</span>
                  <span className="text-lg font-black text-teal-950">RM {pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Helper notes */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h4 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3 leading-none">
                Caregiver Progress Note
              </h4>
              <p className="text-xs text-teal-950/70 p-3 bg-gray-55 border border-gray-100/80 rounded-xl leading-relaxed italic">
                "Completed medicine collection at pharmacy desk 2, HKL. All routines have been labeled clearly and handed over safely to En. Ibrahim. He checked in with good vitals and blood sugars."
              </p>
            </div>

            {/* Proof photo summary preview */}
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { label: "Arrived Proof", photo: checkpoints.arrivedPhoto || "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=300&q=80" },
                { label: "Hand-over Proof", photo: checkpoints.completedPhoto || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                  <span className="text-[9.5px] font-semibold text-teal-950/60 uppercase leading-none">{item.label}</span>
                  <div className="h-28 rounded-lg overflow-hidden relative">
                    <img
                      src={item.photo}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Ratings redirect buttons */}
            <button
              id="btn-rate-helper-redirect"
              onClick={() => navigate("completion_rating")}
              className="w-full py-4.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-800/10 flex items-center justify-center gap-1.5 transition duration-200 mt-2"
            >
              <Star className="w-4.5 h-4.5 text-amber-300 fill-amber-300 mr-1" />
              Rate Helper & Unlock Escrow
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
