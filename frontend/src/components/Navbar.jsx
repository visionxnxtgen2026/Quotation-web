import React from "react";
import { Bell, User, ChevronDown, Search } from "lucide-react";

export default function Navbar({ user }) {
  // Extracting first letter of name for the avatar
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="w-full h-18 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      
      {/* 🔍 LEFT SIDE: SEARCH (OPTIONAL) */}
      <div className="hidden md:flex items-center bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-500/30 focus-within:bg-white transition-all w-72">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none ml-3 text-sm font-medium w-full text-gray-700"
        />
      </div>

      {/* 🔔 RIGHT SIDE: ACTIONS & PROFILE */}
      <div className="flex items-center gap-6 ml-auto">
        
        {/* NOTIFICATION WITH BADGE */}
        <div className="relative group cursor-pointer">
          <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 transition-all duration-300">
            <Bell size={22} className="group-hover:animate-shake" />
          </div>

          {/* Dynamic Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
            3
          </span>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* PROFILE SECTION */}
        <div className="flex items-center gap-3 cursor-pointer group p-1.5 pr-3 rounded-2xl hover:bg-gray-50 transition-all duration-300">
          
          {/* AVATAR IMAGE OR INITIAL */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            {avatarLetter}
          </div>

          {/* USER NAME & STATUS */}
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1 leading-none">
              {user?.name || "Guest User"}
              <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
              {user?.isSubscribed ? "Pro Member" : "Free Trial"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}