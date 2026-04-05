import React from "react";

export default function GroupedTemplate({ data }) {
  // 🛑 Fallback Data (Updated to include multiple sections for testing)
  const quote = data || {
    companyName: "VisionX Builders",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Mr. Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    sections: [
      {
        title: "Exterior Works",
        items: [
          { desc: "Wall Surface (Premium)", labour: "15000.00", material: "25000.00", total: "40000.00" }
        ],
        sectionTotal: "40000.00"
      },
      {
        title: "Interior Works",
        items: [
          { desc: "Kitchen & Hall (Premium)", labour: "8000.00", material: "12000.00", total: "20000.00" },
          { desc: "Main Gate & Windows (Enamel)", labour: "3000.00", material: "4500.00", total: "7500.00" }
        ],
        sectionTotal: "27500.00"
      }
    ],
    subtotal: "67500.00",
    discount: "0.00",
    tax: "0.00",
    grandTotal: "67500.00",
    terms: [
      "3 terms of payment - 60% Advance, 30% Mid of the work, 10% After Successfully completion.",
      "A storage space at site for storing materials, supply of water & electricity must be provided by the client."
    ],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Builders" }
  };

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Safe check if sections exist
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Project Breakdown", items: quote.items || [], sectionTotal: quote.subtotal }];

  return (
    <div className="bg-white p-10 sm:p-14 min-h-[297mm] text-slate-900 font-serif shadow-sm relative border-t-[16px] border-slate-900">
      
      {/* 🏢 TOP HEADER (Executive Letterhead) */}
      <div className="text-center border-b-[3px] border-slate-900 pb-8 mb-10 print-avoid-break">
        {quote.companyLogo && (
          <img src={quote.companyLogo} alt="Company Logo" className="h-16 mx-auto mb-4 object-contain rounded-md" />
        )}
        <h1 className="text-3xl font-black uppercase tracking-[0.15em] text-slate-900">{quote.companyName}</h1>
        <p className="text-[11px] font-sans font-bold tracking-widest text-slate-500 mt-2 uppercase">
          {quote.companyPhone} <span className="mx-2 text-slate-300">|</span> {quote.companyEmail}
        </p>
      </div>

      {/* ✉️ LETTER META FORMAT */}
      <div className="mb-10 font-sans print-avoid-break">
        <div className="flex justify-between items-center mb-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-4">
          <p>Date: <span className="text-slate-900 ml-1">{quote.date}</span></p>
          <p>Ref: <span className="text-slate-900 ml-1">{quote.quotationNo}</span></p>
        </div>
        
        <div className="font-serif text-[15px] leading-relaxed text-slate-800">
          <p className="mb-4 font-bold text-slate-900">Dear Sir/Madam,</p>
          
          <div className="bg-slate-50 p-4 border-l-4 border-slate-900 mb-6 font-sans">
            <p className="font-bold text-sm text-slate-900 leading-relaxed uppercase tracking-wide">
              <span className="text-slate-500 mr-2">Subject:</span> Paint & Work Quote for {quote.clientName}, {quote.clientAddress}
            </p>
          </div>
          
          <p className="text-sm text-slate-700 font-medium">
            Thank you for your purchase enquiry for the above-mentioned site. Please find below our quotation for Material & Labour for this site.
          </p>
        </div>
      </div>

      {/* 📋 SECTIONS (Detailed Breakdown) */}
      <div className="space-y-12 mb-12">
        {sectionsToRender.map((section, secIdx) => (
          <div key={secIdx}>
            
            {/* Section Category Title */}
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-300 pb-2 mb-6 font-sans print-avoid-break">
              {section.title}
            </h2>

            <div className="space-y-8">
              {section.items && section.items.map((item, index) => (
                <div key={index} className="print-avoid-break">
                  
                  {/* Item Description as Sub-heading */}
                  <h3 className="text-[13px] font-bold text-slate-900 mb-3 border-l-[3px] border-slate-800 pl-3 bg-slate-50/50 py-2 whitespace-pre-wrap font-sans uppercase tracking-wide">
                    {item.desc}
                  </h3>
                  
                  {/* Minimalist Table for Labour/Material Split */}
                  <table className="w-full border border-slate-200 font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-100/50 border-b border-slate-200">
                        <th className="py-2.5 px-4 text-left font-bold text-slate-500 uppercase tracking-widest w-2/3">Work & Material Breakdown</th>
                        <th className="py-2.5 px-4 text-right font-bold text-slate-500 uppercase tracking-widest w-1/3">Amount (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-600 align-top">
                          <p className="mb-0.5"><span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mr-2">Labour Cost:</span> Surface preparation, crack filling, and application.</p>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-700 font-semibold align-top">
                          {safeFormat(item.labour)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4 text-slate-600 align-top">
                          <p><span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mr-2">Material Cost:</span> Primers, Emulsions, and related accessories.</p>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-700 font-semibold align-top">
                          {safeFormat(item.material)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/80">
                        <td className="py-3 px-4 text-right font-bold text-slate-600 uppercase tracking-widest text-[10px]">
                          Total Estimated Cost for this item =
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                          {safeFormat(item.total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Category Subtotal */}
            <div className="mt-5 text-right print-avoid-break bg-slate-100/50 py-3 px-4 rounded-lg border border-slate-200 inline-block float-right">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                {section.title} Total: <span className="text-slate-900 ml-4 font-black text-sm">Rs. {safeFormat(section.sectionTotal)}</span>
              </p>
            </div>
            <div className="clear-both"></div>
            
          </div>
        ))}
      </div>

      {/* 💰 GRAND TOTAL (Executive Impact) */}
      <div className="mb-14 text-right print-avoid-break font-sans">
        {Number(quote.discount) > 0 && (
          <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest mb-1.5">Discount: - Rs. {safeFormat(quote.discount)}</p>
        )}
        {Number(quote.tax) > 0 && (
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-2">Tax: Rs. {safeFormat(quote.tax)}</p>
        )}
        <div className="border-y-4 border-slate-900 py-4 mt-2 bg-slate-50 inline-block px-8 rounded-sm">
           <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">
             Total Working Cost <span className="text-slate-400 font-normal mx-3">=</span> Rs. {safeFormat(quote.grandTotal)}
           </h2>
        </div>
      </div>

      {/* 📜 TERMS & CONDITIONS */}
      <div className="mb-12 font-sans print-avoid-break">
        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2 inline-block">Terms and Conditions</h4>
        <ul className="text-xs text-slate-600 space-y-2.5 font-medium leading-relaxed">
          {quote.terms && quote.terms.map((term, i) => (
             <li key={i} className="flex items-start gap-3">
               <span className="font-black text-slate-400">{i + 1}.</span> {term}
             </li>
          ))}
        </ul>
      </div>

      {/* 🏦 BANK DETAILS & SIGNATURE (Side by Side) */}
      <div className="flex flex-col md:flex-row justify-between items-end mt-12 pt-8 border-t-2 border-slate-100 font-sans print-avoid-break">
        
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Bank Account Details</h4>
           <div className="text-[11px] text-slate-700 space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
             <p className="flex justify-between border-b border-slate-200 pb-1.5"><span className="font-bold text-slate-500 uppercase tracking-wider">Bank Name:</span> <span className="font-black text-slate-900">{quote.bankDetails?.bankName || "-"}</span></p>
             <p className="flex justify-between border-b border-slate-200 pb-1.5"><span className="font-bold text-slate-500 uppercase tracking-wider">A/c No:</span> <span className="font-black text-slate-900 tracking-widest">{quote.bankDetails?.accNo || "-"}</span></p>
             <p className="flex justify-between border-b border-slate-200 pb-1.5"><span className="font-bold text-slate-500 uppercase tracking-wider">IFSC Code:</span> <span className="font-black text-slate-900 tracking-widest">{quote.bankDetails?.ifsc || "-"}</span></p>
             {quote.bankDetails?.accHolder && (
               <p className="flex justify-between pt-1"><span className="font-bold text-slate-500 uppercase tracking-wider">Name:</span> <span className="font-black text-slate-900">{quote.bankDetails.accHolder}</span></p>
             )}
           </div>
        </div>

        <div className="w-full md:w-1/2 text-right flex flex-col items-end">
           <p className="text-xs text-slate-500 italic mb-14 font-serif">With Regards,</p>
           <h4 className="text-base font-black text-slate-900 uppercase tracking-wider">{quote.companyName}</h4>
           <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-[0.2em] font-bold">Authorized Signatory</p>
        </div>
      </div>

    </div>
  );
}