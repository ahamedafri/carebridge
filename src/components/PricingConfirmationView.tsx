/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { CreditCard, Landmark, Wallet, ArrowLeft, ArrowRight, Check, Heart } from "lucide-react";

export default function PricingConfirmationView() {
  const { activeBooking, updateDraftBooking, confirmBookingOrder, goBack } = useApp();

  if (!activeBooking) {
    return (
      <div className="p-6 text-center text-xs text-teal-950/60">
        No active service order found. Please start from the home tab.
      </div>
    );
  }

  const { subService, recipient, location, schedule, pricing, addOns, paymentMethod } = activeBooking;

  // Toggle helper function
  const handleToggleAddOn = (key: keyof typeof addOns) => {
    updateDraftBooking({
      addOns: {
        ...addOns,
        [key]: !addOns[key]
      }
    });
  };

  const handleChangePayment = (method: typeof paymentMethod) => {
    updateDraftBooking({ paymentMethod: method });
  };

  return (
    <div id="pricing-confirmation-screen" className="flex flex-col min-h-[640px] h-full pb-28 bg-gray-50/50">
      
      {/* Top Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-3 shadow-xs sticky top-0 z-10">
        <button
          id="btn-pricing-back"
          onClick={goBack}
          className="p-2 rounded-xl hover:bg-gray-100/85 text-teal-950 transition duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-teal-950 leading-tight">
            Review & Pay
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-teal-900/60 mt-0.5">
            Step 3 of 3: Summary & Invoicing
          </p>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">

        {/* 1. Service summary card */}
        <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Heart className="w-3 h-3 fill-amber-400" /> CareBridge Voucher Order
          </p>
          <h3 className="text-base font-extrabold text-white">{subService.name}</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] text-white/80 border-t border-white/10 pt-3">
            <div>
              <p className="text-[9px] font-bold text-white/50 uppercase">Recipient</p>
              <p className="font-semibold text-white mt-0.5">{recipient.name} ({recipient.age}y/o)</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-white/50 uppercase">Schedule</p>
              <p className="font-semibold text-white mt-0.5">{schedule.timeString}</p>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-white/80 border-t border-white/10 pt-3">
            <p className="text-[9px] font-bold text-white/50 uppercase">Service Location</p>
            <p className="font-semibold text-white mt-0.5 line-clamp-1">{location.address}</p>
            {location.landmark && <p className="text-[10.5px] italic text-teal-200 mt-0.5">{location.landmark}</p>}
          </div>
        </div>

        {/* 2. Optional Add-ons checklist */}
        <div>
          <h3 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest mb-3">Optional Service Add-ons</h3>
          <div className="flex flex-col gap-2.5">
            
            {[
              { 
                key: "priorityHelper", 
                title: "Priority Helper Assignment", 
                desc: "Matches with premium, highly urgent helpers first.",
                price: "RM 10", 
                id: "add-priority" 
              },
              { 
                key: "femalePreference", 
                title: "Female Helper Preference", 
                desc: "Limits helper dispatch strictly to female caregivers.",
                price: "RM 5", 
                id: "add-female" 
              },
              { 
                key: "medicalTrained", 
                title: "Medical-trained Nurse Assitance", 
                desc: "Dispatches helpers with clinical nursing background.",
                price: "RM 15", 
                id: "add-medical" 
              },
              { 
                key: "extraTime", 
                title: "Extra 30 Minutes Buffer", 
                desc: "Adds a safety grace minutes extension to the timer.",
                price: "RM 15", 
                id: "add-extratime" 
              },
              { 
                key: "photoUpdates", 
                title: "Progress Photo Checkpoints", 
                desc: "Real-time verification photos updated upon arriving/completion.",
                price: "FREE", 
                id: "add-photos",
                disabled: true 
              }
            ].map((addon) => {
              const checked = addon.disabled ? true : (addOns as any)[addon.key];
              return (
                <label
                  key={addon.key}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    checked 
                      ? "bg-teal-50/20 border-teal-600/40" 
                      : "bg-white border-gray-150 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      id={`chk-${addon.id}`}
                      type="checkbox"
                      checked={checked}
                      disabled={addon.disabled}
                      onChange={() => !addon.disabled && handleToggleAddOn(addon.key as any)}
                      className="mt-1 text-teal-600 focus:ring-teal-500 rounded border-gray-300"
                    />
                    <div>
                      <span className="text-xs font-bold text-teal-950 block">{addon.title}</span>
                      <span className="text-[10px] text-teal-950/50 leading-tight mt-0.5 block">{addon.desc}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 ${checked ? "text-teal-700" : "text-teal-950/40"}`}>
                    +{addon.price}
                  </span>
                </label>
              );
            })}

          </div>
        </div>

        {/* 3. Detailed Price verification breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm col-span-1">
          <h3 className="text-xs font-black text-teal-950 uppercase tracking-wide border-b border-gray-100 pb-3 mb-3">Price Breakdown</h3>
          
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between text-teal-950/60 leading-none">
              <span>Base Fee ({activeBooking.selectedDuration.label})</span>
              <span className="font-semibold text-teal-950">RM {pricing.baseFee}.00</span>
            </div>
            <div className="flex justify-between text-teal-950/60 leading-none">
              <span>Distance & Travel Surcharge</span>
              <span className="font-semibold text-teal-950">RM {pricing.distanceFee}.00</span>
            </div>
            {pricing.extraTimeFee > 0 && (
              <div className="flex justify-between text-teal-950/60 leading-none">
                <span>Extra Duration (30 mins)</span>
                <span className="font-semibold text-teal-950">RM {pricing.extraTimeFee}.00</span>
              </div>
            )}
            {pricing.addOnsTotal > pricing.extraTimeFee && (
              <div className="flex justify-between text-teal-950/60 leading-none">
                <span>Optional Care Add-ons</span>
                <span className="font-semibold text-teal-950">
                  RM {pricing.addOnsTotal - pricing.extraTimeFee}.00
                </span>
              </div>
            )}
            <div className="flex justify-between text-teal-950/60 leading-none">
              <span>CareBridge Platform Fee</span>
              <span className="font-semibold text-teal-950">RM {pricing.platformFee}.00</span>
            </div>

            <div className="border-t border-gray-100 pt-3.5 mt-2 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-teal-950">Total Surcharge</span>
              <span id="text-final-total" className="text-xl font-black text-teal-950">
                RM {pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Payment options with interactive switches */}
        <div>
          <h3 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest mb-3">Secure Cashless Settlement</h3>
          <div className="grid grid-cols-3 gap-2">
            
            {[
              { id: "Card", label: "Credit Card", icon: CreditCard, subtitle: "Visa/MC" },
              { id: "FPX / Online Banking", label: "FPX Banking", icon: Landmark, subtitle: "CIMB/Maybank" },
              { id: "E-wallet", label: "E-Wallet", icon: Wallet, subtitle: "TnG/Grab" }
            ].map((pm) => {
              const active = paymentMethod === pm.id;
              const IconComp = pm.icon;
              return (
                <button
                  id={`btn-payment-${pm.id.toLowerCase().replace(" ", "-").replace("/", "")}`}
                  key={pm.id}
                  type="button"
                  onClick={() => handleChangePayment(pm.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold leading-tight ${
                    active 
                      ? "bg-teal-50 border-teal-600 ring-1 ring-teal-600 text-teal-950" 
                      : "bg-white border-gray-150 hover:bg-gray-50 text-teal-950/60"
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${active ? "text-teal-700" : "text-teal-950/40"}`} />
                  <div>
                    <span className="block text-[11px] leading-tight font-extrabold">{pm.label}</span>
                    <span className="block text-[8px] font-normal opacity-60 uppercase tracking-wider mt-0.5">{pm.subtitle}</span>
                  </div>
                </button>
              );
            })}

          </div>
        </div>

        {/* Safety trust disclaimer */}
        <p className="text-[10px] text-teal-950/40 leading-relaxed text-center py-2">
          Payments are securely held in CareBridge escrow. Money will only be unlocked and released to the caregiver after they submit completion checklist proofs and you approve billing.
        </p>

      </div>

      {/* Persistent bottom checkout ribbon bar */}
      <div className="bg-white px-6 py-4.5 border-t border-gray-100 shadow-lg shadow-teal-950/5 flex items-center justify-between z-10 gap-4 fixed bottom-0 left-0 right-0">
        <div className="flex flex-col">
          <p className="text-[10px] text-teal-950/45 uppercase font-bold tracking-wider leading-none">Est. Final Invoice</p>
          <p className="text-xl font-black text-teal-950 mt-1">RM {pricing.total.toFixed(2)}</p>
        </div>
        <button
          id="btn-confirm-and-pay"
          onClick={confirmBookingOrder}
          className="flex-1 py-4.5 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs tracking-wide shadow-md shadow-teal-800/10 flex items-center justify-center gap-2 max-w-xs transition duration-200"
        >
          Confirm & Escrow Booking
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

    </div>
  );
}
