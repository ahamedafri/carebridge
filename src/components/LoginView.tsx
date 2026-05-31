/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { HelpCircle, Phone, Mail, KeyRound, Check, Gift } from "lucide-react";

export default function LoginView() {
  const { navigate, currentUser } = useApp();
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [errors, setErrors] = useState<string | null>(null);

  const triggerOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email) {
      setErrors("Please fill in both phone and email credentials");
      return;
    }
    setErrors(null);
    setStep("otp");
    // Pre-fill a realistic OTP
    setOtp("4819");
  };

  const handleLoginConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "4819") {
      setErrors("Invalid simulation code (use 4819)");
      return;
    }
    navigate("home");
  };

  const handleQuickDemoBypass = () => {
    navigate("home");
  };

  return (
    <div id="login-screen" className="flex flex-col justify-between min-h-[640px] h-full w-full py-8 px-6 bg-gradient-to-b from-teal-50/10 via-amber-50/5 to-teal-50/10 overflow-hidden">
      
      {/* Top logo header */}
      <div className="flex flex-col items-center mt-2">
        <span className="w-1.5 h-6 bg-teal-600 rounded-full mb-1"></span>
        <h2 className="text-xl font-black text-teal-950 uppercase tracking-widest text-center">CareBridge</h2>
        <p className="text-[10px] text-teal-850 opacity-60 tracking-wider">Malaysia's Human Care Network</p>
      </div>

      {/* Primary login panel card */}
      <div className="flex-1 my-6 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-950/5 border border-teal-500/5 max-w-sm w-full mx-auto"
        >
          {/* Quick Demo Assist Banner */}
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-teal-500/5 border border-amber-500/20 text-amber-900 text-xs text-center">
            <span className="font-bold flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5 text-amber-600 fill-amber-100" /> Demo Account Ready
            </span>
            <button
              id="btn-bypass-login"
              onClick={handleQuickDemoBypass}
              className="mt-2 text-teal-800 font-extrabold underline hover:text-teal-950 text-xs block mx-auto py-1"
            >
              Instant Login with "Mafa" (No OTP required) 👉
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.form 
                key="credentials-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={triggerOTP}
                className="flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-teal-950 mb-1">Verify Identity</h3>
                  <p className="text-xs text-teal-900/65">Connect to book trusted care. We'll send an OTP.</p>
                </div>

                {errors && (
                  <p className="text-xs font-semibold text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {errors}
                  </p>
                )}

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-teal-950/60 uppercase mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-teal-950/40" />
                    <input
                      id="input-login-email"
                      type="email"
                      required
                      placeholder="e.g. mafa.family@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-teal-50/20 border border-teal-500/10 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-2xl text-xs font-semibold text-teal-950 placeholder-teal-950/30 transition-all"
                    />
                  </div>
                </div>

                {/* Mobile number Field */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-teal-950/60 uppercase mb-1.5 ml-1">Mobile Number (MY)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-teal-950/40" />
                    <input
                      id="input-login-phone"
                      type="tel"
                      required
                      placeholder="e.g. +60 16-123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-teal-50/20 border border-teal-500/10 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-2xl text-xs font-semibold text-teal-950 placeholder-teal-950/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="btn-login-receive-otp"
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-800/10 transition-all mt-1"
                >
                  Send OTP via WhatsApp/SMS
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLoginConfirm}
                className="flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-teal-950 mb-1">Enter Verification Code</h3>
                  <p className="text-xs text-teal-900/65">We've sent a 4-digit simulation code to <strong className="text-teal-950">{phone}</strong></p>
                </div>

                {errors && (
                  <p className="text-xs font-semibold text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {errors}
                  </p>
                )}

                {/* Simulated Verification Code box */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-teal-950/60 uppercase mb-1.5 ml-1">Verification Code OTP</label>
                  <div className="relative flex items-center justify-center">
                    <KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-teal-950/40" />
                    <input
                      id="input-login-otp"
                      type="text"
                      required
                      maxLength={4}
                      placeholder="Enter 4819"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-teal-50/20 border border-teal-500/10 focus:border-teal-600 rounded-2xl text-center text-sm font-bold tracking-[0.5em] text-teal-950 placeholder-teal-950/30 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-1 text-xs">
                  <span className="text-teal-950/50">Didn't get the code?</span>
                  <button 
                    id="btn-resend-otp"
                    type="button" 
                    onClick={() => setOtp("4819")}
                    className="text-teal-800 hover:text-teal-950 font-bold underline"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    id="btn-otp-back"
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="w-1/3 py-3 rounded-2xl bg-gray-55 hover:bg-gray-100 border border-gray-200 text-teal-950 font-bold text-xs transition-all"
                  >
                    Back
                  </button>
                  <button
                    id="btn-login-verify"
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-800/10 transition-all"
                  >
                    Verify & Enter
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer link row */}
      <div className="flex flex-col items-center gap-2 mt-auto z-10">
        <div className="text-xs text-teal-950/50 text-center leading-relaxed">
          Platform protected by Malaysia Personal Data Protection Act (PDPA).
        </div>
        
        {/* Bridge trigger: Helper application */}
        <button
          id="btn-join-as-helper"
          onClick={() => {
            alert("To run helper tasks, use the floating 'Simulation Control' panel on the right side of the screen at any time!");
          }}
          className="text-teal-800 text-xs font-bold hover:text-teal-950 bg-teal-100/40 px-3.5 py-1.5 border border-teal-500/10 rounded-full"
        >
          💼 Are you joining as a caregiver or helper? Learn more
        </button>
      </div>

    </div>
  );
}

import { AnimatePresence } from "motion/react";
