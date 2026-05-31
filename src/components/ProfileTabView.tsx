/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  User, 
  MapPin, 
  Users, 
  PhoneCall, 
  Settings, 
  Gift, 
  Heart, 
  ShieldCheck, 
  Activity,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function ProfileTabView() {
  const { currentUser, resetAll } = useApp();
  const [notifState, setNotifState] = useState(true);

  const handleResetDemo = () => {
    if (window.confirm("This will reset all states and return you back to the CareBridge welcome splash. Continue?")) {
      resetAll();
    }
  };

  return (
    <div id="profile-tab-screen" className="flex flex-col min-h-[640px] h-full pb-20 bg-gray-55">
      
      {/* 1. Profile Avatar Header Card */}
      <div className="bg-white px-6 pt-7 pb-6 border-b border-gray-150 flex flex-col items-center text-center gap-3 shadow-xs">
        <div className="relative">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-18 h-18 rounded-3xl object-cover shadow border border-gray-100"
          />
          <span className="absolute bottom-0 right-0 bg-teal-650 text-white p-0.5 rounded-full border border-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <h2 id="profile-user-fullname" className="text-base font-black text-teal-950 leading-tight">
            {currentUser.name} (Daughter)
          </h2>
          <p className="text-[10px] text-teal-950/45 font-bold uppercase tracking-wider mt-1">Primary Family Administrator</p>
        </div>
      </div>

      <div className="px-6 py-6 flex flex-col gap-6">

        {/* 2. Personal Contact Details */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-50 pb-2 leading-none mb-1">
            Personal Details
          </h3>
          <div className="flex flex-col gap-3 text-xs leading-none">
            <div className="flex justify-between">
              <span className="text-teal-950/50 font-semibold">Email Account</span>
              <span className="font-bold text-teal-950">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-950/50 font-semibold">Contact phone</span>
              <span className="font-bold text-teal-950">{currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* 3. Family Profiles List */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-1">
            <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none">
              Family Profiles & Recipients ({currentUser.familyMembers.length})
            </h3>
            <button
              onClick={() => alert("Simulated: Custom family profile builder launched!")}
              className="text-[9.5px] font-black text-teal-700 hover:underline"
            >
              + Add New
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {currentUser.familyMembers.map((member) => (
              <div key={member.name} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                <span className="flex items-center justify-center p-2 rounded-xl bg-teal-50 text-teal-700 text-xs text-center">
                  👴
                </span>
                <div className="flex-1 text-[11px] leading-relaxed">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-teal-950">{member.name}</span>
                    <span className="text-[9px] font-semibold text-teal-950/50 uppercase">{member.age} y/o • {member.gender}</span>
                  </div>
                  <p className="text-[10.5px] text-teal-950/60 mt-0.5"><strong className="text-teal-900">Care alerts:</strong> {member.medicalAlerts}</p>
                  <p className="text-[10.5px] text-teal-950/60"><strong className="text-teal-900">Mobility:</strong> {member.mobilityStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Saved Addresses */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-1">
            <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none">
              Saved Locations ({currentUser.savedAddresses.length})
            </h3>
            <button
              onClick={() => alert("Simulated: Google places address selection launcher!")}
              className="text-[9.5px] font-black text-teal-700 hover:underline"
            >
              + New Address
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {currentUser.savedAddresses.map((addr) => (
              <div key={addr.label} className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-teal-950 block">{addr.label}</span>
                  <span className="text-[10px] text-teal-950/65 block mt-0.5">{addr.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Emergency contacts */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-50 pb-2 leading-none mb-1">
            Ambulance Emergency Contacts
          </h3>
          <div className="flex flex-col gap-3">
            {currentUser.emergencyContacts.map((node) => (
              <div key={node.name} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-teal-950 block">{node.name}</span>
                  <span className="text-[9.5px] text-teal-950/45 mt-0.5 block">{node.relation}</span>
                </div>
                <span className="font-extrabold text-teal-950 font-mono">{node.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Medical preferences */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-50 pb-2 leading-none mb-1">
            Clinical Preferences
          </h3>
          <p className="text-xs text-teal-950/70 leading-relaxed bg-gray-55 p-3 rounded-xl italic">
            "{currentUser.medicalPreferences}"
          </p>
        </div>

        {/* 7. Settings checkboxes */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest border-b border-gray-50 pb-2 leading-none mb-1">
            App Configuration
          </h3>
          <div className="flex justify-between items-center text-xs pb-1.5">
            <span className="font-bold text-teal-950">Receive real-time Whatsapp SMS pings</span>
            <input
              id="chk-notif-perm"
              type="checkbox"
              checked={notifState}
              onChange={() => setNotifState(prev => !prev)}
              className="text-teal-650 focus:ring-teal-500 rounded border-gray-300 w-4 h-4"
            />
          </div>
        </div>

        {/* 8. Promotion referral box */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-4.5 flex justify-between items-center gap-4">
          <div>
            <h4 className="text-xs font-extrabold text-emerald-950">Refer a Friend, Get RM20</h4>
            <p className="text-[10.5px] text-emerald-900/60 leading-normal mt-1">
              Share CareBridge with colleagues or cousins supporting parents in Malaysia. Both get care credits!
            </p>
          </div>
          <button
            onClick={() => alert("Direct share link coped to clipboard: https://carebridge.my/invite/Mafa4819")}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10.5px] rounded-xl px-3.5 py-2 shrink-0 transition"
          >
            Invite
          </button>
        </div>

        {/* Support Portal Link and Reset option */}
        <div className="flex flex-col gap-2 pb-20">
          <button
            onClick={() => alert("Launching 24/7 client care chat desk...")}
            className="w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-teal-950 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition"
          >
            <HelpCircle className="w-4 h-4 text-teal-700" />
            Launch Support Center
          </button>
          
          <button
            id="btn-logout"
            onClick={handleResetDemo}
            className="w-full py-3.5 bg-red-50 hover:bg-red-100/50 border border-red-500/10 rounded-2xl text-xs font-bold text-red-950 flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            Reset Prototype State (Log Out)
          </button>
        </div>

      </div>
    </div>
  );
}
