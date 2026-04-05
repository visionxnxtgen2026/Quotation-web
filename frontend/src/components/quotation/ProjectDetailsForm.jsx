import React from "react";
import { Building2, Image as ImageIcon, X } from "lucide-react";

export default function ProjectDetailsForm({ formData, handleNestedChange, handleLogoUpload, removeLogo, fileInputRef }) {
  const inputStyle = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";
  const cardStyle = "bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8";
  const headerStyle = "flex items-center gap-3 mb-8 pb-5 border-b border-slate-100";

  return (
    <div className={cardStyle}>
      <div className={headerStyle}>
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Building2 size={22}/></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-none">Project Details</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Client and project information</p>
        </div>
      </div>

      <div className="mb-8">
        <label className={labelStyle}>Company Logo</label>
        <input type="file" accept="image/png, image/jpeg, image/jpg" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} />
        {formData.projectDetails.companyLogo ? (
          <div className="relative w-48 h-24 border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center group">
            <img src={formData.projectDetails.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
            <button onClick={removeLogo} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div onClick={() => fileInputRef.current.click()} className="w-80 border-2 border-dashed border-slate-300 rounded-2xl p-5 flex items-center justify-center gap-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all">
            <ImageIcon size={22} className="text-slate-400 group-hover:text-blue-500"/>
            <span className="text-sm text-slate-500 font-bold">Upload Logo (PNG, JPG)</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div><label className={labelStyle}>Company Name</label><input className={inputStyle} placeholder="Your company name" value={formData.projectDetails.companyName} onChange={(e) => handleNestedChange("projectDetails", "companyName", e.target.value)} /></div>
        <div><label className={labelStyle}>Client Name</label><input className={inputStyle} placeholder="Client name" value={formData.projectDetails.clientName} onChange={(e) => handleNestedChange("projectDetails", "clientName", e.target.value)} /></div>
        <div><label className={labelStyle}>Project Name</label><input className={inputStyle} placeholder="Project name" value={formData.projectDetails.projectName} onChange={(e) => handleNestedChange("projectDetails", "projectName", e.target.value)} /></div>
        <div><label className={labelStyle}>Reference No.</label><input className={inputStyle} placeholder="e.g., PW-2025-001" value={formData.projectDetails.referenceNo} onChange={(e) => handleNestedChange("projectDetails", "referenceNo", e.target.value)} /></div>
        <div><label className={labelStyle}>Date</label><input type="date" className={inputStyle} value={formData.projectDetails.date} onChange={(e) => handleNestedChange("projectDetails", "date", e.target.value)} /></div>
        
        {/* 🔥 DYNAMIC BRAND SPECIFICATION (Select or Type) */}
        <div>
          <label className={labelStyle}>Brand Specification</label>
          <div className="relative">
            <input 
              list="paint-brands" 
              className={inputStyle} 
              placeholder="Select or Type Brand Name"
              value={formData.projectDetails.paintBrand} 
              onChange={(e) => handleNestedChange("projectDetails", "paintBrand", e.target.value)} 
            />
            <datalist id="paint-brands">
              <option value="Nippon Paint" />
              <option value="Asian Paints" />
              <option value="Berger Paints" />
              <option value="Dulux" />
              <option value="JSW Paints" />
              <option value="Indigo Paints" />
              <option value="Dr. Fixit" />
            </datalist>
          </div>
        </div>
        
        {/* 🔥 SUBJECT FIELD */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Subject</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. Paint Quote for Mr.Mani, Zoology Park Road, Salem" 
            value={formData.projectDetails.subject} 
            onChange={(e) => handleNestedChange("projectDetails", "subject", e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}