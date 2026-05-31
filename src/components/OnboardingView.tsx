/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { ShieldAlert, ArrowRight, Compass, Users, CheckCircle } from "lucide-react";

const PANELS = [
  {
    title: "Book help in minutes",
    text: "Find trusted local helpers for daily assistance, medicine collection, or quick hospital appointments in Malaysia.",
    badge: "Fast & Convenient",
    icon: Compass,
    iconColor: "text-emerald-600 bg-emerald-100/60",
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=400&q=80" // Warm hands
  },
  {
    title: "Support parents from anywhere",
    text: "Perfect for busy working professionals and overseas children wanting to support elderly parents living alone in KL, Penang or Johor.",
    badge: "Connect from Afar",
    icon: Users,
    iconColor: "text-amber-600 bg-amber-100/60",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80" // Happy elder
  },
  {
    title: "Safe, tracked, verified",
    text: "Receive real-time progress photo updates. Every single CareBridge Helper goes through strict ID, police, and basic healthcare training verification.",
    badge: "Complete Peace of Mind",
    icon: CheckCircle,
    iconColor: "text-teal-600 bg-teal-100/60",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=400&q=80" // Nurse measuring pressure
  }
];

export default function OnboardingView() {
  const { navigate } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < PANELS.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      navigate("login");
    }
  };

  const currentPanel = PANELS[activeIndex];
  const IconComponent = currentPanel.icon;

  return (
    <div id="onboarding-screen" className="flex flex-col justify-between min-h-[640px] h-full w-full py-8 px-6 bg-gradient-to-b from-white to-teal-50/20 overflow-hidden">
      
      {/* Top Header Row with Skip */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-teal-600 rounded-full"></span>
          <span className="text-sm font-extrabold text-teal-950 uppercase tracking-widest">CareBridge</span>
        </div>
        
        {activeIndex < PANELS.length - 1 && (
          <button
            id="btn-onboarding-skip"
            onClick={() => navigate("login")}
            className="text-xs font-semibold text-teal-950/50 hover:text-teal-900 bg-teal-950/5 px-2.5 py-1 rounded-full uppercase"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slides Carousel */}
      <div className="flex-1 flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            {/* Visual Aspect Photo */}
            <div className="relative w-full max-w-sm h-52 mb-8 rounded-3xl overflow-hidden shadow-md shadow-teal-900/5 bg-gray-100">
              <img
                src={currentPanel.image}
                alt={currentPanel.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex p-1.5 rounded-full backdrop-blur-md bg-white/80 border border-white/20">
                <span className={`flex items-center justify-center p-2 rounded-full ${currentPanel.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Slide Badge */}
            <span className="text-xs px-3 py-1 font-bold text-teal-700 bg-teal-100/50 rounded-full tracking-wide mb-3">
              {currentPanel.badge}
            </span>

            {/* Slide Title */}
            <h2 className="text-2xl font-extrabold text-teal-950 mb-3 tracking-tight">
              {currentPanel.title}
            </h2>

            {/* Slide Text */}
            <p className="text-sm text-teal-900/70 max-w-[320px] leading-relaxed">
              {currentPanel.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls Indicator */}
      <div className="w-full max-w-sm flex flex-col gap-6 items-center">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {PANELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-teal-600" : "w-2.5 bg-teal-300/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Action button */}
        <button
          id="btn-onboarding-next"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-800/10 flex items-center justify-center gap-2"
        >
          {activeIndex === PANELS.length - 1 ? (
            "Start Now"
          ) : (
            <>
              Next Slide
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
