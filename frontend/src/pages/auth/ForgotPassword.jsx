import React, { useState } from "react";
import axios from "axios";
import { Mail, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Sparkles } from "lucide-react";

export default function ForgotPassword({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSendLink = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      if (response.data.success) {
        // 🔥 Alert-ஐ தூக்கிவிட்டோம்! அதற்குப் பதிலாக அழகான Inline Success Message
        setStatus({ 
          type: "success", 
          message: "We've sent a secure recovery link to your inbox." 
        });
        
        // 3 செகண்ட் கழித்து ஆட்டோமேட்டிக்காக லாகின் பேஜுக்கு செல்லும்
        setTimeout(() => {
          goToLogin();
        }, 3000);
      }
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Something went wrong! Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 selection:bg-blue-100">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex max-w-[1000px] w-full overflow-hidden border border-slate-100 relative">
        
        {/* =========================================
            LEFT SIDE: FORM SECTION
            ========================================= */}
        <div className="w-full md:w-1/2 p-8 md:p-14 relative z-10 bg-white">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              Vision<span className="text-blue-600">X</span>
            </span>
          </div>

          <h2 className="text-[28px] font-black text-slate-900 mb-2.5 tracking-tight">Forgot Password?</h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            No worries! Enter your registered email address and we'll send you a secure link to reset your password.
          </p>

          {/* 🔥 CUSTOM SUCCESS / ERROR MESSAGES (No more ugly alerts!) */}
          {status.type === 'success' && (
            <div className="p-4 rounded-2xl mb-6 border bg-emerald-50 border-emerald-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800">Check your inbox!</h4>
                <p className="text-xs font-medium text-emerald-600 mt-1">{status.message}</p>
                <p className="text-[11px] font-bold text-emerald-500 mt-3 flex items-center gap-1">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                  Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-2xl mb-6 border bg-red-50 border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm font-bold text-red-700">{status.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendLink} className="space-y-6">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status.type === 'success'}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 disabled:opacity-50"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || status.type === 'success'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <button 
            onClick={goToLogin}
            disabled={loading}
            className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm w-full hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>

        {/* =========================================
            RIGHT SIDE: MODERN ILLUSTRATION
            ========================================= */}
        <div className="hidden md:flex w-1/2 bg-[#f8fafc] items-center justify-center p-12 relative overflow-hidden">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 w-full max-w-sm">
            {/* Floating Icon Card */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 mx-auto w-fit flex flex-col items-center justify-center relative">
              <div className="absolute -top-3 -right-3 bg-yellow-100 text-yellow-600 p-2 rounded-full shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="bg-blue-50 p-5 rounded-2xl">
                <KeyRound className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Account Recovery</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Get back into your VisionX dashboard quickly and securely. Your data is always protected with enterprise-grade encryption.
              </p>
            </div>

            {/* Subtle Security Badge */}
            <div className="mt-10 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} /> 256-bit Secure
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}