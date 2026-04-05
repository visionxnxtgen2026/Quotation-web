import React from "react";
import { Tag, CalendarClock, PenTool, CreditCard, Landmark, FileText, XCircle } from "lucide-react";

export default function TermsPaymentForm({ formData, handleNestedChange, setFormData }) {
  const inputStyle = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";
  const cardStyle = "bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8";
  const headerStyle = "flex items-center gap-3 mb-8 pb-5 border-b border-slate-100";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className={cardStyle + " mb-0"}>
          <div className={headerStyle}>
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600"><Tag size={22}/></div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">Pricing & Warranty</h2>
          </div>
          <div className="space-y-6">
            <div><label className={labelStyle}>Discount (%)</label><input type="number" className={inputStyle} value={formData.pricing.discount} onChange={(e) => handleNestedChange("pricing", "discount", e.target.value)} /></div>
            <div><label className={labelStyle}>Warranty (Years)</label><input type="text" className={inputStyle} value={formData.pricing.warranty} onChange={(e) => handleNestedChange("pricing", "warranty", e.target.value)} /></div>
          </div>
        </div>
        
        <div className={cardStyle + " mb-0"}>
          <div className={headerStyle}>
            <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600"><CalendarClock size={22}/></div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">Timeline</h2>
          </div>
          <div className="space-y-6">
            <div><label className={labelStyle}>Start Date</label><input type="date" className={inputStyle} value={formData.timeline.startDate} onChange={(e) => handleNestedChange("timeline", "startDate", e.target.value)} /></div>
            <div><label className={labelStyle}>Completion Date</label><input type="date" className={inputStyle} value={formData.timeline.endDate} onChange={(e) => handleNestedChange("timeline", "endDate", e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="space-y-8 mb-8">
        {[
          { id: "scopeOfWork", title: "Scope of Work", icon: <FileText size={22}/>, color: "bg-blue-50 text-blue-600" },
          { id: "exclusions", title: "Exclusions", icon: <XCircle size={22}/>, color: "bg-red-50 text-red-600" },
          { id: "termsConditions", title: "Terms & Conditions", icon: <PenTool size={22}/>, color: "bg-fuchsia-50 text-fuchsia-600" },
        ].map((item) => (
          <div key={item.id} className={cardStyle + " mb-0"}>
            <div className={headerStyle}>
              <div className={`p-2.5 rounded-xl ${item.color}`}>{item.icon}</div>
              <h2 className="text-xl font-bold text-slate-900 leading-none">{item.title}</h2>
            </div>
            <textarea rows={4} className={`${inputStyle} resize-y text-slate-700`} value={formData.textAreas[item.id]} onChange={(e) => handleNestedChange("textAreas", item.id, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className={cardStyle + " mb-0"}>
          <div className={headerStyle}>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><CreditCard size={22}/></div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">Payment Terms</h2>
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <input className={inputStyle} value={formData.paymentTerms[`step${i}`]} onChange={(e) => handleNestedChange("paymentTerms", `step${i}`, e.target.value)} />
                <div className="relative w-28 shrink-0">
                  <input type="number" className={inputStyle + " pr-8 text-center font-bold text-blue-600"} value={formData.paymentPercents[`p${i}`]} onChange={(e) => handleNestedChange("paymentPercents", `p${i}`, e.target.value)} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardStyle + " mb-0"}>
          <div className={headerStyle}>
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Landmark size={22}/></div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">Bank Details</h2>
          </div>
          <div className="space-y-4">
            <input className={inputStyle} placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={(e) => handleNestedChange("bankDetails", "bankName", e.target.value)} />
            <input className={inputStyle} placeholder="Account Holder Name" value={formData.bankDetails.accountHolder} onChange={(e) => handleNestedChange("bankDetails", "accountHolder", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input className={inputStyle} placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={(e) => handleNestedChange("bankDetails", "accountNumber", e.target.value)} />
              <input className={inputStyle} placeholder="IFSC Code" value={formData.bankDetails.ifscCode} onChange={(e) => handleNestedChange("bankDetails", "ifscCode", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className={cardStyle}>
        <div className={headerStyle}>
          <div className="p-2.5 bg-violet-50 rounded-xl text-violet-600"><PenTool size={22}/></div>
          <h2 className="text-xl font-bold text-slate-900 leading-none">Signature & Validity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className={labelStyle}>Authorized Signatory</label>
            <input className={inputStyle} placeholder="Name" value={formData.signature.name} onChange={(e) => handleNestedChange("signature", "name", e.target.value)} />
            <input className={inputStyle} placeholder="Designation" value={formData.signature.designation} onChange={(e) => handleNestedChange("signature", "designation", e.target.value)} />
          </div>
          <div className="space-y-4">
            <label className={labelStyle}>Contact Info</label>
            <input className={inputStyle} placeholder="Phone" value={formData.signature.phone} onChange={(e) => handleNestedChange("signature", "phone", e.target.value)} />
            <input className={inputStyle} placeholder="Email" value={formData.signature.email} onChange={(e) => handleNestedChange("signature", "email", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Validity Clause</label>
            <textarea rows={2} className={`${inputStyle} resize-none`} value={formData.validity} onChange={(e) => setFormData(prev => ({ ...prev, validity: e.target.value }))} />
          </div>
        </div>
      </div>
    </>
  );
}