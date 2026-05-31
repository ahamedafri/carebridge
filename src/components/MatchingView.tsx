/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { ShieldCheck, Crosshair, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function MatchingView() {
  const { matchingProgress, matchingStep, activeBooking, startHelperSimulation } = useApp();

  const steps = [
    "Searching nearby verified CareBridge helpers...",
    "Verifying caregiver real-time schedule & skills...",
    "Finalizing pairing with our top-rated match..."
  ];

  return (
    <div id="matching-screen" className="flex flex-col justify-between items-center min-h-[640px] h-full py-12 px-6 bg-gradient-to-b from-teal-50/20 via-white to-teal-50/10">
      
      {/* Top instruction header */}
      <div className="text-center w-full max-w-sm mt-4">
        <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Escrow secured
        </span>
        <h2 id="matching-header-title" className="text-2xl font-black text-teal-950 tracking-tight">
          Finding your best helper...
        </h2>
        <p className="text-xs text-teal-950/50 mt-1 leading-normal max-w-[280px] mx-auto">
          We are matching with caregivers who speak appropriate languages and align with mobilty status: <strong>{activeBooking?.recipient.mobilityStatus}</strong>.
        </p>
      </div>

      {/* Main concentric circle pulse animations */}
      <div className="relative flex items-center justify-center my-8">
        {/* Animated Outer Concentric Rings */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute w-56 h-56 rounded-full border border-teal-500/10 bg-teal-500/5"
        />
        
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
          className="absolute w-40 h-40 rounded-full border border-teal-500/15 bg-teal-500/10"
        />

        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-teal-700 text-white shadow-xl shadow-teal-700/25 z-10">
          <Crosshair className="w-10 h-10 animate-spin text-amber-300" style={{ animationDuration: "12s" }} />
          <span className="absolute text-[11px] font-black">{matchingProgress}%</span>
        </div>
      </div>

      {/* Matching Milestones Checklist */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
        
        {steps.map((text, idx) => {
          const completed = matchingStep > idx;
          const current = matchingStep === idx;
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                completed ? "opacity-100" : current ? "opacity-100" : "opacity-45"
              }`}
            >
              <div className="mt-0.5">
                {completed ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
                ) : current ? (
                  <span className="relative flex h-4.5 w-4.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-gray-300 block bg-gray-50" />
                )}
              </div>
              <div>
                <p className={`text-xs font-semibold leading-relaxed ${current ? "text-teal-950 font-bold" : "text-teal-950/65"}`}>
                  {text}
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* Fallback override row */}
      <div className="w-full max-w-sm mt-4 text-center">
        <p className="text-[11px] text-teal-950/45 mb-2.5">Takes average 10-30 seconds to coordinate offline listings.</p>
        
        {/* Instant simulation override triggers */}
        <button
          id="btn-manual-match"
          onClick={() => {
            // Force matched helper through context
            startHelperSimulation();
          }}
          className="text-[11.5px] font-extrabold text-teal-800 hover:text-teal-950 bg-teal-100/50 hover:bg-teal-100 py-2.5 px-4 border border-teal-500/10 rounded-xl transition duration-200 inline-flex items-center gap-1.5"
        >
          📞 Need urgent assignment? Tap manual priority support
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
