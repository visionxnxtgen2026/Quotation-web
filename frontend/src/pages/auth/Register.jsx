import React, { useState, useEffect } from "react";
import illustration from "../../assets/register.png";

export default function Register({ goToLogin }) {
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false); // New state for resend loading
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Resend Timer State
  const [timer, setTimer] = useState(0);

  // Form Step: 1 = Details, 2 = OTP Verification
  const [step, setStep] = useState(1); 

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    otp: "", 
    terms: false,
  });

  // Timer logic for Resend Button
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- NEW: HANDLE RESEND OTP ---
  const handleResend = async () => {
    if (timer > 0) return; // Prevent clicking if timer is active

    setIsResending(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "New OTP sent to your email! 📩" });
        setTimer(60); // Start 60-second cooldown
      } else {
        setMessage({ type: "error", text: data.message || "Failed to resend OTP." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Try again later." });
    } finally {
      setIsResending(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (step === 1) {
      if (!formData.terms) {
        setMessage({ type: "error", text: "Please agree to the Terms and Privacy Policy." });
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        
        if (res.ok) {
          setMessage({ type: "success", text: "OTP has been sent to your email!" });
          setStep(2); 
          setTimer(60); // Start timer on first entry to Step 2
        } else {
          setMessage({ type: "error", text: data.message || "Registration failed." });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Server connection failed." });
      } finally {
        setIsLoading(false);
      }
    } 
    
    else if (step === 2) {
      if (!formData.otp || formData.otp.length < 4) {
        setMessage({ type: "error", text: "Please enter a valid OTP." });
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        });

        const data = await res.json();
        
        if (res.ok) {
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          setMessage({ type: "success", text: "Account verified! Redirecting..." });
          setTimeout(() => { goToLogin(); }, 1500);
        } else {
          setMessage({ type: "error", text: data.message || "Invalid OTP." });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Verification failed." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-gray-800 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 py-12 bg-white relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.04)] rounded-r-3xl lg:rounded-r-[40px]">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 group cursor-pointer w-fit">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">QuoteGen Pro</h2>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {step === 1 ? "Create an account" : "Verify your email"}
            </h1>
            <p className="text-gray-500 text-base">
              {step === 1 ? "Start generating professional quotations in seconds." : `We've sent a secure code to ${formData.email}.`}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                  <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="9876543210" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="flex items-start mt-4">
                  <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer mt-1" />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">I agree to the <span className="text-indigo-600 font-semibold cursor-pointer">Terms & Privacy Policy</span>.</label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">Enter Verification Code</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    maxLength="6"
                    placeholder="0 0 0 0 0 0"
                    className="block w-full py-4 text-center text-2xl tracking-[0.5em] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Back to edit
                  </button>
                  
                  {/* RESEND BUTTON WITH TIMER */}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0 || isResending}
                    className={`text-sm font-bold transition-colors ${timer > 0 || isResending ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800 underline'}`}
                  >
                    {isResending ? "Sending..." : timer > 0 ? `Resend Code (${timer}s)` : "Resend Code"}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 mt-6 flex justify-center items-center">
              {isLoading ? "Please wait..." : step === 1 ? "Create Account" : "Verify & Login"}
            </button>
          </form>

          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">Already have an account? <button type="button" onClick={goToLogin} className="font-bold text-indigo-600 hover:underline">Sign in</button></p>
            </div>
          )}
        </div>
      </div>
      
      {/* Visual Section */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#F8FAFC]">
        <div className="relative z-10 flex flex-col items-center max-w-lg px-8">
          <img src={illustration} alt="Illustration" className="w-full drop-shadow-2xl" />
          <div className="mt-12 text-center bg-white/90 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-xl border border-white/60">
            <h3 className="text-xl font-bold text-gray-800">{step === 1 ? "Streamline your workflow" : "Secure your account"}</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">Join thousands of professionals generating smart quotes instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
