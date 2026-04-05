import React, { useState, useEffect, useRef } from "react";
import { LogOut, User, Crown, Phone, Mail, ChevronUp } from "lucide-react";

// 🔥 Set your backend base URL for images
const IMG_BASE_URL = "http://localhost:5000/";

export default function ProfileSection({ 
  user, 
  onLogout, 
  goToSettings, 
  goToEditProfile 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the popup if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 DYNAMIC TRIAL CALCULATION
  const calculateTrialDays = () => {
    if (!user?.createdAt) return 12; 
    
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    
    const diffTime = Math.abs(today - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const remaining = 12 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  const trialDays = calculateTrialDays();
  const isTrial = user?.isSubscribed ? false : trialDays > 0;

  // SAFE DATA EXTRACTION
  const userName = user?.name || "VisionX User";
  const userEmail = user?.email || "No Email Linked";
  const userMobile = user?.mobile || "No Mobile Linked";
  
  // 🔥 THE FIX: Safe Avatar URL generation with Backend Pathing
  const avatarUrl = user?.profilePic 
    ? (user.profilePic.startsWith('data:') || user.profilePic.startsWith('http') 
        ? user.profilePic 
        : `${IMG_BASE_URL}${user.profilePic}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&bold=true`;

  return (
    <div className="relative w-full" ref={menuRef}>
      
      {/* 🔼 POPUP MENU (Glassmorphism Style) */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-3 bg-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
          
          {/* User Details Header */}
          <div className="p-5 border-b border-slate-700/50 bg-slate-800/40">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Account Info</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[11px] text-slate-300">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span className="font-bold truncate">{userMobile}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-300">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span className="font-bold truncate">{userEmail}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-2 space-y-1">
            <button 
              onClick={() => { setIsOpen(false); if (goToEditProfile) goToEditProfile(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all group"
            >
              <User size={16} className="text-slate-500 group-hover:text-blue-400" /> Edit Profile
            </button>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={16} /> Logout System
            </button>
          </div>
        </div>
      )}

      {/* 👤 MAIN PROFILE CARD (Visible in Sidebar) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl flex items-center justify-between border transition-all cursor-pointer group
          ${isOpen ? 'bg-slate-800 border-slate-600 shadow-lg' : 'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/60 hover:border-slate-700'}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          
          {/* Avatar with Online Indicator */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center">
              <img 
                src={avatarUrl} 
                alt={userName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Fallback to UI Avatars if the backend image path fails
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&bold=true`;
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#0B1120] rounded-full shadow-sm"></div>
          </div>
          
          {/* Name & Plan Badge */}
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-black text-white truncate max-w-[100px] uppercase tracking-tight" title={userName}>
              {userName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Crown size={10} className={isTrial ? "text-amber-400 shrink-0" : "text-blue-400 shrink-0"} />
              <span className={`text-[9px] font-black uppercase tracking-widest truncate ${isTrial ? 'text-amber-400' : 'text-blue-400'}`}>
                {isTrial ? `${trialDays} Days Trial` : "VisionX Pro"}
              </span>
            </div>
          </div>

        </div>
        
        {/* Animated Chevron */}
        <ChevronUp size={16} className={`text-slate-600 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : 'group-hover:text-slate-400'}`} />
      </div>

    </div>
  );
}