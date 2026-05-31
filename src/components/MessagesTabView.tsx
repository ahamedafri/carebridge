/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Send, Image, PhoneCall, ShieldCheck, Smile, CornerDownLeft } from "lucide-react";

export default function MessagesTabView() {
  const { messages, activeHelper, sendUserMessage, sendHelperQuickReply } = useApp();
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendUserMessage(inputText);
    setInputText("");
  };

  const handleQuickTrigger = (text: string) => {
    sendHelperQuickReply(text);
  };

  const helperName = activeHelper?.name || "Sarah binti Ahmad";
  const helperPhoto = activeHelper?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80";

  return (
    <div id="messages-tab-screen" className="flex flex-col min-h-[640px] h-full pb-20 bg-gray-55 relative">
      
      {/* 1. Header Caregiver Profiler */}
      <div className="bg-white px-6 py-4 border-b border-gray-150 flex items-center justify-between shadow-xs sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={helperPhoto}
              alt={helperName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="text-xs font-black text-teal-950 flex items-center gap-1.5 leading-none">
              {helperName}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </h3>
            <p className="text-[9.5px] text-emerald-700 font-bold uppercase mt-1 tracking-wider">Online Caregiver</p>
          </div>
        </div>

        <button
          id="btn-call-helper-tab"
          onClick={() => alert(`Dialing ${helperName}: ${activeHelper?.phoneNumber || "+60 12-345 6789"}`)}
          className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
        >
          <PhoneCall className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* 2. Messages Bubble Window */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3.5 min-h-[320px]">
        
        {messages.map((msg) => {
          const isUser = msg.sender === "customer";
          const isSystem = msg.sender === "system";

          if (isSystem) {
            return (
              <div 
                key={msg.id} 
                className="mx-auto my-2 max-w-[260px] text-center bg-teal-50/60 text-teal-950 border border-teal-500/10 p-2.5 px-3.5 rounded-2xl text-[10px] leading-relaxed font-semibold shadow-xs"
              >
                📢 {msg.text}
                <span className="block text-[8px] opacity-45 mt-1">{msg.timestamp}</span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[75%] gap-1 ${
                isUser ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                  isUser
                    ? "bg-teal-700 text-white rounded-tr-none"
                    : "bg-white text-teal-950 border border-gray-150 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[8px] opacity-45 font-bold tracking-wide tracking-tight">{msg.timestamp}</span>
            </div>
          );
        })}

        <div ref={chatBottomRef} />
      </div>

      {/* 3. Auto-translated helper simulators buttons */}
      <div className="px-6 py-2 border-t border-gray-100 bg-white/95">
        <p className="text-[9.5px] font-extrabold uppercase tracking-widest text-teal-950/45 mb-2.5">
          Caregiver Quick replies simulator
        </p>
        <div className="flex flex-wrap gap-1.5 pb-2">
          {[
            "I'm here",
            "Delayed by 10 mins",
            "Task completed",
            "Need clarification"
          ].map((quick) => (
            <button
              id={`btn-qr-${quick.toLowerCase().replace(" ", "-")}`}
              key={quick}
              type="button"
              onClick={() => handleQuickTrigger(quick)}
              className="py-1.5 px-3 bg-gray-55 hover:bg-teal-50 border border-gray-200 hover:border-teal-600/20 text-[10px] font-bold text-teal-950 rounded-lg transition-all shadow-2xs"
            >
              💬 {quick}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Text Input Composer bar */}
      <form onSubmit={handleSend} className="bg-white p-3 border-t border-gray-150 flex items-center gap-2">
        <button
          type="button"
          onClick={() => alert("Photo loading attaches are fully simulated inside the floating simulator widget!")}
          className="p-3 text-gray-400 hover:text-teal-700 transition"
        >
          <Image className="w-5 h-5" />
        </button>
        
        <input
          id="input-chat-text"
          type="text"
          placeholder="Type message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow py-2.5 px-4 bg-gray-55 focus:bg-white border border-gray-200 focus:border-teal-600 focus:outline-none rounded-2xl text-xs font-semibold text-teal-950 placeholder-teal-950/30 transition-all"
        />

        <button
          id="btn-chat-send"
          type="submit"
          className="p-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow shadow-teal-800/10 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
