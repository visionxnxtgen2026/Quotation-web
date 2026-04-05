import React, { useState } from "react";
import {
  LayoutDashboard as DashboardIcon,
  FileText as FileIcon,
  Eye as EyeIcon,
  Download as ExportIcon,
  CreditCard as SubscriptionIcon,
  LifeBuoy as HelpIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon, 
  AlertTriangle 
} from "lucide-react";

// 🔥 IMPORT PROFILE SECTION
import ProfileSection from "../../components/profile/ProfileSection"; 

// 🔥 BACKEND URL FOR IMAGES
const IMG_BASE_URL = "http://localhost:5000/";

export default function Sidebar({
  active = "dashboard",
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
  goToSubscription, 
  goToSettings,
  goToHelp, 
  goToEditProfile, 
  user, 
}) {
  // ✅ STATE FOR CUSTOM LOGOUT MODAL
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ TRIGGER MODAL INSTEAD OF BROWSER ALERT
  const handleLogoutTrigger = () => {
    setShowLogoutModal(true);
  };

  // ✅ ACTUAL LOGOUT LOGIC
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    window.location.href = "/"; 
  };

  // 🔥 THE FIX: Process the user object to ensure the profilePic has the correct full URL
  const displayUser = user ? {
    ...user,
    profilePic: user.profilePic
      ? (user.profilePic.startsWith('data:') || user.profilePic.startsWith('http')
          ? user.profilePic
          : `${IMG_BASE_URL}${user.profilePic}`)
      : null
  } : null;

  return (
    <>
      <div className="w-[250px] bg-[#0B1120] text-slate-300 h-screen p-5 flex flex-col justify-between fixed left-0 top-0 border-r border-slate-800/60 shadow-2xl z-50">

        {/* TOP SECTION: LOGO & MENU */}
        <div>
          {/* CUSTOM VISION X LOGO */}
          <div 
            onClick={goToDashboard}
            className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:-translate-y-0.5 border border-blue-500/30 shrink-0 bg-black">
              <img src="/vision X logo.png" alt="Vision X" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-wide text-white truncate">
                vision<span className="text-blue-500">X</span>
              </h1>
              <p className="text-[8px] text-blue-400 tracking-[0.2em] font-bold uppercase mt-0.5 truncate">
                Next-Gen Tech
              </p>
            </div>
          </div>

          {/* MAIN MENU SECTION */}
          <div className="mb-8">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>

            <div className="space-y-1.5">
              <MenuItem
                icon={<DashboardIcon size={18} />}
                label="Dashboard"
                active={active === "dashboard"}
                onClick={goToDashboard}
              />

              <MenuItem
                icon={<FileIcon size={18} />}
                label="Create Quote"
                active={active === "create"}
                onClick={goToCreate}
              />

              <MenuItem
                icon={<EyeIcon size={18} />}
                label="Preview"
                active={active === "preview"}
                onClick={goToPreview}
              />

              <MenuItem
                icon={<ExportIcon size={18} />}
                label="Export"
                active={active === "export"}
                onClick={goToExport}
              />
            </div>
          </div>

          {/* SYSTEM SECTION */}
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
              System
            </p>
            
            <div className="space-y-1.5">
              <MenuItem
                icon={<SubscriptionIcon size={18} />}
                label="Manage Subscription"
                active={active === "subscription"}
                onClick={goToSubscription}
              />
              
              <MenuItem
                icon={<HelpIcon size={18} />}
                label="Help & Support"
                active={active === "help"}
                onClick={goToHelp} 
              />
              
              <MenuItem
                icon={<SettingsIcon size={18} />}
                label="Settings"
                active={active === "settings"}
                onClick={goToSettings}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: USER PROFILE */}
        <div className="mt-auto pt-5 border-t border-slate-800/60">
          <ProfileSection 
            user={displayUser} // 🔥 PASSING THE FIXED USER OBJECT HERE
            onLogout={handleLogoutTrigger} 
            goToSettings={goToSettings} 
            goToEditProfile={goToEditProfile} 
          />
        </div>
      </div>

      {/* =========================================
          🔥 CUSTOM LOGOUT MODAL 
          ========================================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 border border-red-500/20">
                <LogOutIcon className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white tracking-tight">Confirm Logout</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Are you sure you want to log out? You will need to sign in again to access your dashboard.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-3 rounded-xl border border-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-800/50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 🔥 REUSABLE MENU ITEM COMPONENT */
function MenuItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
        active
          ? "text-white bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
          : "text-slate-400 hover:text-white hover:bg-slate-800/80"
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      )}
      
      <div className={`transition-transform duration-300 ${!active && 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    </div>
  );
}