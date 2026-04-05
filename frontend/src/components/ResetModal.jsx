import React from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

export default function ResetModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      
      {/* Modal Box */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up relative border border-slate-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-10 flex flex-col items-center text-center">
          
          {/* Reset Icon with Soft Pulse */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-30 scale-125"></div>
            <div className="relative w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <RotateCcw size={36} strokeWidth={2.5} />
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3">
            Reset All Fields?
          </h3>
          <p className="text-slate-500 font-semibold leading-relaxed text-[15px] px-2">
            This will clear all the information you have entered. This action <span className="text-blue-600">cannot be undone</span>.
          </p>

          {/* Warning Note */}
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle size={14} /> Draft progress will be lost
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full mt-10">
            <button 
              onClick={onClose}
              className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Go Back
            </button>
            
            <button 
              onClick={onConfirm}
              className="py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}