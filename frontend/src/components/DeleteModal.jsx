import React from "react";
import { Trash2, AlertCircle, X, Loader2 } from "lucide-react";

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  quoteName = "this quotation", // Default text if a specific name is not passed
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up relative">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-10 flex flex-col items-center text-center">
          
          {/* Danger Icon with Animated Pulse Background */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20 scale-150"></div>
            <div className="relative w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Trash2 size={36} strokeWidth={2.5} />
            </div>
          </div>

          {/* Text Content Area */}
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3">
            Confirm Deletion
          </h3>
          <p className="text-slate-500 font-semibold leading-relaxed text-[15px] px-2">
            Are you sure you want to delete <span className="text-slate-900 font-black">"{quoteName}"</span>? This action is permanent and cannot be undone.
          </p>

          {/* Warning Badge */}
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-[11px] font-black uppercase tracking-widest">
            <AlertCircle size={14} /> Data will be removed forever
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mt-10">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="py-4 rounded-2xl bg-red-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <> <Loader2 size={18} className="animate-spin" /> Deleting... </>
              ) : (
                <> Delete Now </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}