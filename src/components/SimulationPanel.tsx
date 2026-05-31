/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { BookingStatus, ServiceCategory } from "../types";
import { 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  Truck, 
  MapPin, 
  CheckSquare, 
  Award, 
  RefreshCw,
  Sparkles,
  HelpCircle,
  Play
} from "lucide-react";

export default function SimulationPanel() {
  const { 
    currentView,
    activeBooking, 
    activeHelper, 
    progressSimulationStep, 
    simulateCheckpointUpload,
    startHelperSimulation,
    navigate,
    resetAll 
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        id="btn-simulator-open"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-amber-500/10 cursor-pointer"
        title="Open Simulation Control Panel"
      >
        <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: "5s" }} />
        <span className="text-xs font-black uppercase tracking-wider">Demo Controls</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  const hasActive = activeBooking && activeBooking.status !== BookingStatus.DRAFT;

  return (
    <div 
      id="simulation-control-card"
      className="fixed bottom-20 md:bottom-auto md:top-24 right-4 z-40 bg-slate-900 text-slate-105 rounded-3xl p-5 border border-slate-800 shadow-2xl max-w-[340px] w-full flex flex-col gap-4 text-xs transition-all relative overflow-hidden"
    >
      
      {/* Glossy ambient highlight */}
      <div className="absolute top-[-20%] left-[-10%] w-32 h-32 rounded-full bg-amber-500/5 pointer-events-none blur-xl" />

      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-slate-805 pb-3">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Cpu className="w-5 h-5 animate-pulse" />
          <h3 className="font-extrabold text-[12px] uppercase tracking-wider">Prototype Simulator</h3>
        </div>
        <button
          id="btn-simulator-close"
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
          title="Minmize control board"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Guides block */}
      <div className="p-3 bg-slate-950 text-[10.5px] rounded-xl leading-relaxed text-slate-400">
        <span className="font-bold text-amber-400 block mb-1">💡 Sandbox Guidance:</span>
        To preview the complete end-to-end <strong>CareBridge Journey</strong>, book any service model from target categories, confirm pricing, and use these triggers below to simulate real-time updates!
      </div>

      {/* Dynamic Status Display Box */}
      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-850 flex flex-col gap-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current App State</p>
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white">Tab View:</span>
          <span className="font-mono text-amber-300 font-extrabold capitalize">{currentView}</span>
        </div>
        {hasActive && activeBooking && (
          <div className="flex justify-between items-center text-xs mt-1 border-t border-slate-805 pt-1.5">
            <span className="font-bold text-white">Active Order:</span>
            <span className="font-mono text-emerald-400 font-extrabold capitalize">{activeBooking.status}</span>
          </div>
        )}
      </div>

      {/* Dynamic Sim Action triggers based on booking state */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider leading-none mb-1">
          Simulate Caregiver Actions
        </p>

        {!hasActive ? (
          <div className="p-3 text-center text-slate-500 italic bg-slate-950/40 rounded-xl">
            Please configure and confirm a care booking first to enable live simulator controls.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            
            {/* STAGE 1: MATCHING */}
            {activeBooking?.status === BookingStatus.MATCHING && (
              <button
                id="btn-sim-force-match"
                onClick={startHelperSimulation}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                ⚡ Fast-Forward Match Helper
              </button>
            )}

            {/* STAGE 2: HELPER ASSIGNED */}
            {activeBooking?.status === BookingStatus.ASSIGNED && (
              <button
                id="btn-sim-force-depart"
                onClick={startHelperSimulation}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                🚗 Simulate: Helper Depart (On-The-Way)
              </button>
            )}

            {/* STAGE 3: TRANSIT TO ARRIVED */}
            {activeBooking?.status === BookingStatus.ON_THE_WAY && (
              <div className="flex flex-col gap-1.5">
                <button
                  id="btn-sim-force-arrive"
                  onClick={progressSimulationStep}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  🏡 Simulate: Helper Checked In (Arrived)
                </button>
                <button
                  id="btn-sim-upload-arrive"
                  onClick={() => simulateCheckpointUpload("arrivedPhoto")}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded-lg transition"
                >
                  📷 Upload Milestone Arrive Photo
                </button>
              </div>
            )}

            {/* STAGE 4: ARRIVED TO IN PROGRESS */}
            {activeBooking?.status === BookingStatus.ARRIVED && (
              <div className="flex flex-col gap-1.5">
                <button
                  id="btn-sim-force-start"
                  onClick={progressSimulationStep}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  ⚕️ Simulate: Start Task Assistance
                </button>
              </div>
            )}

            {/* STAGE 5: IN PROGRESS TO COMPLETE */}
            {activeBooking?.status === BookingStatus.IN_PROGRESS && (
              <div className="flex flex-col gap-1.5">
                {activeBooking.category === ServiceCategory.MEDICINE_PICKUP ? (
                  <button
                    id="btn-sim-upload-medicine"
                    onClick={() => simulateCheckpointUpload("medicineCollectedPhoto")}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded-lg transition"
                  >
                    💊 Collect Medicine & Upload Photo
                  </button>
                ) : (
                  <button
                    id="btn-sim-upload-handshake"
                    onClick={() => simulateCheckpointUpload("parentCheckedInPhoto")}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded-lg transition"
                  >
                    🤝 Complete Handshake & Upload Photo
                  </button>
                )}
                
                <button
                  id="btn-sim-force-complete"
                  onClick={progressSimulationStep}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  ✅ Simulate: Surcharge Task Completed
                </button>
              </div>
            )}

            {/* STAGE 6: COMPLETED */}
            {activeBooking?.status === BookingStatus.COMPLETED && (
              <div className="p-2.5 text-center text-emerald-400 font-bold bg-emerald-500/10 rounded-xl leading-relaxed border border-emerald-500/20">
                ⭐ Task completely finalized! Head to the ratings tab to close escrow.
              </div>
            )}

          </div>
        )}

      </div>

      {/* Hard reset shortcut */}
      <button
        id="btn-sim-reset-all"
        onClick={resetAll}
        className="w-full py-2 bg-slate-950 hover:bg-slate-1000 text-slate-450 border border-slate-805 font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-inner"
      >
        <RefreshCw className="w-3 h-3" />
        Reset Prototype Workspace
      </button>

    </div>
  );
}
