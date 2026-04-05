import React from "react";
import { Receipt, Landmark } from "lucide-react";

export default function CompactTemplate({ data }) {
  // 🛑 Fallback Data (Updated to include multiple sections for testing)
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
        title: "Interior Works",
        items: [
          { desc: "Surface Preparation, Wall Putty (3 Coats)", labour: "5.00", material: "3.00", total: "8.00" },
          { desc: "Primer (1 Coat)", labour: "1.00", material: "1.00", total: "2.00" },
        ],
        sectionTotal: "10.00"
      },
      {
        title: "Exterior Works",
        items: [
          { desc: "Premium Emulsion Paint (2 Coats)", labour: "8.00", material: "12.00", total: "20.00" },
          { desc: "Texture Painting", labour: "15.00", material: "25.00", total: "40.00" }
        ],
        sectionTotal: "60.00"
      }
    ],
    subtotal: "70.00",
    tax: "3.50",
    discount: "0.00",
    grandTotal: "73.50",
    terms: ["Scaffolding must be provided by the client wherever rope scaffolding is not possible.", "Payment should be made 50% in advance."],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Builders" }
  };

  // Safe check if sections exist, otherwise fallback to old items structure
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Material & Labour Rates", items: quote.items || [], sectionTotal: quote.subtotal }];

  // Helper to safely format numbers, regardless of if they come as string or number
  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div className="bg-white p-6 sm:p-8 min-h-[297mm] text-gray-900 font-sans border-t-8 border-emerald-600">
      
      {/* 🏢 HEADER: COMPACT GRID */}
      <div className="grid grid-cols-2 gap-4 border-b-2 border-emerald-600 pb-4 mb-4 print-avoid-break">
        
        {/* Left: Company Details */}
        <div className="flex items-center gap-3">
          {quote.companyLogo && (
            <img src={quote.companyLogo} alt="Logo" className="w-12 h-12 object-contain shrink-0" />
          )}
          <div>
            <h1 className="text-2xl font-black text-emerald-800 tracking-tight uppercase mb-1">
              {quote.companyName}
            </h1>
            <div className="text-xs text-gray-600 font-medium">
              <p>Phone: {quote.companyPhone}</p>
              <p>Email: {quote.companyEmail}</p>
            </div>
          </div>
        </div>

        {/* Right: Quotation Specs */}
        <div className="text-right">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest flex items-center justify-end gap-2">
            <Receipt size={24} className="text-emerald-600" /> QUOTATION
          </h2>
          <table className="ml-auto mt-2 text-xs">
            <tbody>
              <tr>
                <td className="font-bold text-gray-500 uppercase pr-4 text-right">Quote No:</td>
                <td className="font-bold text-gray-900">{quote.quotationNo}</td>
              </tr>
              <tr>
                <td className="font-bold text-gray-500 uppercase pr-4 text-right">Date:</td>
                <td className="font-bold text-gray-900">{quote.date}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 👤 CLIENT DETAILS (Very Compact) */}
      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-6 flex justify-between items-center print-avoid-break">
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Bill To:</p>
          <h3 className="text-sm font-bold text-gray-900">{quote.clientName}</h3>
          <p className="text-xs text-gray-600">{quote.clientAddress}</p>
        </div>
      </div>

      {/* 📊 ITEMS TABLE (High Density & Multi-Section Support) */}
      <div className="mb-6 space-y-6">
        {sectionsToRender.map((section, secIdx) => (
          <div key={secIdx} className="print-avoid-break">
            
            {/* Section Title */}
            <h4 className="text-xs font-bold text-gray-800 uppercase bg-gray-100 border border-gray-300 border-b-0 px-3 py-1.5 rounded-t-md">
              {section.title}
            </h4>
            
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-emerald-600 text-white text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3 border border-emerald-700 font-bold w-10 text-center">#</th>
                  <th className="py-2 px-3 border border-emerald-700 font-bold">Description of Work</th>
                  <th className="py-2 px-3 border border-emerald-700 font-bold text-center w-20">Labour</th>
                  <th className="py-2 px-3 border border-emerald-700 font-bold text-center w-20">Material</th>
                  <th className="py-2 px-3 border border-emerald-700 font-bold text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {section.items && section.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 even:bg-gray-50 text-xs">
                    <td className="py-2 px-3 border-r border-gray-300 text-center text-gray-500 font-semibold">{index + 1}</td>
                    <td className="py-2 px-3 border-r border-gray-300 font-semibold text-gray-800 whitespace-pre-wrap">{item.desc}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center text-gray-600">{safeFormat(item.labour)}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center text-gray-600">{safeFormat(item.material)}</td>
                    <td className="py-2 px-3 font-bold text-gray-900 text-right bg-emerald-50/50">Rs. {safeFormat(item.total)}</td>
                  </tr>
                ))}
                {/* Compact Section Subtotal */}
                <tr className="bg-gray-50 text-xs border-t-2 border-gray-300">
                  <td colSpan="4" className="py-2 px-3 text-right font-bold text-gray-600 uppercase tracking-wider border-r border-gray-300">
                    Category Total
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-700">
                    Rs. {safeFormat(section.sectionTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* 💰 COMPACT BOTTOM LAYOUT (Bank Details & Totals Side-by-Side) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 print-avoid-break">
        
        {/* Left: Bank Details */}
        <div className="flex-1 border border-gray-300 rounded-lg p-3">
          <h4 className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1.5 mb-2">
             <Landmark size={14} /> Bank Account Details
          </h4>
          <table className="text-xs w-full">
            <tbody>
              <tr>
                <td className="text-gray-500 pb-1 w-24">Bank Name:</td>
                <td className="font-bold text-gray-800 pb-1">{quote.bankDetails?.bankName || "-"}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pb-1">Account No:</td>
                <td className="font-bold text-gray-800 pb-1">{quote.bankDetails?.accNo || "-"}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pb-1">IFSC Code:</td>
                <td className="font-bold text-gray-800 pb-1">{quote.bankDetails?.ifsc || "-"}</td>
              </tr>
              {quote.bankDetails?.accHolder && (
                <tr>
                  <td className="text-gray-500">Holder Name:</td>
                  <td className="font-bold text-gray-800">{quote.bankDetails.accHolder}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Billing Summary (Tight) */}
        <div className="w-full sm:w-64 border border-emerald-600 rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-bold uppercase">Subtotal</span>
              <span className="font-bold text-gray-800">Rs. {safeFormat(quote.subtotal)}</span>
            </div>
            
            {Number(quote.discount) > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold uppercase">Discount</span>
                <span className="font-bold text-emerald-600">- Rs. {safeFormat(quote.discount)}</span>
              </div>
            )}

            {Number(quote.tax) > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold uppercase">Tax</span>
                <span className="font-bold text-gray-800">Rs. {safeFormat(quote.tax)}</span>
              </div>
            )}
          </div>
          <div className="bg-emerald-600 p-3 text-white flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest">Final Total</span>
            <span className="text-lg font-black">Rs. {safeFormat(quote.grandTotal)}</span>
          </div>
        </div>

      </div>

      {/* 📜 TERMS AND CONDITIONS (Small Text) */}
      <div className="border-t border-gray-200 pt-4 mt-auto print-avoid-break">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms & Conditions</h4>
        <ul className="list-disc list-outside ml-4 text-[11px] text-gray-600 space-y-1 leading-tight">
          {quote.terms && quote.terms.map((term, i) => (
             <li key={i} className="pl-1">{term}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}