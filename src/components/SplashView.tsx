/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { HeartHandshake, ShieldCheck, Heart } from "lucide-react";

export default function SplashView() {
  const { navigate } = useApp();

  return (
    <div id="splash-screen" className="relative flex flex-col justify-between items-center min-h-[640px] h-full w-full py-12 px-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/30 overflow-hidden">
      
      {/* Decorative Warm Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/5 text-teal-800 text-xs font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Verified Home Care & Errand Ecosystem
      </div>

      {/* Main Center Logo & Tagline */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center my-auto"
      >
        <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-teal-600 text-white shadow-xl shadow-teal-600/20">
          <HeartHandshake className="w-12 h-12" />
          <span className="absolute bottom-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-teal-950 mb-3 bg-clip-text">
          CareBridge
        </h1>
        
        <p className="text-base text-teal-900/80 max-w-[280px] font-medium leading-relaxed">
          “Trusted help, when you can’t be there”
        </p>

        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-teal-600 bg-white/70 px-3.5 py-1.5 rounded-full border border-teal-500/10">
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
          Crafted with care in Malaysia
        </div>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full max-w-sm flex flex-col gap-3.5 z-10"
      >
        <button
          id="btn-get-started"
          onClick={() => navigate("onboarding")}
          className="w-full py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[15px] shadow-lg shadow-teal-700/10 transform active:scale-[0.98] transition-all duration-200"
        >
          Get Started
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-teal-900/10"></div>
          <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-wider text-teal-950/40">Or Continue With</span>
          <div className="flex-grow border-t border-teal-900/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-login-whatsapp"
            onClick={() => navigate("login")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-500/10 text-emerald-700 font-medium text-xs transition duration-200"
          >
            {/* WhatsApp Accent */}
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            WhatsApp OTP
          </button>
          
          <button
            id="btn-login-google"
            onClick={() => navigate("login")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 text-gray-700 font-medium text-xs transition duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Google Account
          </button>
        </div>

        <p className="text-[11px] text-center text-teal-950/60 leading-normal mt-2">
          By signing up, you agree to our <a href="#" className="font-bold underline text-teal-900">Terms of Service</a> & <a href="#" className="font-bold underline text-teal-900">Privacy Policy</a>
        </p>

      </motion.div>
    </div>
  );
}
