import React from "react";
import { Briefcase, Building, Landmark, Signature, FileText } from "lucide-react";

export default function CorporateTemplate({ data }) {
  // 🛑 Fallback Data (Updated for multi-section testing)
  const quote = data || {
    companyName: "VisionX Builders",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    sections: [
      {
        title: "Civil Works",
        items: [
          { desc: "Surface Preparation, Wall Putty (3 Coats)", labour: "5.00", material: "3.00", total: "8.00" },
          { desc: "Primer (1 Coat)", labour: "1.00", material: "1.00", total: "2.00" },
        ],
        sectionTotal: "10.00"
      },
      {
        title: "Painting & Finishing",
        items: [
          { desc: "Premium Emulsion Paint (2 Coats)", labour: "8.00", material: "12.00", total: "20.00" }
        ],
        sectionTotal: "20.00"
      }
    ],
    subtotal: "30.00",
    tax: "0.00",
    discount: "0.00",
    grandTotal: "30.00",
    terms: ["Scaffolding must be provided by the client wherever rope scaffolding is not possible.", "Payment should be made 50% in advance."],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Builders" }
  };

  // Helper to safely format numbers
  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Multi-section fallback
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Service Details", items: quote.items || [], sectionTotal: quote.subtotal }];

  return (
    <div className="bg-white p-10 sm:p-14 min-h-[297mm] text-slate-800 font-serif border-[12px] border-slate-50 relative shadow-inner">
      
      {/* 🏛️ HEADER: FORMAL CORPORATE LAYOUT */}
      <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8 print-avoid-break">
        <div className="flex items-center gap-5">
          {quote.companyLogo ? (
            <img src={quote.companyLogo} alt="Logo" className="w-20 h-20 object-contain border-2 border-slate-100 p-1" />
          ) : (
            <div className="w-20 h-20 bg-slate-800 text-white flex items-center justify-center border-4 border-slate-200">
               <Building size={36} strokeWidth={1} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-wide uppercase font-sans">
              {quote.companyName}
            </h1>
            <div className="mt-2 text-sm text-slate-600 font-sans flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Briefcase size={14}/> {quote.companyPhone}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{quote.companyEmail}</span>
            </div>
          </div>
        </div>
        <div className="text-right pb-1">
          <h2 className="text-4xl font-light text-slate-400 tracking-widest uppercase mb-4">Quotation</h2>
          <div className="text-sm font-sans space-y-1 text-slate-600">
            <p><span className="font-semibold text-slate-800 w-20 inline-block text-right pr-3">Date:</span> {quote.date}</p>
            <p><span className="font-semibold text-slate-800 w-20 inline-block text-right pr-3">Quote Ref:</span> {quote.quotationNo}</p>
          </div>
        </div>
      </div>

      {/* 👤 CLIENT DETAILS (Structured Box) */}
      <div className="border border-slate-300 p-6 mb-10 bg-slate-50 relative print-avoid-break">
        <div className="absolute -top-3 left-6 bg-slate-50 px-3 text-xs font-bold text-slate-500 uppercase tracking-widest font-sans flex items-center gap-2">
           <FileText size={14}/> Prepared For
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{quote.clientName}</h3>
        <p className="text-slate-600 font-sans text-sm">{quote.clientAddress}</p>
      </div>

      {/* 📊 ITEMS TABLES (Mapped for multiple sections with Elegant Borders) */}
      <div className="mb-10 space-y-10">
        {sectionsToRender.map((section, secIdx) => (
          <div key={secIdx} className="print-avoid-break">
            
            {/* Elegant Section Title */}
            <h4 className="text-sm font-bold text-slate-900 font-sans uppercase tracking-widest mb-3 flex items-center gap-4">
              {section.title}
              <div className="flex-1 border-b border-slate-200"></div>
            </h4>

            <table className="w-full text-left border-collapse border-y-2 border-slate-800 font-sans">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-widest border-b-2 border-slate-300">
                  <th className="py-4 px-4 font-bold w-12 text-center">No.</th>
                  <th className="py-4 px-4 font-bold">Description of Services</th>
                  <th className="py-4 px-4 font-bold text-center w-24">Labour</th>
                  <th className="py-4 px-4 font-bold text-center w-24">Material</th>
                  <th className="py-4 px-4 font-bold text-right w-32">Total (Rs.)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {section.items && section.items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-center text-slate-400 font-medium">{String(index + 1).padStart(2, '0')}</td>
                    <td className="py-4 px-4 text-slate-800 font-medium whitespace-pre-wrap">{item.desc}</td>
                    <td className="py-4 px-4 text-center text-slate-600">{safeFormat(item.labour)}</td>
                    <td className="py-4 px-4 text-center text-slate-600">{safeFormat(item.material)}</td>
                    <td className="py-4 px-4 font-bold text-slate-900 text-right">{safeFormat(item.total)}</td>
                  </tr>
                ))}
                
                {/* Corporate Subtotal Row */}
                <tr className="bg-slate-50 border-t border-slate-300">
                  <td colSpan="4" className="py-3 px-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest border-r border-slate-200">
                    Category Amount
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 text-right">
                    {safeFormat(section.sectionTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* 💰 CORPORATE BILLING SUMMARY */}
      <div className="flex justify-end mb-12 print-avoid-break">
        <div className="w-full sm:w-80 border border-slate-300 p-6 bg-white font-sans shadow-sm">
          <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">Rs. {safeFormat(quote.subtotal)}</span>
          </div>
          
          {Number(quote.discount) > 0 && (
            <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
              <span>Discount</span>
              <span className="font-semibold text-green-700">- Rs. {safeFormat(quote.discount)}</span>
            </div>
          )}

          {Number(quote.tax) > 0 && (
            <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
              <span>Tax / GST</span>
              <span className="font-semibold text-slate-800">Rs. {safeFormat(quote.tax)}</span>
            </div>
          )}

          <div className="border-t-2 border-slate-800 pt-4 mt-2 flex justify-between items-end">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">Rs. {safeFormat(quote.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* 📜 BOTTOM LAYOUT: TERMS, BANK & SIGNATURE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t-2 border-slate-100 font-sans print-avoid-break">
        
        {/* Left: Terms & Conditions (Col span 7) */}
        <div className="md:col-span-7 pr-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Terms & Conditions</h4>
          <ol className="list-decimal list-outside ml-4 text-sm text-slate-600 space-y-2 leading-relaxed">
            {quote.terms && quote.terms.map((term, i) => (
               <li key={i} className="pl-2">{term}</li>
            ))}
          </ol>
        </div>

        {/* Right: Bank Details & Signature (Col span 5) */}
        <div className="md:col-span-5 space-y-8">
          
          {/* Bank Details Box */}
          <div className="bg-slate-50 border border-slate-200 p-5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-slate-200">
               <Landmark size={14}/> Payment Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank</span>
                <span className="font-semibold text-slate-800">{quote.bankDetails?.bankName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account No.</span>
                <span className="font-semibold text-slate-800">{quote.bankDetails?.accNo || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IFSC</span>
                <span className="font-semibold text-slate-800">{quote.bankDetails?.ifsc || "-"}</span>
              </div>
              {quote.bankDetails?.accHolder && (
                <div className="flex justify-between pt-1 border-t border-slate-200 mt-2">
                  <span className="text-slate-500">Holder Name</span>
                  <span className="font-semibold text-slate-800">{quote.bankDetails.accHolder}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature Line */}
          <div className="pt-10 flex flex-col items-end border-t border-slate-200">
             <div className="w-48 border-b border-slate-400 mb-2"></div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
               <Signature size={14}/> Authorized Signatory
             </p>
          </div>

        </div>
      </div>

    </div>
  );
}