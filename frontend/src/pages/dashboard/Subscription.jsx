import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; 
import { Crown, Star, CheckCircle2, AlertCircle, Lock } from "lucide-react";

// 🔥 IMPORT SUBSCRIPTION COMPONENTS
import BasicPlanCard from "../../components/subscription/BasicPlanCard";
import ProPlanCard from "../../components/subscription/ProPlanCard";
import PaymentModal from "../../components/subscription/PaymentModal";

export default function Subscription({ 
  user, 
  goToDashboard, 
  goToCreate, 
  goToPreview, 
  goToExport, 
  goToSubscription, 
  goToEditProfile,
  goToSettings, // 🔥 NEW: Added from App.jsx
  goToHelp      // 🔥 NEW: Added from App.jsx
}) {
  // UI States
  const [activeTab, setActiveTab] = useState("basic"); // 'basic' or 'pro'
  const [billingCycle, setBillingCycle] = useState("yearly"); // 'monthly' or 'yearly'
  
  // Data States
  const [currentPlan, setCurrentPlan] = useState("none"); // From DB
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const token = localStorage.getItem("token");

  // Pricing Matrix
  const pricing = {
    basic: { monthly: "₹99", yearly: "₹999" },
    pro: { monthly: "₹199", yearly: "₹1,999" }
  };

  // ==============================
  // 🔔 TOAST HELPER
  // ==============================
  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // ==============================
  // 🔄 FETCH CURRENT PLAN ON LOAD
  // ==============================
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.plan) {
          const userPlan = res.data.plan.toLowerCase();
          setCurrentPlan(userPlan);
          if (userPlan === "pro") setActiveTab("pro");
        }
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };
    if (token) fetchCurrentPlan();
  }, [token]);

  // ==============================
  // 🚀 HANDLE SUBSCRIBE
  // ==============================
  const handleOpenPayment = (planType) => {
    if (currentPlan === planType) {
      return showToast(`You are already subscribed to the ${planType.toUpperCase()} plan!`, "success");
    }

    setSelectedPlanData({
      name: planType.toUpperCase(),
      cycle: billingCycle,
      price: pricing[planType][billingCycle]
    });
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (newPlan) => {
    setCurrentPlan(newPlan);
    if (newPlan === "pro") setActiveTab("pro");
    showToast(`✅ Success! Your plan is now ${newPlan.toUpperCase()}.`, "success");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-gray-800">
      
      {/* 🔔 TOAST COMPONENT */}
      {toast.show && (
        <div className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-fade-in ${toast.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* 🧭 SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar 
          active="subscription" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={goToCreate} 
          goToPreview={goToPreview} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription} 
          goToSettings={goToSettings} // 🔥 இப்போ இது வேலை செய்யும்
          goToHelp={goToHelp}         // 🔥 இப்போ இது வேலை செய்யும்
          goToEditProfile={goToEditProfile}
        />
      </div>

      {/* 💻 MAIN AREA */}
      <div className="ml-[250px] min-h-screen flex flex-col relative pb-20">
        
        {/* TOP BAR / HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Billing & Plans</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Select the best plan for your business needs.</p>
          </div>
          
          {currentPlan !== "none" && (
            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
               <span className="text-xs font-black uppercase tracking-widest">Active: {currentPlan} Plan</span>
            </div>
          )}
        </div>

        {/* 📑 PLAN SWITCHER */}
        <div className="flex justify-center mt-12 px-10">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex w-full max-w-lg">
            <button 
              onClick={() => setActiveTab("basic")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black transition-all duration-300 ${activeTab === "basic" ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <Crown size={20} /> BASIC
            </button>
            <button 
              onClick={() => setActiveTab("pro")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black transition-all duration-300 ${activeTab === "pro" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <Star size={20} /> PRO
            </button>
          </div>
        </div>

        {/* 🃏 PLAN CARDS SECTION */}
        <div className="p-10 max-w-4xl mx-auto w-full pt-8 animate-fade-in">
          {activeTab === "basic" ? (
            <BasicPlanCard 
              billingCycle={billingCycle}
              setBillingCycle={setBillingCycle}
              onSubscribe={() => handleOpenPayment("basic")} 
              isCurrent={currentPlan === "basic"}
            />
          ) : (
            <ProPlanCard 
              billingCycle={billingCycle}
              setBillingCycle={setBillingCycle}
              onSubscribe={() => handleOpenPayment("pro")} 
              isCurrent={currentPlan === "pro"}
            />
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-auto px-10 py-6 text-center">
           <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white w-fit mx-auto px-6 py-2 rounded-full border border-gray-100 shadow-sm">
             <Lock size={12} /> PCI-DSS Compliant • 256-bit Encryption • Secure Checkout
           </div>
        </div>

      </div>

      {/* 💳 CHECKOUT MODAL */}
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlanData?.name}
        cycle={selectedPlanData?.cycle}
        price={selectedPlanData?.price}
        onSuccess={handlePaymentSuccess} 
      />
      
    </div>
  );
}