import React, { useState } from "react";
import { 
  Crown, CheckCircle2, ChevronRight, 
  Smartphone, Lock, Loader2, Info, Sparkles, Zap, AlertTriangle, FileCheck, Layers
} from "lucide-react";

export default function BasicPlanCard({ 
  onSubscribe,     // API function to trigger checkout
  billingCycle,    // State for 'monthly' or 'yearly'
  setBillingCycle, // Function to update billing cycle
  isCurrent,       // Boolean to check if active
  isLoading        // Boolean for API loading state
}) {
  // State for Local Storage Policy Consent
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div className="rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-200/80 bg-white flex flex-col h-full font-sans transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:border-blue-300 relative group">
      
      {/* 🚀 HEADER: PREMIUM LAUNCH BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 text-white relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-white/20 shadow-sm text-blue-200">
              <Layers size={12} className="text-blue-400" /> 6 Templates Included
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase drop-shadow-md">Standard Plan</h2>
            <p className="text-slate-400 font-bold mt-1.5 text-sm opacity-90 italic">Professionalism, simplified.</p>
          </div>
          <div className="bg-gradient-to-b from-white/20 to-white/5 p-3.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Crown size={28} className="text-amber-400 drop-shadow-md fill-amber-400/20" />
          </div>
        </div>

        {/* ⏱️ LAUNCH OFFER BOX */}
        <div className="mt-8 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner relative overflow-hidden group/offer">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover/offer:animate-shine"></div>
          
          <div className="flex justify-between text-[10px] font-black text-indigo-300 tracking-widest uppercase mb-2.5">
            <span>Special Launch Offer</span>
            <span>May 3 — June 3</span>
          </div>
          <p className="text-xs font-bold text-white flex items-start gap-2 leading-relaxed">
            <Zap size={16} className="text-amber-400 shrink-0 mt-0.5 fill-amber-400 animate-pulse" /> 
            <span>
                <span className="text-amber-400 font-black">Limited Deal:</span> 1 Month FREE + Next 6 Months for just 
                <span className="text-2xl font-black text-white ml-2">₹100</span>
            </span>
          </p>
        </div>
      </div>

      {/* 💳 PRICING & CONSENT */}
      <div className="bg-white p-8 border-b border-slate-100 relative">
        
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-inner">
            <button onClick={() => setBillingCycle("monthly")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400"}`}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle("yearly")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly" ? "bg-indigo-600 text-white shadow-lg scale-105" : "text-slate-400"}`}>
              Yearly <span className="bg-black/20 text-[9px] px-2 py-0.5 rounded-full font-black">Save 16%</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Regular Rate</div>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">{billingCycle === 'monthly' ? '₹99' : '₹999'}</span>
              <span className="text-slate-400 font-bold">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            {/* 🛡️ LOCAL STORAGE CONSENT CHECKBOX */}
            <label className="flex items-center gap-2 cursor-pointer group/check mb-1">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover/check:text-slate-600 transition-colors">
                    I accept Local Storage Policy
                </span>
            </label>

            <button 
              onClick={onSubscribe} 
              disabled={isCurrent || isLoading || !hasAgreed}
              className={`relative overflow-hidden w-full md:w-auto px-10 py-4 rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-2 group/btn
                ${isCurrent 
                  ? 'bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-100' 
                  : isLoading 
                    ? 'bg-blue-400 text-white cursor-wait' 
                    : !hasAgreed
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl hover:-translate-y-0.5 active:scale-95'}`}
            >
              {isLoading ? (
                <> <Loader2 size={18} className="animate-spin" /> Processing... </>
              ) : isCurrent ? (
                <> <CheckCircle2 size={18} /> Active Plan </>
              ) : (
                <> Subscribe Standard <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /> </>
              )}
            </button>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Lock size={10} className="text-slate-300"/> ₹5 Verification Required
            </p>
          </div>
        </div>
      </div>

      {/* 📦 FEATURES SECTION */}
      <div className="bg-slate-50/50 p-8 flex-1 flex flex-col justify-between relative">
        <div className="relative z-10">
          {/* DATA POLICY WARNING CARD */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-start gap-4 mb-8 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 shrink-0">
              <AlertTriangle size={20} strokeWidth={3} />
            </div>
            <div>
              <h4 className="font-black text-[13px] text-amber-900 uppercase tracking-tight">Data Policy</h4>
              <p className="text-[11px] font-bold text-amber-700/80 leading-relaxed mt-1">
                Data is saved <span className="underline decoration-2">only on this device</span>. No cloud backup. Downloaded PDFs are permanent.
              </p>
            </div>
          </div>

          {/* FEATURE LIST */}
          <div className="grid grid-cols-1 gap-y-4 mb-10">
            <FeatureItem text="10 Quotations per day limit" />
            <FeatureItem text="6 Professional Basic Templates" />
            <FeatureItem text="Unlimited PDF Downloads" icon={<FileCheck size={14}/>} />
            <FeatureItem text="VisionX Standard Watermark" />
            <FeatureItem text="Single Device Access" />
          </div>
        </div>

        {/* OFFER TIMELINE */}
        <div className="relative z-10 pt-6 border-t border-slate-200/60">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Info size={12}/> Roadmap
          </h4>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-slate-200"></div>
            <OfferStep step="1" title="Trial" text="1 Month Full Free Trial." active />
            <OfferStep step="2" title="Offer" text="Next 6 Months at ₹100." active />
            <OfferStep step="3" title="Auto" text="Regular monthly billing starts." />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine { 100% { left: 200%; } }
        .animate-shine { animation: shine 1.6s ease-in-out infinite; }
      `}} />
    </div>
  );
}

function FeatureItem({ text, icon }) {
  return (
    <div className="flex items-start gap-3 text-sm font-bold text-slate-700">
      <div className="bg-emerald-100 p-0.5 rounded-full border border-emerald-200">
        {icon ? React.cloneElement(icon, {className: "text-emerald-600"}) : <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={3} />}
      </div>
      <span className="pt-0.5">{text}</span>
    </div>
  );
}

function OfferStep({ step, title, text, active = false }) {
  return (
    <div className="flex items-start gap-4 relative z-10">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm border ${active ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white text-slate-400 border-slate-200'}`}>
        {step}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{title}</p>
        <p className={`text-[11px] font-bold ${active ? 'text-slate-700' : 'text-slate-400'}`}>{text}</p>
      </div>
    </div>
  );
}