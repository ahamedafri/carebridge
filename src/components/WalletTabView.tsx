/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CreditCard, Tag, Sparkles, Check, ChevronRight, CornerDownRight, Landmark, Gift } from "lucide-react";

export default function WalletTabView() {
  const { bookingsHistory } = useApp();
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [careCredits, setCareCredits] = useState(150.00);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "CAREBRIDGE20") {
      setPromoMessage("Success! RM20.00 Care Credits added to your wallet.");
      setPromoSuccess(true);
      setCareCredits(prev => prev + 20);
      setPromoCode("");
    } else {
      setPromoMessage("Invalid promo code. Try CAREBRIDGE20");
      setPromoSuccess(false);
    }
  };

  return (
    <div id="wallet-tab-screen" className="flex flex-col min-h-[640px] h-full pb-20 bg-gray-55">
      
      {/* 1. Header Balance Panel Card */}
      <div className="bg-white px-6 pt-7 pb-6 border-b border-gray-100 flex flex-col gap-4 shadow-xs">
        <h2 className="text-lg font-black text-teal-950 leading-none">Wallet & Subscriptions</h2>

        {/* Glossy gradient wallet card representation */}
        <div className="bg-gradient-to-tr from-teal-700 via-teal-800 to-teal-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          {/* Background glowing shapes */}
          <div className="absolute top-[-20%] right-[-5%] w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-10%] w-44 h-44 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-teal-200 uppercase font-black tracking-widest">Available Escrow Wallet Credits</p>
              <h3 id="text-wallet-balance" className="text-3xl font-black text-white mt-1">RM {careCredits.toFixed(2)}</h3>
            </div>
            <span className="p-1 px-3 bg-white/10 text-white rounded-full text-[9px] font-bold uppercase tracking-wider relative">
              MYR Currency
            </span>
          </div>

          <div className="flex justify-between items-end mt-7 text-xs border-t border-white/10 pt-3.5">
            <div>
              <p className="text-[8px] text-white/50 uppercase">Account holder</p>
              <p className="font-extrabold mt-0.5">Mafa Family</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-white/50 uppercase">Primary card</p>
              <p className="font-mono mt-0.5">•••• 4819 (Visa)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">

        {/* 2. Promo code redemption */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3">
          <label className="text-[10px] font-extrabold text-teal-950/45 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Tag className="w-3.5 h-3.5 text-teal-700" /> Apply Promo Code / Credits
          </label>
          
          <form onSubmit={applyPromo} className="flex gap-2">
            <input
              id="input-promo-code"
              type="text"
              placeholder="e.g. CAREBRIDGE20"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-grow py-2.5 px-3.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-bold text-teal-950 focus:border-teal-600 focus:outline-none placeholder-teal-950/30"
            />
            <button
              id="btn-apply-promo"
              type="submit"
              className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150"
            >
              Apply
            </button>
          </form>

          {promoMessage && (
            <p className={`text-[10.5px] font-bold rounded-lg p-2.5 border leading-relaxed ${
              promoSuccess 
                ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                : "bg-red-50 text-red-700 border-red-100"
            }`}>
              {promoSuccess ? "✅" : "❌"} {promoMessage}
            </p>
          )}
        </div>

        {/* 3. Care Subscription Plans */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1">
            CareBridge Priority Packages
          </h3>
          
          {[
            {
              name: "Silver Support Package",
              price: "RM 299/mo",
              desc: "Includes 4 companion checks, free medicine delivery, and standard medical-grade nurses on stand-by.",
              badge: "Popular with Working Adults"
            },
            {
              name: "Golden Elder Care Suite",
              price: "RM 499/mo",
              desc: "8 monthly companion visits, active emergency ambulance priority code, weekly clinical check reports & unlimited medication refills.",
              badge: "Complete Parent Peace of Mind"
            }
          ].map((sub, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Abs decoration card */}
              <div className="absolute right-[-10%] top-[-10%] w-16 h-16 rounded-full opacity-5 pointer-events-none bg-teal-950" />
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    {sub.badge}
                  </span>
                  <h4 className="text-[13px] font-black text-teal-950 leading-tight">{sub.name}</h4>
                  <p className="text-[10.5px] text-teal-950/60 leading-normal mt-1.5">{sub.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-teal-950">{sub.price}</p>
                  <button
                    id={`btn-subscribe-${idx}`}
                    onClick={() => alert(`Subscribed to ${sub.name}! Surcharges are automatically debited monthly from primary card.`)}
                    className="mt-3.5 bg-teal-50 hover:bg-teal-100 border border-teal-500/15 text-teal-800 font-extrabold text-[10.5px] px-3 py-1.5 rounded-lg transition"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Past Receipts Billing History list */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h3 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1 border-b border-gray-50 pb-2">
            Invoices & Surcharge History
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            {bookingsHistory.map((bh) => (
              <div key={bh.id} className="flex justify-between items-center py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-teal-950 leading-tight">{bh.subService.name}</span>
                  <span className="text-[9px] text-teal-950/45 tracking-wider">{bh.schedule.timeString} • RefID: {bh.id}</span>
                </div>
                <span className="font-extrabold text-teal-950 text-right shrink-0">
                  -RM {bh.pricing.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
