/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { RecipientDetails, LocationDetails, BookingStatus } from "../types";
import { ArrowLeft, Clock, MapPin, User, AlertCircle, Sparkles, Sliders, CalendarClock, ChevronRight } from "lucide-react";

export default function BookingFormView() {
  const { 
    activeBooking, 
    currentUser, 
    updateDraftBooking, 
    navigate, 
    goBack 
  } = useApp();

  if (!activeBooking) {
    return (
      <div className="p-6 text-center text-xs text-teal-950/60">
        No active booking. Please select a service first.
      </div>
    );
  }

  // Local Form state initialized from current draft
  const [whoType, setWhoType] = useState<"Myself" | "Parent" | "Child" | "Other">("Parent");
  
  // Recipient info
  const [name, setName] = useState(activeBooking.recipient.name || "");
  const [age, setAge] = useState(activeBooking.recipient.age || 70);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(activeBooking.recipient.gender || "Male");
  const [specialNotes, setSpecialNotes] = useState(activeBooking.recipient.specialNotes || "");
  const [medicalAlerts, setMedicalAlerts] = useState(activeBooking.recipient.medicalAlerts || "");
  const [mobilityStatus, setMobilityStatus] = useState<"Fully Independent" | "Needs Walking Support" | "Wheelchair Bound" | "Bedridden">(
    activeBooking.recipient.mobilityStatus || "Needs Walking Support"
  );

  // Address
  const [selectedAddrIndex, setSelectedAddrIndex] = useState(0);
  const [customCondo, setCustomCondo] = useState("");

  // Schedule
  const [scheduleType, setScheduleType] = useState<"Now" | "Later Today" | "Tomorrow" | "Custom">("Now");
  const [customDate, setCustomDate] = useState("2026-05-30");
  const [customTime, setCustomTime] = useState("10:00 AM");

  // Additional free instructions
  const [instructions, setInstructions] = useState(activeBooking.additionalInstructions || "");

  // Duration
  const [durationOptIndex, setDurationOptIndex] = useState(0);

  // Autofill family member profiles for excellent interactive UX
  const applyFamilyAutofill = (memberIndex: number) => {
    const member = currentUser.familyMembers[memberIndex];
    if (member) {
      setName(member.name);
      setAge(member.age);
      setGender(member.gender);
      setSpecialNotes(member.specialNotes);
      setMedicalAlerts(member.medicalAlerts);
      setMobilityStatus(member.mobilityStatus);
    }
  };

  const handleAutofillMyself = () => {
    setName(currentUser.name);
    setAge(30);
    setGender("Female");
    setSpecialNotes("None. Booking on behalf of myself.");
    setMedicalAlerts("No known allergies.");
    setMobilityStatus("Fully Independent");
  };

  const handleSubmitToPricing = (e: React.FormEvent) => {
    e.preventDefault();

    const recipient: RecipientDetails = {
      name,
      age: Number(age),
      gender,
      specialNotes,
      medicalAlerts,
      mobilityStatus
    };

    const locationSource = currentUser.savedAddresses[selectedAddrIndex];
    const location: LocationDetails = {
      address: locationSource?.address || "Malaysia default Address",
      landmark: (locationSource?.label || "Home") + (customCondo ? ` (${customCondo})` : ""),
      type: locationSource?.label.includes("Clinic") || locationSource?.label.includes("Hospital") ? "Hospital" : "Home"
    };

    let scheduleString = "Within 30 mins";
    if (scheduleType === "Later Today") scheduleString = "Later Today (around 4:00 PM)";
    if (scheduleType === "Tomorrow") scheduleString = "Tomorrow (around 10:00 AM)";
    if (scheduleType === "Custom") scheduleString = `${customDate} at ${customTime}`;

    const selectedDuration = activeBooking.subService.durationOptions[durationOptIndex] || { label: "1 Hour", hours: 1 };

    updateDraftBooking({
      recipient,
      location,
      schedule: {
        type: scheduleType,
        timeString: scheduleString,
        customDate: scheduleType === "Custom" ? customDate : undefined
      },
      selectedDuration,
      additionalInstructions: instructions
    });

    navigate("pricing_confirmation");
  };

  return (
    <div id="booking-details-form-screen" className="flex flex-col min-h-[640px] h-full pb-24 bg-gray-50/50">
      
      {/* Top Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-3 shadow-xs sticky top-0 z-10">
        <button
          id="btn-booking-form-back"
          onClick={goBack}
          className="p-2 rounded-xl hover:bg-gray-100/85 text-teal-950 transition duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-teal-950 leading-tight">
            Booking: {activeBooking.subService.name}
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-teal-900/60 mt-0.5">
            Configure Care Recipient & Location
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitToPricing} className="px-6 py-5 flex flex-col gap-6">

        {/* SECTION A: Who is this for? */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <User className="w-4 h-4" />
            </span>
            <h3 className="text-[13px] font-extrabold text-teal-950 uppercase tracking-wider">A. Who is this for?</h3>
          </div>

          {/* Type selections */}
          <div className="grid grid-cols-4 gap-2">
            {(["Myself", "Parent", "Child", "Other"] as const).map((type) => (
              <button
                id={`btn-who-${type.toLowerCase()}`}
                key={type}
                type="button"
                onClick={() => {
                  setWhoType(type);
                  if (type === "Myself") handleAutofillMyself();
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                  whoType === type 
                    ? "bg-teal-700 text-white border-teal-700" 
                    : "bg-gray-50 text-teal-950/60 border-gray-150 hover:bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Quick Pre-fills for family */}
          {whoType === "Parent" && (
            <div className="mt-1 p-3 rounded-xl bg-teal-50/40 border border-teal-500/10">
              <p className="text-[10px] font-bold text-teal-950/55 uppercase tracking-wide mb-2">Saved Family Profiles (Tap to Autofill)</p>
              <div className="flex flex-wrap gap-2">
                {currentUser.familyMembers.map((member, idx) => (
                  <button
                    id={`btn-autofill-family-${idx}`}
                    key={member.name}
                    type="button"
                    onClick={() => applyFamilyAutofill(idx)}
                    className="py-1.5 px-3 rounded-lg bg-white border border-teal-600/15 hover:border-teal-600 text-[10.5px] text-teal-950 font-bold transition-all shadow-xs"
                  >
                    👵 {member.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: Recipient Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-[13px] font-extrabold text-teal-950 uppercase tracking-wider">B. Recipient Details</h3>
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Recipient Full Name</label>
              <input
                id="input-recipient-name"
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Age</label>
              <input
                id="input-recipient-age"
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Gender & Mobility Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Gender</label>
              <select
                id="input-recipient-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Mobility Status</label>
              <select
                id="input-recipient-mobility"
                value={mobilityStatus}
                onChange={(e) => setMobilityStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
              >
                <option value="Fully Independent">Fully Independent</option>
                <option value="Needs Walking Support">Needs Walking Support</option>
                <option value="Wheelchair Bound">Wheelchair Bound</option>
                <option value="Bedridden">Bedridden</option>
              </select>
            </div>
          </div>

          {/* Medical Alerts */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Medical Alerts / Vital Notes
            </label>
            <input
              id="input-recipient-alerts"
              type="text"
              placeholder="e.g. Hypertension, Diabetes, Penicillin Allergy"
              value={medicalAlerts}
              onChange={(e) => setMedicalAlerts(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Special Care Habits / Language Notes</label>
            <textarea
              id="input-recipient-notes"
              placeholder="e.g. Speaks mostly Malay, hard of hearing. Prefers gentle, slow conversations."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* SECTION C: Service Location */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-[13px] font-extrabold text-teal-950 uppercase tracking-wider">C. Service Location</h3>
          </div>

          {/* Saved addresses selector */}
          <div className="flex flex-col gap-2.5">
            {currentUser.savedAddresses.map((addr, idx) => (
              <label
                key={addr.label}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  selectedAddrIndex === idx 
                    ? "bg-teal-50/30 border-teal-600" 
                    : "bg-gray-55 border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  id={`radio-address-${idx}`}
                  type="radio"
                  name="saved-address-group"
                  checked={selectedAddrIndex === idx}
                  onChange={() => setSelectedAddrIndex(idx)}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-teal-950 block">{addr.label}</span>
                  <span className="text-[10.5px] text-teal-950/60 leading-normal mt-0.5 block">{addr.address}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Condo Landmark Descriptor details */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Landmark / Condo / Ward Number</label>
            <input
              id="input-address-landmark"
              type="text"
              placeholder="e.g. Block C, Level 7 Apartment / Outpatient ward 1C"
              value={customCondo}
              onChange={(e) => setCustomCondo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none"
            />
          </div>
        </div>

        {/* SERVICE CONFIGURATION: Duration & Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="text-[13px] font-extrabold text-teal-950 uppercase tracking-wider">D. Duration & Schedule</h3>
          </div>

          {/* Selected sub service duration options */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Select Duration Package</label>
            <div className="grid grid-cols-2 gap-2">
              {activeBooking.subService.durationOptions.map((opt, idx) => (
                <button
                  id={`btn-duration-${idx}`}
                  key={opt.label}
                  type="button"
                  onClick={() => setDurationOptIndex(idx)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    idx === durationOptIndex 
                      ? "bg-teal-50 border-teal-600 text-teal-950 ring-1 ring-teal-600" 
                      : "bg-white border-gray-200 text-teal-950 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule choices */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Service Schedule</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: "Now", label: "⚡ Now" },
                { id: "Later Today", label: "🕒 Today" },
                { id: "Tomorrow", label: "📅 Tomorrow" },
                { id: "Custom", label: "🗓️ Custom" }
              ] as const).map((sc) => (
                <button
                  id={`btn-sched-${sc.id.toLowerCase().replace(" ", "-")}`}
                  key={sc.id}
                  type="button"
                  onClick={() => setScheduleType(sc.id)}
                  className={`py-2 p-1.5 rounded-xl border text-xs font-bold text-center transition-all leading-snug ${
                    scheduleType === sc.id 
                      ? "bg-teal-700 text-white border-teal-700" 
                      : "bg-gray-55 border-gray-200 text-teal-950/70 hover:bg-gray-100"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Custom Time Picker */}
            {scheduleType === "Custom" && (
              <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-teal-50/30 border border-teal-500/10 rounded-xl">
                <div>
                  <label className="block text-[9px] font-extrabold tracking-wider uppercase text-teal-950/60 mb-1">Pick Date</label>
                  <input
                    id="input-schedule-date"
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-205 rounded-lg text-xs font-bold text-teal-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold tracking-wider uppercase text-teal-950/60 mb-1">Pick Time</label>
                  <input
                    id="input-schedule-time"
                    type="text"
                    value={customTime}
                    placeholder="e.g. 10:30 AM"
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-205 rounded-lg text-xs font-bold text-teal-950 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION E: Additional Instructions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <CalendarClock className="w-4 h-4" />
            </span>
            <h3 className="text-[13px] font-extrabold text-teal-950 uppercase tracking-wider">E. Additional Instructions</h3>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-teal-950/50 mb-1.5">Free-text instructions for helper</label>
            <textarea
              id="textarea-instructions"
              rows={3}
              placeholder='e.g., "Please help my mother collect medicine and stay with her until she returns home safely. She might need translation from Bahasa Melayu to English with the doctor."'
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-3 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* BOTTOM SUBMIT ROW */}
        <button
          id="btn-booking-form-submit"
          type="submit"
          className="w-full py-4.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-800/20 tracking-wide flex items-center justify-center gap-2 mt-4 transform active:scale-[0.98] transition-all"
        >
          Check Estimated Pricing
          <ChevronRight className="w-4 h-4" />
        </button>

      </form>
    </div>
  );
}
