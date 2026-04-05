import React, { useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  FileText,
  Download,
  Printer,
  Share2,
  Mail,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  XCircle
} from "lucide-react";

// 🔥 IMPORT ALL TEMPLATES (Using .jsx extension for Vite stability)
import ClassicTemplate from "../../components/theme/ClassicTemplate.jsx";
import ModernTemplate from "../../components/theme/ModernTemplate.jsx";
import CorporateTemplate from "../../components/theme/CorporateTemplate.jsx";
import CompactTemplate from "../../components/theme/CompactTemplate.jsx";
import CreativeTemplate from "../../components/theme/CreativeTemplate.jsx";
import GroupedTemplate from "../../components/theme/GroupedTemplate.jsx";

export default function Export({
  user, goBack, goToDashboard, goToCreate, goToPreview, goToExport,
  goToSubscription, goToSettings, goToHelp, goToEditProfile, quotationId,
}) {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // Separated Loading States
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false); 
  const [isPreparingWA, setIsPreparingWA] = useState(false); 

  const token = localStorage.getItem("token");
  const selectedTemplate = localStorage.getItem("selectedTemplate") || "classic";
  
  const quotationData = useMemo(() => {
    const draft = localStorage.getItem("previewDraft");
    return draft ? JSON.parse(draft) : null;
  }, []);

  const mappedData = useMemo(() => {
    if (!quotationData) return null;
    const totals = {
      subtotal: quotationData.rateSections?.reduce((acc, sec) => 
        acc + sec.rows.reduce((rAcc, r) => rAcc + (Number(r.total) || 0), 0), 0) || 0,
    };

    const formattedSections = quotationData.rateSections?.map(section => ({
      title: section.title || "Material & Labour Rates",
      items: section.rows?.map(item => ({
        desc: item.work || item.workDescription || item.description || "-",
        labour: Number(item.labour || 0).toFixed(2),
        material: Number(item.material || 0).toFixed(2),
        total: Number(item.total || 0).toFixed(2)
      })) || [],
      sectionTotal: Number(section.rows?.reduce((acc, r) => acc + (Number(r.total) || 0), 0) || 0).toFixed(2)
    })) || [];

    const discountPercent = Number(quotationData.pricing?.discount) || 0;
    const discountAmount = (totals.subtotal * discountPercent) / 100;
    const tax = Number(quotationData.pricing?.tax) || 0;

    return {
      ...quotationData.projectDetails,
      sections: formattedSections,
      subtotal: totals.subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: tax.toFixed(2),
      grandTotal: (totals.subtotal - discountAmount + tax).toFixed(2),
      terms: quotationData.textAreas?.termsConditions?.split('\n').filter(t => t.trim()) || [],
      bankDetails: quotationData.bankDetails,
    };
  }, [quotationData]);

  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handlePrint = () => window.print();

  // 🔗 SHARE LINK
  const copyShareLink = () => {
    if (!quotationId) return showToast("Save quotation first! ❌", "error");
    const link = `${window.location.origin}/preview/public/${quotationId}`;
    navigator.clipboard.writeText(link);
    showToast("🔗 Professional Share Link Copied!", "success");
  };

  // 📄 BULLETPROOF DOWNLOAD LOGIC
  const handleDownloadPDF = async () => {
    if (!quotationId) return showToast("Please save the quotation first! ❌", "error");

    setIsDownloadingPDF(true);
    showToast("Generating Premium PDF... ⏳", "success");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${quotationId}?template=${selectedTemplate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // Expecting binary data
          timeout: 90000 
        }
      );

      // Prevent downloading backend error JSONs as corrupted PDFs
      if (response.data.type === "application/json" || response.data.type === "text/html") {
         const text = await response.data.text();
         try {
             const error = JSON.parse(text);
             throw new Error(error.message || "Server Error");
         } catch (e) {
             throw new Error("Invalid response format from server.");
         }
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation_${mappedData?.clientName?.replace(/\s+/g, '_') || 'File'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);
      
      showToast("✅ Downloaded Successfully!", "success");
    } catch (error) {
      console.error("Download Error:", error);
      showToast(error.message?.includes("Server") ? `❌ ${error.message}` : "❌ Download failed. Check server connection.", "error");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // 📧 EMAIL
  const handleSendEmail = async () => {
    if (!quotationId) return showToast("Save quotation first! ❌", "error");
    const email = window.prompt("Enter client email:");
    if (!email) return;
    setIsSendingEmail(true);
    try {
      await axios.post("http://localhost:5000/api/export/email", 
        { quotationId, email, template: selectedTemplate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("✅ Sent to client's inbox!", "success");
    } catch (e) { showToast("❌ Email failed.", "error"); }
    finally { setIsSendingEmail(false); }
  };

  // 💬 WHATSAPP
  const handleShareActualPDF = async () => {
    if (!quotationId) return showToast("Save first! ❌", "error");
    setIsPreparingWA(true);
    showToast("Preparing WhatsApp file... ⏳", "success");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${quotationId}?template=${selectedTemplate}`,
        { 
          headers: { Authorization: `Bearer ${token}` }, 
          responseType: 'blob',
          timeout: 90000
        }
      );

      // Prevent downloading backend error JSONs as corrupted PDFs
      if (response.data.type === "application/json" || response.data.type === "text/html") {
         const text = await response.data.text();
         try {
             const error = JSON.parse(text);
             throw new Error(error.message || "Server Error");
         } catch (e) {
             throw new Error("Invalid response format from server.");
         }
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation_${mappedData?.clientName?.replace(/\s+/g, '_') || 'File'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      const waText = encodeURIComponent(`Hello! Please find the quotation attached below.`);
      window.open(`https://wa.me/?text=${waText}`, "_blank");
      showToast("✅ File ready! Now attach it in WhatsApp.", "success");
    } catch (error) { 
      console.error("WhatsApp prep error:", error);
      showToast(error.message?.includes("Server") ? `❌ ${error.message}` : "❌ WhatsApp prep failed.", "error"); 
    }
    finally { setIsPreparingWA(false); }
  };

  const RenderSelectedTemplate = () => {
    if (!mappedData) return null;
    const props = { data: mappedData };
    switch(selectedTemplate) {
      case "modern": return <ModernTemplate {...props} />;
      case "corporate": return <CorporateTemplate {...props} />;
      case "compact": return <CompactTemplate {...props} />;
      case "creative": return <CreativeTemplate {...props} />;
      case "grouped": return <GroupedTemplate {...props} />;
      default: return <ClassicTemplate {...props} />;
    }
  };

  return (
    <>
      <div className="hidden print:block w-full bg-white absolute top-0 left-0 z-[9999]">
         <RenderSelectedTemplate />
      </div>

      <div className="print:hidden bg-[#f8fafc] min-h-screen flex text-slate-800 font-sans">
        <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-sm">
          <Sidebar active="export" user={user} goToDashboard={goToDashboard} goToCreate={goToCreate} goToPreview={goToPreview} goToExport={goToExport} goToSubscription={goToSubscription} goToSettings={goToSettings} goToHelp={goToHelp} goToEditProfile={goToEditProfile} />
        </div>

        <div className="ml-[250px] w-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-10 py-6 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200/60 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Export Quotation</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Download or share your quotation directly.</p>
            </div>
            <button onClick={goBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all">
              <ArrowLeft size={16} /> Back to Preview
            </button>
          </div>

          <div className="p-10 space-y-8 max-w-4xl mx-auto w-full">
            {/* Status Card */}
            <div className={`p-8 rounded-[2rem] border flex items-center justify-between shadow-sm ${quotationId ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${quotationId ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {quotationId ? <FileCheck size={32} /> : <AlertCircle size={32} />}
                </div>
                <div>
                  <h2 className="font-black text-xl text-slate-900">{quotationId ? "Quotation is Ready!" : "Unsaved Draft"}</h2>
                  <p className="text-sm font-bold opacity-70 mt-0.5">{quotationId ? "Your quote is synced to VisionX Cloud." : "Save your quote first to enable all sharing features."}</p>
                </div>
              </div>
              <button onClick={goToPreview} className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">View Document</button>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-4">
               <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Available Actions</h2>
               
               <ActionCard 
                 icon={<Download size={24} />} 
                 title="Download PDF" 
                 desc="Save high-quality PDF to your local device" 
                 onClick={handleDownloadPDF} 
                 isLoading={isDownloadingPDF} 
                 disabled={isDownloadingPDF || isPreparingWA || isSendingEmail} 
               />

               <ActionCard 
                 icon={<Printer size={24} />} 
                 title="Print Document" 
                 desc="Send directly to your local printer" 
                 onClick={handlePrint} 
               />

               <ActionCard 
                 icon={<MessageCircle size={24} />} 
                 title="Send to WhatsApp" 
                 desc="Attach and share the PDF on WhatsApp" 
                 onClick={handleShareActualPDF} 
                 isLoading={isPreparingWA}
                 disabled={!quotationId || isDownloadingPDF || isPreparingWA || isSendingEmail} 
               />

               <ActionCard 
                 icon={<Mail size={24} />} 
                 title="Email to Client" 
                 desc="Directly send as attachment via Email" 
                 onClick={handleSendEmail} 
                 isLoading={isSendingEmail}
                 disabled={!quotationId || isDownloadingPDF || isPreparingWA || isSendingEmail} 
               />

               <ActionCard 
                 icon={<Share2 size={24} />} 
                 title="Copy Share Link" 
                 desc="Professional web link for client review" 
                 onClick={copyShareLink} 
                 disabled={!quotationId} 
               />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-700' : 'bg-white border-red-100 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
          <span className="font-black text-sm uppercase tracking-wide">{toast.message}</span>
        </div>
      )}
    </>
  );
}

// Reusable Action Card
function ActionCard({ icon, title, desc, onClick, isLoading, disabled }) {
  return (
    <div 
      onClick={disabled ? null : onClick} 
      className={`bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between transition-all duration-300 group ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 active:scale-[0.98]'}`}
    >
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isLoading ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
          {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : icon}
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg tracking-tight uppercase">{title}</h3>
          <p className="text-sm font-bold text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
        <ArrowLeft className="rotate-180 text-blue-600" size={20} />
      </div>
    </div>
  );
}