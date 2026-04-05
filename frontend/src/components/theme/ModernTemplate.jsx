import React from "react";

export default function ModernTemplate({ data }) {
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
          { desc: "Weatherproof Emulsion (2 Coats)", labour: "8.00", material: "12.00", total: "20.00" }
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

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Safe check if sections exist
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Material & Labour Rates", items: quote.items || [], sectionTotal: quote.subtotal }];

  return (
    <div className="bg-white p-10 sm:p-14 min-h-[297mm] text-slate-800 font-sans relative border-t-[12px] border-blue-600 shadow-sm">
      
      {/* 🏢 HEADER SECTION (Clean Split Layout) */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-[3px] border-slate-100 pb-10 mb-10 print-avoid-break gap-8">
        
        <div className="flex-1">
          {quote.companyLogo && (
            <img src={quote.companyLogo} alt="Logo" className="h-16 mb-5 object-contain rounded-lg" />
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            {quote.companyName}
          </h1>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest space-y-1">
            <p>{quote.companyPhone}</p>
            <p>{quote.companyEmail}</p>
          </div>
        </div>
        
        <div className="md:text-right shrink-0">
          <h2 className="text-5xl font-black text-blue-50 tracking-widest uppercase print:text-slate-100 mb-6">Quotation</h2>
          
          <div className="flex flex-col md:items-end gap-3">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex gap-6 w-fit">
               <div>
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Quote No.</p>
                 <p className="text-sm font-black text-slate-900">{quote.quotationNo}</p>
               </div>
               <div className="w-px bg-slate-200"></div>
               <div>
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Date</p>
                 <p className="text-sm font-black text-slate-900">{quote.date}</p>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* 👤 CLIENT DETAILS (Modern Minimal Badge) */}
      <div className="mb-12 bg-slate-50/80 p-6 rounded-[1.5rem] border border-slate-100 flex justify-between items-center print-avoid-break">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Quote For
          </p>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{quote.clientName}</h3>
          <p className="text-xs font-bold text-slate-500 mt-1.5 max-w-sm leading-relaxed">{quote.clientAddress}</p>
        </div>
        <div className="hidden sm:flex w-16 h-16 bg-white rounded-2xl shadow-sm items-center justify-center border border-slate-100 shrink-0">
           <span className="text-blue-600 font-black text-2xl uppercase">{quote.clientName.charAt(0)}</span>
        </div>
      </div>

      {/* 📊 ITEMS TABLE (Multiple Sections) */}
      <div className="mb-12 space-y-10">
        {sectionsToRender.map((section, secIdx) => (
          <div key={secIdx} className="print-avoid-break">
            
            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              {section.title}
              <div className="h-px bg-blue-100 flex-1"></div>
            </h4>

            <div className="border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-100 print:bg-slate-50 print:text-slate-500">
                    <th className="py-4 px-6 w-1/2">Description of Work</th>
                    <th className="py-4 px-6 text-center">Labour</th>
                    <th className="py-4 px-6 text-center">Material</th>
                    <th className="py-4 px-6 text-right">Total / Sqft</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items && section.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30 transition-colors">
                      <td className="py-5 px-6 text-xs font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">{item.desc}</td>
                      <td className="py-5 px-6 text-xs font-bold text-slate-500 text-center bg-slate-50/50">{safeFormat(item.labour)}</td>
                      <td className="py-5 px-6 text-xs font-bold text-slate-500 text-center">{safeFormat(item.material)}</td>
                      <td className="py-5 px-6 text-sm font-black text-slate-900 text-right bg-blue-50/30">Rs. {safeFormat(item.total)}</td>
                    </tr>
                  ))}
                  
                  {/* Category Total Row */}
                  <tr className="bg-slate-800 text-white print:bg-slate-800 print:text-white">
                    <td colSpan="3" className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest opacity-80">
                      Category Total
                    </td>
                    <td className="py-4 px-6 text-right text-base font-black tracking-tight text-blue-300">
                      Rs. {safeFormat(section.sectionTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 BOTTOM SPLIT: BANK DETAILS & TOTAL */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 print-avoid-break border-t-2 border-slate-100 pt-10">
        
        {/* Left: Bank Details */}
        <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-8 rounded-3xl print:bg-slate-50">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Payment Details
          </h4>
          <div className="space-y-3 text-[11px] font-bold text-slate-600">
            <div className="flex justify-between border-b border-slate-200 pb-2.5">
              <span className="uppercase tracking-wider">Bank Name</span>
              <span className="font-black text-slate-900">{quote.bankDetails?.bankName || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2.5">
              <span className="uppercase tracking-wider">Account No</span>
              <span className="font-black text-slate-900 tracking-widest">{quote.bankDetails?.accNo || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2.5">
              <span className="uppercase tracking-wider">IFSC Code</span>
              <span className="font-black text-slate-900 tracking-widest">{quote.bankDetails?.ifsc || "-"}</span>
            </div>
            {quote.bankDetails?.accHolder && (
              <div className="flex justify-between pt-1">
                <span className="uppercase tracking-wider">Holder Name</span>
                <span className="font-black text-slate-900">{quote.bankDetails.accHolder}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Billing Summary */}
        <div className="w-full md:w-80 bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-600/20 print:bg-blue-600 print:text-white print:shadow-none">
          <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-6">Billing Summary</h4>
          
          <div className="flex justify-between items-center mb-4 text-xs font-bold">
            <span className="text-blue-100 uppercase tracking-wider">Subtotal</span>
            <span>Rs. {safeFormat(quote.subtotal)}</span>
          </div>
          
          {Number(quote.discount) > 0 && (
            <div className="flex justify-between items-center mb-4 text-xs font-bold">
              <span className="text-blue-100 uppercase tracking-wider">Discount</span>
              <span className="text-emerald-300">- Rs. {safeFormat(quote.discount)}</span>
            </div>
          )}

          {Number(quote.tax) > 0 && (
            <div className="flex justify-between items-center mb-6 text-xs font-bold">
              <span className="text-blue-100 uppercase tracking-wider">Tax</span>
              <span>Rs. {safeFormat(quote.tax)}</span>
            </div>
          )}

          <div className="border-t-2 border-blue-500/50 mt-2 pt-6 flex justify-between items-end">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Grand Total</span>
            <span className="text-3xl font-black tracking-tighter">Rs. {safeFormat(quote.grandTotal)}</span>
          </div>
        </div>

      </div>

      {/* 📜 TERMS AND CONDITIONS */}
      <div className="print-avoid-break">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Terms & Conditions</h4>
        <ul className="list-none text-[11px] text-slate-500 space-y-2 font-bold leading-relaxed">
          {quote.terms && quote.terms.map((term, i) => (
             <li key={i} className="flex gap-3">
                 <span className="text-slate-300 font-black">{i+1}.</span> {term}
             </li>
          ))}
        </ul>
      </div>

    </div>
  );
}