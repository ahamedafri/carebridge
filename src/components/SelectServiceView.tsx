/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MOCK_SUB_SERVICES } from "../data/mockData";
import { SubService } from "../types";
import { ArrowLeft, Check, Clock, ChevronRight, HelpCircle, Sparkles } from "lucide-react";

export default function SelectServiceView() {
  const { selectedCategory, selectSubServiceAction, goBack } = useApp();
  
  if (!selectedCategory) {
    return (
      <div className="p-6 text-center text-xs text-teal-950/60">
        No service category selected. Going back to dashboard...
      </div>
    );
  }

  // Filter products by selected category
  const filteredSubServices = MOCK_SUB_SERVICES.filter(
    (sub) => sub.category === selectedCategory
  );

  const [selectedSub, setSelectedSub] = useState<SubService>(
    filteredSubServices[0] || MOCK_SUB_SERVICES[0]
  );

  return (
    <div id="select-service-screen" className="flex flex-col min-h-[640px] h-full pb-24 bg-gray-50/50">
      
      {/* Top Header Row */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-3 shadow-xs sticky top-0 z-10">
        <button
          id="btn-select-service-back"
          onClick={goBack}
          className="p-2 rounded-xl hover:bg-gray-100/85 text-teal-950 transition duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-teal-950 leading-tight">
            {selectedCategory}
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-teal-900/60 mt-0.5">
            Choose Preferred Service Case
          </p>
        </div>
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col gap-5">
        
        {/* Category Description Banner */}
        <div className="bg-gradient-to-r from-teal-500/5 to-amber-500/5 border border-teal-500/10 rounded-2xl p-4 flex items-start gap-3">
          <span className="flex items-center justify-center p-2 bg-teal-600 rounded-xl text-white mt-0.5 shadow-md shadow-teal-600/10">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-extrabold text-teal-950">Malaysia's Qualified Network</h4>
            <p className="text-[10.5px] leading-relaxed text-teal-950/60 mt-1">
              Select one specialized care service below. Pricing is fully standardized to prevent surge exploitation and includes primary transport, insurance, and audit reports.
            </p>
          </div>
        </div>

        {/* Sub-services list */}
        <div className="flex-grow flex flex-col gap-3.5">
          <h3 className="text-[11px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1">
            Available Service Packages
          </h3>

          {filteredSubServices.length === 0 ? (
            <div className="p-8 text-center text-teal-950/40 text-xs bg-white rounded-2xl border border-gray-100">
              No specific sub-services available for this category yet.
            </div>
          ) : (
            filteredSubServices.map((sub) => {
              const works = sub.id === selectedSub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`bg-white rounded-2xl p-4.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    works 
                      ? "border-teal-600 ring-1 ring-teal-600 shadow-md shadow-teal-950/5 bg-teal-50/5" 
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-[13.5px] font-black text-teal-950 leading-snug">
                          {sub.name}
                        </h4>
                        {works && (
                          <span className="p-0.5 px-2 bg-teal-600 text-white rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Selected
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[11px] text-teal-950/65 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-teal-950/40 uppercase font-bold tracking-wider">Est. Price</p>
                      <p className="text-[14.5px] font-extrabold text-teal-950 mt-0.5">
                        RM {sub.basePrice}
                      </p>
                    </div>
                  </div>

                  {/* Durations Preview */}
                  <div className="border-t border-gray-100/80 mt-3.5 pt-3.5 flex items-center gap-3 text-[10.5px] text-teal-950/50">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Duration packages: {sub.durationOptions.map(opt => opt.label).join(", ")}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quality trust seal footer */}
        <div className="p-3 text-center text-[10px] text-teal-950/40 border-t border-gray-100 leading-normal">
          🔒 <strong>Secure Care:</strong> Standard bookings are covered under care insurance. Selected helpers undergo face-to-face evaluation by CareBridge auditors before activation.
        </div>
      </div>

      {/* Persistent Bottom Continue Bar */}
      <div className="bg-white px-6 py-4.5 border-t border-gray-100 shadow-lg shadow-teal-950/5 flex items-center justify-between z-10 gap-4 fixed bottom-0 left-0 right-0">
        <div className="flex flex-col">
          <p className="text-[10px] text-teal-950/45 uppercase font-bold tracking-wider leading-none">Starting from</p>
          <p className="text-lg font-black text-teal-950 mt-1">RM {selectedSub.basePrice}.00</p>
        </div>
        <button
          id="btn-select-service-continue"
          onClick={() => selectSubServiceAction(selectedSub)}
          className="flex-1 py-4.5 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs tracking-wide shadow-md shadow-teal-800/10 flex items-center justify-center gap-2 max-w-xs transition duration-200"
        >
          Configure Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
