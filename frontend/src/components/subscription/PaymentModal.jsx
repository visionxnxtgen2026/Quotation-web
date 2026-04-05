import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Globe, Loader2 } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, plan, cycle, price, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'failed'

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus(null);
    const token = localStorage.getItem("token");

    try {
      // 🚀 API CALL TO BACKEND
      const res = await axios.post(
        "http://localhost:5000/api/subscription/update",
        { plan: plan.toLowerCase(), cycle: cycle }, // basic / pro
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setPaymentStatus("success");
        // கொஞ்சம் நேரம் கழிச்சு Modal-ஐ க்ளோஸ் பண்ணி Parent-க்கு தகவல் சொல்றோம்
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(plan.toLowerCase()); // Subscription.jsx-க்கு டேட்டா போகும்
        }, 2000);
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Select your preferred payment method</p>
        </div>

        {/* Order Summary */}
        <div className="p-8 pt-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/60">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Plan Details</span>
              <span className="text-xs font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-widest">{plan}</span>
            </div>
            <div className="flex justify-between items-baseline">
               <span className="text-slate-500 font-medium">{cycle === 'yearly' ? 'Yearly Subscription' : 'Monthly Subscription'}</span>
               <span className="text-2xl font-black text-slate-900">{price}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <PaymentOption 
              icon={<Smartphone className="text-purple-600" />} 
              title="UPI (GPay, PhonePe, Paytm)" 
              desc="Instant & Zero Fees"
              selected={selectedMethod === "upi"}
              onClick={() => setSelectedMethod("upi")}
            />
            <PaymentOption 
              icon={<CreditCard className="text-blue-600" />} 
              title="Debit / Credit Card" 
              desc="Visa, Mastercard, RuPay"
              selected={selectedMethod === "card"}
              onClick={() => setSelectedMethod("card")}
            />
            <PaymentOption 
              icon={<Globe className="text-emerald-600" />} 
              title="Netbanking" 
              desc="All Indian Major Banks"
              selected={selectedMethod === "netbanking"}
              onClick={() => setSelectedMethod("netbanking")}
            />
          </div>

          {/* Status Messages */}
          {paymentStatus === "success" && (
            <div className="mt-6 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 size={18} /> Payment Successful! Upgrading...
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
              <X size={18} /> Payment Failed. Please try again.
            </div>
          )}

          {/* Final Action */}
          {!paymentStatus || paymentStatus === "failed" ? (
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full font-black py-4 rounded-2xl mt-8 shadow-xl transition-all flex items-center justify-center gap-2 
                ${isProcessing ? "bg-slate-400 text-white cursor-wait" : "bg-slate-900 hover:bg-black text-white hover:-translate-y-0.5"}`}
            >
              {isProcessing ? (
                <> <Loader2 size={20} className="animate-spin" /> Processing Payment... </>
              ) : (
                <> Pay {price} Now </>
              )}
            </button>
          ) : null}
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <ShieldCheck size={12} /> SSL Secured & Encrypted Payment
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Payment List (Updated to handle selection)
function PaymentOption({ icon, title, desc, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all group 
        ${selected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
    >
      <div className={`p-2.5 rounded-lg shadow-sm border transition-transform 
        ${selected ? 'bg-white border-blue-200 scale-110' : 'bg-white border-slate-100 group-hover:scale-105'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-[11px] font-medium text-slate-500">{desc}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
        ${selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-blue-300'}`}>
        {selected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
    </div>
  );
}