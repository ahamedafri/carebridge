/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { BookingStatus } from "../types";
import { Calendar, User, Heart, AlertCircle, RefreshCw, ChevronRight, CheckCircle2 } from "lucide-react";

export default function BookingsTabView() {
  const { activeBooking, bookingsHistory, rebookAction, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("past");

  // Filter bookings list
  // Upcoming is any draft active order, matching, assigned, or in-service
  const upcomingList = activeBooking && activeBooking.status !== BookingStatus.DRAFT ? [activeBooking] : [];
  
  // Past is completed, cancelled or historic orders
  const pastList = bookingsHistory;

  const currentList = activeTab === "upcoming" ? upcomingList : pastList;

  return (
    <div id="bookings-tab-screen" className="flex flex-col min-h-[640px] h-full pb-20 bg-gray-55">
      
      {/* Top Static Title */}
      <div className="bg-white px-6 pt-7 pb-4.5 border-b border-gray-100 flex flex-col gap-4">
        <h2 className="text-lg font-black text-teal-950 leading-tight">My Care Orders</h2>
        
        {/* Toggle tabs switch */}
        <div className="flex bg-gray-55 p-1 rounded-xl border border-gray-200/50">
          <button
            id="btn-tab-upcoming"
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "upcoming" 
                ? "bg-white text-teal-950 shadow-sm font-black" 
                : "text-teal-950/45 hover:text-teal-950"
            }`}
          >
            Upcoming Active ({upcomingList.length})
          </button>
          <button
            id="btn-tab-past"
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "past" 
                ? "bg-white text-teal-950 shadow-sm font-black" 
                : "text-teal-950/45 hover:text-teal-950"
            }`}
          >
            Past History ({pastList.length})
          </button>
        </div>
      </div>

      {/* Main list block */}
      <div className="px-6 py-5 flex-1 flex flex-col gap-4">
        
        {currentList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200 my-6">
            <span className="flex items-center justify-center p-3 rounded-full bg-teal-50 text-teal-700 mb-3 text-lg">
              📅
            </span>
            <p className="text-xs font-bold text-teal-950">No care bookings in this tab</p>
            <p className="text-[10.5px] text-teal-950/50 mt-1 max-w-[180px] leading-relaxed">
              When you book elderly check-ins or medicine pickup, details will register here.
            </p>
            <button
              id="btn-bookings-empty-book"
              onClick={() => navigate("home")}
              className="mt-4 text-xs font-extrabold text-teal-700 bg-teal-100/50 hover:bg-teal-100 py-2 px-3 border border-teal-500/10 rounded-xl"
            >
              Order Service Now
            </button>
          </div>
        ) : (
          currentList.map((bk) => {
            const isCompleted = bk.status === BookingStatus.COMPLETED;
            
            return (
              <div
                key={bk.id}
                className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5"
              >
                {/* Visual Status Indicator & Category title */}
                <div className="flex justify-between items-center pb-2.1 border-b border-gray-50">
                  <div>
                    <span className="text-[10px] text-teal-950/40 uppercase font-black tracking-wider block">Malaysia Hub Order</span>
                    <h4 className="text-[13.5px] font-black text-teal-950 leading-tight mt-0.5">{bk.subService.name}</h4>
                  </div>
                  
                  {/* Status Badging */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-800" 
                      : bk.status === BookingStatus.MATCHING 
                      ? "bg-blue-105 text-blue-800 animate-pulse" 
                      : "bg-teal-100 text-teal-800"
                  }`}>
                    {bk.status}
                  </span>
                </div>

                {/* Sub details: Recipient, Timing & cost */}
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-[11px] text-teal-950/65">
                  <div className="flex items-start gap-2">
                    <User className="w-3.5 h-3.5 text-teal-700 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-teal-950/40 uppercase font-bold leading-none mb-0.5">Assisting</p>
                      <p className="font-semibold text-teal-950">{bk.recipient.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-700 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-teal-950/40 uppercase font-bold leading-none mb-0.5">Timing</p>
                      <p className="font-semibold text-teal-950">{bk.schedule.timeString}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing row & Interactive rebook accelerator triggers */}
                <div className="border-t border-gray-100 mt-1 pt-3.5 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-teal-950/45 uppercase font-bold">Total Surcharge paid</p>
                    <p className="text-base font-black text-teal-950 mt-0.5">RM {bk.pricing.total.toFixed(2)}</p>
                  </div>

                  {isCompleted ? (
                    <button
                      id={`btn-bookings-rebook-${bk.id}`}
                      onClick={() => rebookAction(bk)}
                      className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-teal-500/10 transition duration-200 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Book Again
                    </button>
                  ) : (
                    <button
                      id={`btn-bookings-track-${bk.id}`}
                      onClick={() => {
                        if (bk.status === BookingStatus.MATCHING) navigate("matching");
                        else if (bk.status === BookingStatus.ASSIGNED) navigate("helper_assigned");
                        else navigate("live_tracking");
                      }}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition duration-200 cursor-pointer"
                    >
                      Track Order
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}
