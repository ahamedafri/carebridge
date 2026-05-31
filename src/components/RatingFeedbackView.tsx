/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Star, ShieldAlert, Check, Smile, ArrowLeft, Heart } from "lucide-react";

export default function RatingFeedbackView() {
  const { activeHelper, submitRatingAction, goBack } = useApp();

  const [stars, setStars] = useState<number>(5);
  const [punctual, setPunctual] = useState<boolean>(true);
  const [respectful, setRespectful] = useState<boolean>(true);
  const [wouldBookAgain, setWouldBookAgain] = useState<boolean>(true);
  
  // Custom feedback tags selection
  const [selectedTags, setSelectedTags] = useState<string[]>(["Professional", "Kind", "Helpful"]);
  const [commentText, setCommentText] = useState("");

  const availableTags = ["Professional", "Kind", "Helpful", "Needs improvement", "Late", "Attentive"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRatingAction(stars, {
      punctual,
      respectful,
      wouldBookAgain,
      tags: selectedTags,
      comments: commentText || "Excellent service. Warm and highly reliable."
    });
  };

  const helperName = activeHelper?.name || "CareBridge Caregiver";

  return (
    <div id="ratings-feedback-screen" className="flex flex-col min-h-[640px] h-full pb-24 bg-gray-55">
      
      {/* Header element */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-3 shadow-xs sticky top-0 z-10">
        <button
          id="btn-rating-back"
          onClick={goBack}
          className="p-2 rounded-xl hover:bg-gray-100/85 text-teal-950 transition duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-teal-950 leading-tight">
            How was your Caregiver?
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-teal-900/60 mt-0.5">
            Rate {helperName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-6">

        {/* 1. Star Rating Block Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4">
          <p className="text-xs font-bold text-teal-950/60 uppercase tracking-wider">Tap stars to rate</p>
          
          <div className="flex gap-2.5 my-2">
            {[1, 2, 3, 4, 5].map((s) => {
              const active = s <= stars;
              return (
                <button
                  id={`btn-star-${s}`}
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  className="p-1 cursor-pointer transform active:scale-125 transition-transform"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      active ? "text-amber-500 fill-amber-400" : "text-gray-200"
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm font-extrabold text-teal-950">
            {stars === 5 ? "Perfect! Highly Recommended" : 
             stars === 4 ? "Great Experience" : 
             stars === 3 ? "Satisfactory" : 
             stars === 2 ? "Need Improvements" : "Abit Disappointed"}
          </span>
        </div>

        {/* 2. Yes/No Questionnaire Matrix */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-black text-teal-950 uppercase tracking-widest border-b border-gray-100 pb-2 mb-1">
            Caregiver Feedback Metrics
          </h3>

          {[
            { label: "Was the helper punctual & on-time?", value: punctual, setter: setPunctual, id: "punctual" },
            { label: "Was the service respectful & respectful?", value: respectful, setter: setRespectful, id: "respectful" },
            { label: "Would you book this same helper again?", value: wouldBookAgain, setter: setWouldBookAgain, id: "bookagain" }
          ].map((item) => (
            <div key={item.id} className="flex justify-between items-center gap-4 text-xs leading-none py-1">
              <span className="text-teal-950 font-bold max-w-[190px] leading-normal">{item.label}</span>
              <div className="flex gap-1.5 shrink-0 bg-gray-55 border border-gray-200/60 p-1 rounded-xl">
                <button
                  id={`btn-${item.id}-yes`}
                  type="button"
                  onClick={() => item.setter(true)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                    item.value 
                      ? "bg-teal-700 text-white shadow-xs" 
                      : "text-teal-950/45 hover:text-teal-950"
                  }`}
                >
                  Yes
                </button>
                <button
                  id={`btn-${item.id}-no`}
                  type="button"
                  onClick={() => item.setter(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                    !item.value 
                      ? "bg-red-650 text-white shadow-xs" 
                      : "text-teal-950/45 hover:text-teal-950"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Optional tags block */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
          <h3 className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none mb-1">
            Optional Feedback Tags
          </h3>
          <div className="flex flex-wrap gap-2.5 mt-1">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  id={`btn-tag-${tag.toLowerCase().replace(" ", "-")}`}
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    active 
                      ? "bg-teal-50 border-teal-600 text-teal-950 font-black ring-1 ring-teal-600" 
                      : "bg-white border-gray-200 text-teal-950/60 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Comments Box */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
          <label className="text-[10.5px] font-extrabold text-teal-950/50 uppercase tracking-widest leading-none">
            Comments & Feedback
          </label>
          <textarea
            id="textarea-feedback-comments"
            rows={3}
            placeholder="Help other Malaysian families! Write any helpful details about how the caregiver treated your parents, or things to notice next time."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-3.5 py-3 bg-gray-55 border border-gray-200 rounded-xl text-xs font-semibold focus:border-teal-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <button
          id="btn-ratings-submit"
          type="submit"
          className="w-full py-4.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-800/10 tracking-wide flex items-center justify-center gap-1.5 mt-2"
        >
          <Check className="w-4.5 h-4.5 text-white" />
          Submit Feedback & Pay Handover
        </button>

      </form>
    </div>
  );
}
