import React from "react";

export default function PreviewRateTable({ rateTable, totals, formatNum }) {
  return (
    <div className="mb-10 font-sans text-slate-900">
      
      {/* Table Container */}
      <table className="w-full text-[13px] border-collapse border border-slate-400 mb-8 print:break-inside-avoid">
        
        {/* Table Head (Matching the PDF exact headers) */}
        <thead>
          <tr className="bg-[#f8fafc] text-slate-800 uppercase tracking-widest text-[11px]">
            <th className="border border-slate-300 py-3 px-4 font-black text-left w-[45%]">
              DESCRIPTION OF WORK
            </th>
            <th className="border border-slate-300 py-3 px-4 font-black text-center w-[15%]">
              LABOUR
            </th>
            <th className="border border-slate-300 py-3 px-4 font-black text-center w-[15%]">
              MATERIAL
            </th>
            <th className="border border-slate-300 py-3 px-4 font-black text-right w-[25%]">
              TOTAL/SQFT
            </th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
          {rateTable?.length > 0 ? (
            rateTable.map((item, idx) => (
              <tr key={idx} className="align-middle print:break-inside-avoid hover:bg-slate-50 transition-colors">
                
                {/* Work Description (Left Aligned) */}
                <td className="border border-slate-300 py-4 px-4 font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {item.work || "—"}
                </td>
                
                {/* Labour Cost (Center Aligned) */}
                <td className="border border-slate-300 py-4 px-4 text-center font-semibold text-slate-700">
                  {formatNum(item.labour)}
                </td>
                
                {/* Material Cost (Center Aligned) */}
                <td className="border border-slate-300 py-4 px-4 text-center font-semibold text-slate-700">
                  {formatNum(item.material)}
                </td>
                
                {/* Total Cost (Right Aligned & Bold) */}
                <td className="border border-slate-300 py-4 px-4 text-right font-black text-slate-900">
                  {formatNum(item.total)}
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-slate-300 py-8 text-center text-slate-400 font-bold uppercase tracking-widest">
                No work items added
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}