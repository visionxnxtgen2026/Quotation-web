import React from "react";
import { Star, CheckCircle2, ChevronRight, Cloud, Lock, Palette, ShieldCheck, Zap, Loader2, MonitorSmartphone } from "lucide-react";

export default function ProPlanCard({ 
  onSubscribe,     // API function passed from parent to open checkout modal
  billingCycle,    // State for 'monthly' or 'yearly' toggle
  setBillingCycle, // Function to update billing cycle state
  isCurrent,       // Boolean to check if user is already on this plan
  isLoading        // Boolean for API loading state
}) {

  return (
    <div className="rounded-3xl shadow-xl overflow-hidden border border-blue-200 animate-fade-in bg-white flex flex-col h-full font-sans transition-all hover:shadow-2xl hover:border-indigo-300">
      
      {/* 🌟 HEADER: PREMIUM THEME */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 border border-white/20 shadow-sm">
              Premium Edition
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Pro Plan</h2>
            <p className="text-blue-100 font-medium mt-1 text-sm">The Ultimate Business Tool for Professionals</p>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
            <Star size={28} className="text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
        </div>
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* 💳 PRICING & TOGGLE */}
      <div className="bg-white p-8 border-b border-slate-100">
        
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-200 shadow-inner">
            <button 
              onClick={() => setBillingCycle("monthly")} 
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")} 
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-500 hover:text-slate-700"}`}
            >
              Yearly <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-black">SAVE ₹400</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pro Pricing</div>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {billingCycle === 'monthly' ? '₹199' : '₹1,999'}
              </span>
              <span className="text-lg text-slate-500 font-bold">
                / {billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-md border border-emerald-100">
                ✨ Recommended: You save ₹400 every year!
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            
            {/* CTA BUTTON WITH LOADING STATE */}
            <button 
              onClick={onSubscribe} 
              disabled={isCurrent || isLoading}
              className={`w-full md:w-auto px-10 py-3.5 rounded-xl font-black text-[15px] shadow-xl transition-all flex items-center justify-center gap-2 ${
                isCurrent 
                ? 'bg-emerald-500 text-white cursor-default shadow-emerald-200' 
                : isLoading
                  ? 'bg-blue-400 text-white cursor-wait opacity-80'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <> <Loader2 size={18} className="animate-spin" /> Processing... </>
              ) : isCurrent ? (
                <> <CheckCircle2 size={18} /> Current Plan Active </>
              ) : (
                <> Upgrade to PRO <Zap size={18} className="fill-white" /> </>
              )}
            </button>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Lock size={12}/> SSL Secured Payment
            </p>
          </div>
        </div>
      </div>

      {/* 📦 FEATURES & INFO */}
      <div className="bg-slate-50 p-8 flex-1 flex flex-col justify-between">
        
        <div>
          {/* CORE SELLING POINT: CLOUD STORAGE */}
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 flex flex-col sm:flex-row items-start gap-4 mb-8 shadow-sm">
            <div className="p-3 rounded-xl bg-white text-indigo-600 shrink-0 shadow-sm border border-indigo-50 mt-0.5">
              <Cloud size={24}/>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-2 text-indigo-900">
                Cloud Storage Backup 
                <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Amazon S3</span>
              </h4>
              <p className="text-xs font-medium opacity-80 mt-1.5 leading-relaxed text-indigo-800">
                All your quotations are auto-saved to our secure cloud. Log in from any device and access your data anytime, anywhere. Safe even if your phone is lost.
              </p>
            </div>
          </div>

          {/* FEATURE LIST GRID */}
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Everything in PRO</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-4">
            {/* Implemented Business Logic Limits */}
            <FeatureItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} text="Unlimited Quotes (500 FUP limit)" />
            <FeatureItem icon={<Palette size={18} className="text-blue-500" />} text="All Premium Design Templates" />
            <FeatureItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} text="Clean Professional PDF (No Watermark)" />
            <FeatureItem icon={<ShieldCheck size={18} className="text-purple-500" />} text="Profile Lock & Custom Branding" />
            <FeatureItem icon={<MonitorSmartphone size={18} className="text-indigo-500" />} text="Multi-Device Login & Sync" />
            <FeatureItem icon={<Zap size={18} className="text-amber-500" />} text="Priority Customer Support" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Feature Item Component
function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3 text-sm font-semibold text-slate-700 leading-snug">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <span>{text}</span>
    </div>
  );
}