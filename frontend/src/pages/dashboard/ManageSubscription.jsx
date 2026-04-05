import React, { useState } from "react";
import Sidebar from "./Sidebar"; 
import { Crown, CheckCircle2, ChevronRight, ArrowRight, Clock } from "lucide-react";

export default function ManageSubscription({ 
  user, 
  goToDashboard, 
  goToCreate, 
  goToExport, 
  goToEditProfile,
  goToSubscription, // Added for navigation safety
  goToSettings,     // Passed from App.jsx
  goToHelp          // Passed from App.jsx
}) {
  const [billingCycle, setBillingCycle] = useState("yearly");

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 text-slate-800">
      
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar 
          active="subscription" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={goToCreate} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription || (() => {})} 
          goToSettings={goToSettings} 
          goToHelp={goToHelp}         
          goToEditProfile={goToEditProfile}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] min-h-screen flex flex-col relative pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Subscription</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">View and manage your current billing plan and offers.</p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-10 max-w-3xl mx-auto w-full mt-4 animate-fade-in">
          
          {/* TOP BANNER - CURRENT PLAN */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-t-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                <Crown size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Plan Status</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {user?.plan === 'pro' ? 'Pro Plan' : 'Standard Plan'}
                </h2>
                <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Free Trial Active
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-white/60 p-4 rounded-xl border border-white/80 backdrop-blur-sm relative z-10">
              <div className="flex justify-between text-xs font-black text-indigo-900 mb-2 px-1 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock size={12}/> Joined: May 3</span>
                <span>Offer Ends: June 3</span>
              </div>
              <div className="w-full bg-indigo-100 h-2.5 rounded-full overflow-hidden border border-indigo-200">
                <div className="bg-indigo-500 w-[15%] h-full rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* MAIN PRICING CARD */}
          <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl p-8 shadow-xl shadow-slate-200/50">
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upgrade or Extend</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Select your preferred billing cycle post-trial</p>
              </div>
              
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Yearly <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full">Save 16%</span>
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="border-2 border-indigo-500 bg-indigo-50/30 rounded-3xl p-8 relative overflow-hidden group">
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 relative z-10">
                <div className="text-center md:text-left">
                  <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {billingCycle === 'monthly' ? '₹99' : '₹999'}
                    </span>
                    <span className="text-slate-500 font-bold text-lg">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-lg border border-indigo-100">
                    {billingCycle === 'monthly' ? 'Standard Billing' : '✨ Best Value: Save ₹189 yearly'}
                  </p>
                </div>
                
                <button className="bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group/btn">
                  Continue {user?.plan === 'pro' ? 'PRO' : 'STANDARD'} <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Promo Banner (Launch Strategy) */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 border border-amber-300 rounded-2xl p-5 text-center shadow-lg relative z-10">
                <p className="font-black text-white text-lg flex items-center justify-center gap-2 tracking-wide shadow-black/10 drop-shadow-md">
                  🎉 LAUNCH SPECIAL: NEXT 6 MONTHS @ ₹100
                </p>
                <p className="text-[11px] font-black text-amber-900 mt-1.5 uppercase tracking-widest opacity-90 bg-white/30 inline-block px-3 py-1 rounded-md">
                  Early Adopter Reward • Valid till June 3
                </p>
              </div>
            </div>

            {/* FEATURES LIST */}
            <div className="mt-10 bg-slate-50 border border-slate-100 rounded-3xl p-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                Standard Plan Inclusions
              </h4>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                <FeatureItem text="10 Quotations per day limit" />
                <FeatureItem text="Local device storage only" />
                <FeatureItem text="1 Month Free Trial for new users" />
                <FeatureItem text="Single Device Login control" />
                <FeatureItem text="VisionX Watermark on PDF exports" />
                <FeatureItem text="Standard Design Templates" />
              </ul>

              {/* UPGRADE HINT */}
              <div onClick={goToDashboard} className="mt-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform border border-indigo-50">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-indigo-900 leading-tight">Switch to PRO Plan (₹199/mo)</p>
                    <p className="text-xs font-medium text-indigo-700 mt-0.5">Unlock Cloud Backup, No Watermark & Multi-Device Sync</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <div className="p-0.5 bg-emerald-100 rounded-full mt-0.5">
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
      </div>
      <span className="text-[14px] text-slate-700 font-semibold leading-tight">{text}</span>
    </li>
  );
}