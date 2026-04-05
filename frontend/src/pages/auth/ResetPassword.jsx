import React, { useState } from "react";
import axios from "axios";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResetPassword({ token, goToLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match! ❌" });
      return;
    }
    
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters. 🔒" });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Backend-க்கு Token மற்றும் புது Password-ஐ அனுப்புகிறோம்
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: newPassword
      });

      if (response.data.success) {
        setStatus({ type: "success", message: "Password updated successfully! Redirecting... ✅" });
        setTimeout(() => goToLogin(), 2000);
      }
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Invalid or expired link. Please try again! ❌" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-[1000px] w-full overflow-hidden border border-slate-100">
        
        {/* =========================================
            LEFT SIDE: RESET FORM
            ========================================= */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              Vision<span className="text-blue-600">X</span>
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">Set New Password</h2>
          <p className="text-slate-500 text-sm font-medium mb-8">
            Your identity is verified. Please enter a new secure password for your account.
          </p>

          {status.message && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <button 
            onClick={goToLogin} 
            className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm w-full hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>

        {/* =========================================
            RIGHT SIDE: ILLUSTRATION & INFO (Matching your Original Design)
            ========================================= */}
        <div className="hidden md:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
          {/* Subtle Background Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl rounded-full"></div>

          <div className="relative z-10 w-full max-w-sm">
            {/* Top Image Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 mb-6 aspect-video flex items-center justify-center overflow-hidden">
               {/* 🖼️ Note: உங்களின் ஒரிஜினல் இமேஜ்-ஐ இங்கே சேர்க்கவும்! */}
               {/* <img src="/your-invoice-illustration.png" alt="Reset Security" className="w-full h-full object-contain" /> */}
               
               {/* Image இல்லையென்றால் இந்த Icon காண்பிக்கப்படும் */}
               <div className="flex flex-col items-center justify-center text-blue-500">
                 <Lock className="w-20 h-20 mb-3 opacity-80" />
                 <span className="font-bold text-slate-400 text-sm tracking-widest uppercase">Secured</span>
               </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 text-center">
              <h3 className="text-[17px] font-bold text-slate-800 mb-2">Secure Account Recovery</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Verify your identity and regain access to your dashboard.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}