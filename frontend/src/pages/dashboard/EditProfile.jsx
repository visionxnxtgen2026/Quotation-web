import React, { useState, useEffect } from "react";
import * as api from "../../utils/api"; 

// 🔥 Import our separated components
import AvatarUpload from "../../components/profile/AvatarUpload";
import ProfileForm from "../../components/profile/ProfileForm";

import { 
  Loader2, ArrowLeft, CheckCircle2, AlertCircle 
} from "lucide-react";

// 🔥 Set your backend base URL for images here
const IMG_BASE_URL = "http://localhost:5000/";

export default function EditProfile({
  user,
  setUser, // To update global state in App.jsx
  goBack,  // Received from App.jsx to handle the back button
}) {
  // States for API handling
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 EXPANDED Form State
  const [userForm, setUserForm] = useState({
    name: "",
    mobile: "",
    email: "",
    designation: "", 
    location: "",    
    bio: "",         
    profilePic: null, 
    previewUrl: "",   
  });

  // ✅ 1. LOAD USER DATA INTO FORM (With Image Path Fix)
  useEffect(() => {
    if (user) {
      // Construct full URL if profilePic exists and isn't already a base64 string
      const fullImageUrl = user.profilePic 
        ? (user.profilePic.startsWith('data:') || user.profilePic.startsWith('http') 
            ? user.profilePic 
            : `${IMG_BASE_URL}${user.profilePic}`)
        : "";

      setUserForm({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        designation: user.designation || "",
        location: user.location || "",
        bio: user.bio || "",
        previewUrl: fullImageUrl, 
        profilePic: null,
      });
    }
  }, [user]);

  // ✅ 2. HANDLE TEXT INPUTS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 3. SUBMIT UPDATES TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setIsSaved(false);

    try {
      // Use FormData for sending files + text
      const formData = new FormData();
      formData.append("name", userForm.name);
      formData.append("mobile", userForm.mobile);
      formData.append("designation", userForm.designation); 
      formData.append("location", userForm.location);       
      formData.append("bio", userForm.bio);                 
      
      // Only append if a new file is actually selected
      if (userForm.profilePic) {
        formData.append("profilePic", userForm.profilePic);
      }

      // API Call
      const res = await api.updateProfile(formData);

      if (res.data.success) {
        setIsSaved(true);
        
        // 🔥 CRITICAL: Update global App.jsx state with fresh data from DB
        const updatedUser = res.data.user;
        setUser(updatedUser);
        
        // Sync with LocalStorage so Sidebar/Profile stays updated on refresh
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setErrorMsg(res.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const msg = error.response?.data?.message || "Server connection failed.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100 min-h-screen font-sans selection:bg-blue-200 text-slate-800 flex flex-col">
      
      {/* 🖥 PREMIUM HEADER (Full Width, Glassmorphism) */}
      <div className="flex justify-between items-center px-10 py-6 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your personal information and avatar</p>
        </div>
        <button 
          onClick={goBack} 
          className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-6 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:-translate-y-0.5 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Go Back
        </button>
      </div>

      {/* 🖥 MAIN CONTENT AREA (Centered) */}
      <div className="flex-1 flex justify-center items-start p-10 overflow-y-auto pb-24">
        
        <div className="w-full max-w-4xl animate-fade-in-up">
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="font-black text-slate-800 text-lg tracking-tight">Updating Profile...</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Please wait a moment</p>
              </div>
            )}

            {/* Notifications */}
            {isSaved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-8 animate-fade-in shadow-sm">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                Profile updated successfully! Your changes are now live.
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-8 animate-fade-in shadow-sm">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* FORM COMPONENTS W/ FLEX LAYOUT */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              
              {/* 1. Avatar Upload Component */}
              <AvatarUpload 
                previewUrl={userForm.previewUrl} 
                userName={userForm.name} 
                onFileSelect={(file) => {
                  if (file.size > 2 * 1024 * 1024) {
                    setErrorMsg("Image size must be less than 2MB.");
                    setTimeout(() => setErrorMsg(""), 4000);
                    return;
                  }
                  setErrorMsg("");
                  setUserForm(prev => ({ ...prev, profilePic: file }));
                  
                  // Instant preview using Base64
                  const reader = new FileReader();
                  reader.onloadend = () => setUserForm(prev => ({ ...prev, previewUrl: reader.result }));
                  reader.readAsDataURL(file);
                }} 
              />

              {/* 2. Text Inputs & Submit Component */}
              <ProfileForm 
                userForm={userForm}
                handleInputChange={handleInputChange}
                isLoading={isLoading}
                goToSettings={goBack} 
              />

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}