import React, { useState } from "react";
import { 
  Crown, CheckCircle2, AlertCircle, CreditCard, 
  Calendar, Zap, ShieldCheck, ArrowRight, Sparkles 
} from "lucide-react";

export default function MembershipBadge({ user }) {
  const [isYearly, setIsYearly] = useState(true);

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

  const remainingDays = calculateTrialDays();
  const isTrialActive = remainingDays > 0;
  const isExpired = remainingDays <= 0 && !user?.isSubscribed;
  
  // Checking plan status
  const isPro = user?.plan === 'pro' || user?.isSubscribed;

  const handleUpgrade = (planType) => {
    // Razorpay / Stripe Integration point
    console.log(`Initiating checkout for: ${planType}`);
    alert(`Redirecting to Secure Payment Gateway for VisionX ${planType} Plan...`);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden animate-fade-in">
      
      {/* 🟢 TOP SECTION: STATUS HEADER */}
      <div className={`p-10 border-b relative overflow-hidden ${
        isPro ? 'bg-slate-900 text-white' : 
        isExpired ? 'bg-red-50' : 'bg-blue-600 text-white'
      }`}>
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Zap size={200} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg
              ${isPro ? 'bg-blue-500 text-white' : isExpired ? 'bg-white text-red-600' : 'bg-white text-blue-600'}`}>
              {isPro ? <ShieldCheck size={32} strokeWidth={2.5} /> : isExpired ? <AlertCircle size={32} /> : <Crown size={32} strokeWidth={2.5} />}
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-70`}>
                Account Status
              </p>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                {isPro ? "VisionX Pro" : isExpired ? "Trial Expired" : "Free Trial Mode"}
                {isPro && <Sparkles size={20} className="text-yellow-400 animate-pulse" />}
              </h2>
            </div>
          </div>

          {!isPro && (
            <div className="text-right">
              {isTrialActive ? (
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                  <p className="text-3xl font-black leading-none">{remainingDays}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">Days Remaining</p>
                </div>
              ) : (
                <div className="bg-red-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest animate-pulse">
                  Locked
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar (Only for active trial) */}
        {!isPro && isTrialActive && (
          <div className="mt-8 relative">
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ width: `${((12 - remainingDays) / 12) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mt-3 opacity-60">
              <span>Day 01</span>
              <span>Trial Expiry (Day 12)</span>
            </div>
          </div>
        )}
      </div>

      {/* 💳 BOTTOM SECTION: UPGRADE INTERFACE */}
      {!isPro && (
        <div className="p-10 bg-slate-50/50">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Ready for the Pro Experience?</h3>
              <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                Unlock unlimited local and cloud quotations, remove all watermarks, and get priority WhatsApp support.
              </p>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center bg-slate-200/50 p-1.5 rounded-[1.25rem] border border-slate-200 shrink-0">
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isYearly ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${isYearly ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Yearly <span className="bg-blue-400 text-[9px] px-2 py-0.5 rounded-full">-16%</span>
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className={`border-2 rounded-[2rem] p-8 transition-all duration-500 relative ${isYearly ? 'border-blue-500 bg-white shadow-2xl shadow-blue-500/10' : 'border-slate-200 bg-white'}`}>
            {isYearly && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{isYearly ? '999' : '99'}</span>
                  <span className="text-slate-400 font-bold text-lg">/ {isYearly ? 'year' : 'month'}</span>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
                  {isYearly ? 'Billed annually (Best Value)' : 'Billed monthly. Cancel anytime.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <Feature item="Unlimited Quotations" />
                  <Feature item="Professional PDF Export" />
                  <Feature item="WhatsApp Auto-Share" />
                  <Feature item="Custom Company Branding" />
                  <Feature item="No VisionX Watermark" />
                  <Feature item="Cloud Backup & Sync" />
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                <button 
                  onClick={() => handleUpgrade(isYearly ? 'Yearly' : 'Monthly')}
                  className="w-full lg:w-56 bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95 text-xs group"
                >
                  <Zap size={18} className="fill-current group-hover:animate-bounce" /> Upgrade Now
                </button>
                <div className="mt-5 flex items-center justify-center gap-2 opacity-40">
                   <ShieldCheck size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Payment SSL</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 🏆 PRO USER FOOTER (Only visible when isPro is true) */}
      {isPro && (
        <div className="p-8 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Calendar className="text-slate-400" size={18} />
                <p className="text-sm font-bold text-slate-600">Your Pro plan is active until April 2027</p>
            </div>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                View Invoice
            </button>
        </div>
      )}

    </div>
  );
}

// Reusable Feature Component
function Feature({ item }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} className="text-emerald-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-slate-700">{item}</span>
        </div>
    );
}