import React from "react";
import { ShieldCheck, Building2, FileText, AlertCircle } from "lucide-react";

/**
 * Professional Classic Template
 * @param {Object} data - This 'data' comes from Preview.jsx mappedData logic
 */
export default function ClassicTemplate({ data }) {
  // 🛑 Fallback Data (For testing if preview data is missing)
  const quote = data || {
    companyName: "VisionX Builders",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    subject: "Paint Quote for Mr.Mani, Zoology Park Road, Salem (8870115420)",
    paintBrand: "Nippon Paint", 
    warranty: "8", 
    startDate: "15 Apr 2026", 
    endDate: "30 Apr 2026", 
    scopeOfWork: "Complete exterior surface preparation, crack filling, and 2 coats of premium emulsion painting.", 
    exclusions: "Interior painting, electrical work, and scaffolding beyond 2 floors are not included.", 
    validity: "The price quoted here will be valid for 30 days from the date of issue.", 
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    sections: [
      {
        title: "Exterior Wall Surface (Premium)",
        workingArea: "5198",
        ratePerSqft: "20.00",
        items: [
          { desc: "Surface Preparation,\nCrack Filling, Scrapping", labour: "5.00", material: "5.00", total: "10.00" },
          { desc: "Asian Ext Wall Primer (1 Coat),\nAsian Apex Ultima Ext Emulsion (2 Coat)", labour: "5.00", material: "5.00", total: "10.00" },
        ],
        sectionTotal: "103960.00"
      }
    ],
    subtotal: "103960.00",
    discount: "0.00",
    tax: "0.00",
    grandTotal: "103960.00",
    terms: ["Scaffolding must be provided by the client wherever rope scaffolding is not possible.", "Payment should be made 50% in advance."],
    paymentSteps: [ 
      { label: "Advance", percent: "50" },
      { label: "Mid Work", percent: "30" },
      { label: "Completion", percent: "20" }
    ],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Builders" },
    signature: { name: "Sanjai", designation: "Managing Director" } 
  };

  // Safe checks for mapping tables
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Material & Labour Rates", items: quote.items || [], sectionTotal: quote.subtotal }];

  // 🔥 Visibility Checkers (டேட்டா காலியா இருந்தா செக்ஷனை மறைக்க)
  const hasScope = quote.scopeOfWork && quote.scopeOfWork.trim() !== "";
  const hasExclusions = quote.exclusions && quote.exclusions.trim() !== "";
  const hasTerms = quote.terms && quote.terms.length > 0;
  const hasBankDetails = quote.bankDetails?.bankName && quote.bankDetails.bankName.trim() !== "" && quote.bankDetails.bankName !== "-";
  const hasPaymentSchedule = quote.paymentSteps && quote.paymentSteps.some(step => step.percent && Number(step.percent) > 0);

  return (
    <div className="bg-white p-12 min-h-[297mm] text-gray-800 font-sans shadow-inner border border-gray-100 relative">
      
      {/* 🏢 1. HEADER SECTION */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-start gap-4">
          {quote.companyLogo ? (
             <img src={quote.companyLogo} alt="Logo" className="w-20 h-20 object-contain shrink-0 rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
               <Building2 size={32} strokeWidth={1.5} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">
              {quote.companyName}
            </h1>
            <div className="text-sm text-slate-500 font-medium space-y-0.5">
              <p>{quote.companyPhone}</p>
              <p>{quote.companyEmail}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest leading-none mb-4">Quotation</h2>
          <div className="flex flex-col items-end gap-1.5 text-sm">
            {quote.date && quote.date !== "" && (
              <div className="flex gap-4">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Date:</span>
                <span className="font-semibold text-slate-800">{quote.date}</span>
              </div>
            )}
            <div className="flex gap-4">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Ref No:</span>
              <span className="font-semibold text-slate-800">{quote.quotationNo}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 mb-8" />

      {/* 👤 2. CLIENT DETAILS, BRAND & WARRANTY */}
      <div className="mb-6 print-avoid-break bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex flex-row justify-between items-start gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Quotation For:</p>
          <h3 className="text-xl font-bold text-slate-900">{quote.clientName}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-md">{quote.clientAddress}</p>
        </div>
        
        {/* 🔥 BRAND & WARRANTY BADGES */}
        <div className="text-right shrink-0 flex flex-col items-end gap-2.5">
          {quote.paintBrand && (
            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand:</span>
              <span className="inline-block bg-white px-3 py-1 rounded-md border border-slate-200 text-xs font-black text-slate-800 shadow-sm">
                {quote.paintBrand}
              </span>
            </div>
          )}
          {quote.warranty && (
            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty:</span>
              <span className="inline-block bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 text-xs font-black text-indigo-700 shadow-sm">
                {quote.warranty} Years
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 📝 3. SUBJECT LINE */}
      {quote.subject && (
        <div className="mb-8 print-avoid-break bg-indigo-50/40 p-4 border-l-4 border-indigo-600 rounded-r-xl shadow-sm">
          <p className="text-sm text-slate-800 flex items-start gap-3">
            <span className="font-black uppercase tracking-widest text-xs mt-0.5 text-indigo-800 shrink-0">Subject:</span> 
            <span className="font-semibold text-slate-700 leading-relaxed">{quote.subject}</span>
          </p>
        </div>
      )}

      {/* 📅 4. TIMELINE */}
      {(quote.startDate || quote.endDate) && (
        <div className="mb-8 print-avoid-break flex flex-wrap gap-8 p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          {quote.startDate && (
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Date</span>
              <span className="text-sm font-bold text-slate-800">{quote.startDate}</span>
            </div>
          )}
          {quote.endDate && (
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estimated Completion</span>
              <span className="text-sm font-bold text-slate-800">{quote.endDate}</span>
            </div>
          )}
        </div>
      )}

      {/* 📊 5. TABLES MAP */}
      <div className="mb-8 space-y-10">
        {sectionsToRender.map((section, idx) => (
          <div key={idx} className="print-avoid-break">
            
            <div className="flex items-center gap-3 mb-4">
              <h4 className="font-black text-slate-800 text-sm tracking-wide whitespace-nowrap">
                {section.title}
              </h4>
              <div className="h-[1px] w-full bg-slate-200"></div>
            </div>

            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest">
                    <th className="py-4 px-6 border-b border-slate-700">Material and Work</th>
                    <th className="py-4 px-6 text-center w-24 border-b border-l border-slate-700">Labour</th>
                    <th className="py-4 px-6 text-center w-24 border-b border-l border-slate-700">Material</th>
                    <th className="py-4 px-6 text-center w-36 border-b border-l border-slate-700">Total / Sqft</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {section.items && section.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">{item.desc}</td>
                      <td className="py-4 px-6 text-sm text-slate-500 text-center font-medium border-l border-slate-100">{item.labour}</td>
                      <td className="py-4 px-6 text-sm text-slate-500 text-center font-medium border-l border-slate-100">{item.material}</td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800 text-center border-l border-slate-100">Rs. {item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
                {section.workingArea ? (
                  <p className="text-sm font-bold text-slate-800">
                    Total Working Area {section.workingArea} Sqft <span className="mx-1 text-slate-400">X</span> {section.ratePerSqft} <span className="mx-1 text-slate-400">=</span> <span className="font-black text-indigo-700 text-base">Rs. {section.sectionTotal}</span>
                  </p>
                ) : (
                  <p className="text-sm font-bold text-slate-800">
                    Category Total <span className="mx-1 text-slate-400">=</span> <span className="font-black text-indigo-700 text-base">Rs. {section.sectionTotal}</span>
                  </p>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 💰 6. BILLING SUMMARY */}
      <div className="flex justify-end mb-12 print-avoid-break">
        <div className="w-full md:w-80 border-2 border-slate-900 rounded-2xl p-6 bg-slate-900 text-white shadow-xl">
          <div className="space-y-3">
            <div className="flex justify-between items-center opacity-70 text-xs font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>Rs. {quote.subtotal}</span>
            </div>
            {quote.discount && quote.discount !== "0.00" && (
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-emerald-400">
                <span>Discount</span>
                <span>- Rs. {quote.discount}</span>
              </div>
            )}
            <div className="h-[1px] bg-white/20 my-2"></div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-black uppercase tracking-[0.2em]">Grand Total</span>
              <span className="text-2xl font-black">Rs. {quote.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 7. SCOPE, TERMS & EXCLUSIONS (Line by Line) */}
      {(hasScope || hasTerms || hasExclusions) && (
        <div className="space-y-8 mb-10 border-t border-slate-100 pt-8 print-avoid-break">
          
          {/* Scope of Work */}
          {hasScope && (
            <div>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-3">
                 <FileText size={16} className="text-indigo-600" /> Scope of Work
              </h4>
              <p className="text-[13px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap pl-6 border-l-2 border-indigo-100">{quote.scopeOfWork}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          {hasTerms && (
            <div>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-3">
                 <ShieldCheck size={16} className="text-indigo-600" /> Terms & Conditions
              </h4>
              <ul className="text-[13px] text-slate-600 space-y-2 leading-relaxed font-medium pl-2">
                {quote.terms.map((term, i) => (
                   <li key={i} className="flex gap-3">
                     <span className="text-indigo-600 font-bold">{i + 1}.</span>
                     <span>{term}</span>
                   </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {hasExclusions && (
            <div>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-3">
                 <AlertCircle size={16} className="text-red-500" /> Exclusions
              </h4>
              <p className="text-[13px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap pl-6 border-l-2 border-red-100">{quote.exclusions}</p>
            </div>
          )}
        </div>
      )}

      {/* 🏦 8. BANK & PAYMENT SCHEDULE (Side-by-Side dynamically) */}
      {(hasBankDetails || hasPaymentSchedule) && (
        <div className={`grid gap-8 mb-10 border-t border-slate-100 pt-8 print-avoid-break ${hasBankDetails && hasPaymentSchedule ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          
          {/* Left: Bank Details */}
          {hasBankDetails && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Bank Details</h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">Bank</span>
                  <span className="text-slate-800 font-bold">{quote.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">A/C No</span>
                  <span className="text-slate-800 font-bold tracking-widest">{quote.bankDetails.accNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">IFSC</span>
                  <span className="text-indigo-600 font-bold">{quote.bankDetails.ifsc}</span>
                </div>
              </div>
            </div>
          )}

          {/* Right: Payment Schedule */}
          {hasPaymentSchedule && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Payment Schedule</h4>
              <div className="space-y-3 text-sm">
                {quote.paymentSteps.map((step, i) => (
                  step.percent && step.percent !== "0" && (
                    <div key={i} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                      <span className="text-slate-600 font-medium">{step.label}</span>
                      <span className="text-slate-900 font-black bg-slate-100 px-3 py-1 rounded-md">{step.percent}%</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ✍️ 9. SIGNATURE & VALIDITY */}
      <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-8 print-avoid-break">
        <div className="max-w-md">
          {quote.validity && (
            <>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Validity</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{quote.validity}</p>
            </>
          )}
        </div>
        
        <div className="text-right shrink-0">
          <div className="h-16 w-40 border-b border-slate-300 mb-3 mx-auto"></div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            {quote.signature?.name || quote.companyName || "Authorized Signatory"}
          </h4>
          {(quote.signature?.designation) && (
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">
              {quote.signature.designation}
            </p>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">VisionX Intelligence Generated</p>
      </div>

    </div>
  );
}