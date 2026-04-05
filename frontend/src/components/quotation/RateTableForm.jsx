import React from "react";
import { TableProperties, Plus, Trash2, Layers } from "lucide-react";

export default function RateTableForm({ 
  rateSections, 
  handleSectionTitleChange, 
  handleSectionAreaChange, // 🔥 NEW PROP ADDED
  handleRateTableChange, 
  addRateRow, 
  deleteRateRow, 
  addSection, 
  deleteSection, 
  totalSqft 
}) {
  const cardStyle = "bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8";

  // 🔥 CALCULATE OVERALL GRAND TOTAL (Area × Rate for all sections)
  const grandTotalAmount = rateSections?.reduce((total, section) => {
    const sectionTotalRate = section.rows.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    const sectionArea = Number(section.workingArea) || 0;
    return total + (sectionArea * sectionTotalRate);
  }, 0) || 0;

  return (
    <div>
      {/* MAP THROUGH EACH SECTION / BOX */}
      {rateSections?.map((section, index) => {
        // Calculate totals for this specific box
        const sectionLabour = section.rows.reduce((acc, row) => acc + (Number(row.labour) || 0), 0);
        const sectionMaterial = section.rows.reduce((acc, row) => acc + (Number(row.material) || 0), 0);
        const sectionTotal = section.rows.reduce((acc, row) => acc + (Number(row.total) || 0), 0);

        return (
          <div key={section.id} className={cardStyle}>
            
            {/* BOX HEADER WITH EDITABLE TITLE */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <TableProperties size={22}/>
                </div>
                <div className="w-full max-w-md">
                  <input 
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                    className="text-xl font-bold text-slate-900 leading-none bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none w-full transition-colors pb-1"
                    placeholder="e.g., Interior Works..."
                  />
                  <p className="text-sm text-slate-500 mt-1 font-medium">Breakdown of work specifications and costs</p>
                </div>
              </div>
              
              {/* DELETE BOX BUTTON (Shows only if more than 1 box exists) */}
              {rateSections.length > 1 && (
                <button 
                  onClick={() => deleteSection(section.id)} 
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-all"
                  title="Delete this entire category"
                >
                  <Trash2 size={20}/>
                </button>
              )}
            </div>

            {/* INNER TABLE */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-600 font-black tracking-wider text-xs uppercase">
                    <th className="py-4 px-6 w-1/2">Material and Work Description</th>
                    <th className="py-4 px-6 text-center">Labour (₹)</th>
                    <th className="py-4 px-6 text-center">Material (₹)</th>
                    <th className="py-4 px-6 text-right">Total / Sqft (₹)</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {section.rows.map((row) => (
                    <tr key={row.id} className="group bg-white hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <textarea 
                          rows={2} 
                          className="w-full bg-transparent outline-none text-slate-800 font-medium resize-none placeholder-slate-300" 
                          placeholder="e.g. Surface Preparation, Asian Ext Primer (1 Coat)..." 
                          value={row.work} 
                          onChange={(e) => handleRateTableChange(section.id, row.id, "work", e.target.value)} 
                        />
                      </td>
                      <td className="py-3 px-6">
                        <input 
                          type="number" 
                          className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-2 outline-none text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20" 
                          value={row.labour} 
                          onChange={(e) => handleRateTableChange(section.id, row.id, "labour", e.target.value)} 
                        />
                      </td>
                      <td className="py-3 px-6">
                        <input 
                          type="number" 
                          className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-2 outline-none text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20" 
                          value={row.material} 
                          onChange={(e) => handleRateTableChange(section.id, row.id, "material", e.target.value)} 
                        />
                      </td>
                      <td className="py-3 px-6 text-right font-black text-indigo-700 text-base">
                        {Number(row.total || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => deleteRateRow(section.id, row.id)} 
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* CATEGORY TOTALS SUMMARY ROW */}
                  <tr className="bg-slate-800 text-white font-bold border-t-2 border-slate-900">
                    <td className="py-5 px-6 uppercase tracking-wider text-xs">Category Estimation / Sqft</td>
                    <td className="py-5 px-6 text-center">{sectionLabour.toFixed(2)}</td>
                    <td className="py-5 px-6 text-center">{sectionMaterial.toFixed(2)}</td>
                    <td className="py-5 px-6 text-right text-lg text-emerald-400">{sectionTotal.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              
              {/* ADD NEW ROW BUTTON FOR THIS CATEGORY */}
              <div className="bg-white border-t border-slate-200">
                <button 
                  onClick={() => addRateRow(section.id)} 
                  className="w-full py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={18}/> Add New Work Item
                </button>
              </div>
            </div>

            {/* 🔥 NEW: TOTAL CALCULATION AREA (Area X Rate) */}
            <div className="mt-6 p-6 bg-blue-50/50 rounded-[1.5rem] border-2 border-dashed border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Working Area</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={section.workingArea || ""}
                      onChange={(e) => handleSectionAreaChange(section.id, e.target.value)}
                      className="w-24 text-lg font-black text-slate-800 outline-none bg-transparent"
                      placeholder="0"
                    />
                    <span className="text-sm font-bold text-slate-400">Sqft</span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-slate-300">×</div>
                
                <div className="text-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Rate / Sqft</label>
                  <div className="text-lg font-black text-slate-800">
                    ₹{sectionTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Category Estimated Amount</label>
                <div className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
                  ₹{((Number(section.workingArea) || 0) * sectionTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

          </div>
        );
      })}

      {/* 🔥 ADD NEW CATEGORY BOX BUTTON */}
      <button 
        onClick={addSection}
        className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-600 rounded-3xl py-6 flex flex-col items-center justify-center gap-3 transition-all mb-8 group shadow-sm"
      >
        <div className="bg-white p-3 rounded-full shadow-sm group-hover:shadow group-hover:scale-110 transition-all text-indigo-600">
          <Layers size={24} />
        </div>
        <span className="font-black text-sm tracking-wide uppercase">Add New Rate Category</span>
      </button>

      {/* 🔥 GRAND TOTAL SUMMARY OF ALL BOXES */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between border border-slate-700 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-slate-700/50 p-4 rounded-2xl">
            <TableProperties size={28} className="text-emerald-400"/>
          </div>
          <div>
            <h3 className="font-black text-xl text-white">Final Grand Total</h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Combined total amount of all categories</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-emerald-400 tracking-tight">
            ₹ {grandTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

    </div>
  );
}