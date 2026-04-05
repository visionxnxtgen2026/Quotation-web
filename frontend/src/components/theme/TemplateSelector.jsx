import React from "react";
import { Layout, Printer, Download, Edit3, CheckCircle2, Share2 } from "lucide-react";

export default function TemplateSelector({ selected, onSelect, onPrint, onExport, onEdit }) {
  const templates = [
    // ── Original 6 ──
    { id: "classic",    name: "Classic",    color: "bg-slate-500" },
    { id: "modern",     name: "Modern",     color: "bg-blue-500" },
    { id: "corporate",  name: "Corporate",  color: "bg-amber-600" },
    { id: "compact",    name: "Compact",    color: "bg-emerald-500" },
    { id: "creative",   name: "Creative",   color: "bg-purple-500" },
    { id: "grouped",    name: "Grouped",    color: "bg-rose-500" },
    // ── Premium 3 ──
    { id: "obsidian",   name: "Obsidian",   color: "bg-yellow-500" },   // dark luxury gold
    { id: "sovereign",  name: "Sovereign",  color: "bg-red-600" },      // navy + crimson
    { id: "aurora",     name: "Aurora",     color: "bg-teal-500" },     // arctic teal
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 py-4 flex flex-col xl:flex-row items-center justify-between shadow-sm sticky top-0 z-30 print:hidden gap-5 transition-all">

      {/* 📑 TEMPLATE TABS (Scrollable via Hidden Scrollbar) */}
      <div className="flex items-center gap-4 w-full xl:w-auto overflow-hidden relative">
        
        {/* Label */}
        <div className="flex items-center gap-2 text-slate-400 border-r border-slate-200/80 pr-4 shrink-0">
          <Layout size={18} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline-block mt-0.5">
            Templates
          </span>
        </div>

        {/* Scrollable Container (Snap Scrolling for mobile) */}
        <div className="flex bg-slate-100/50 p-1.5 rounded-[1.25rem] gap-1.5 overflow-x-auto border border-slate-200/50 w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 shrink-0 snap-center ${
                selected === t.id
                  ? "bg-white text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200/80 scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${t.color} transition-all duration-300 ${
                  selected === t.id ? "animate-pulse shadow-[0_0_8px_currentColor]" : "opacity-50"
                }`}
              />
              {t.name}
              {selected === t.id && (
                <CheckCircle2 size={14} className="text-blue-600 animate-in zoom-in" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>

        {/* Right fade gradient to indicate scrollability on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent xl:hidden pointer-events-none"></div>
      </div>

      {/* ⚙️ ACTION BUTTONS */}
      <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end gap-3 shrink-0">
        
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="p-3 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-slate-200/60 hover:border-blue-200 bg-white shadow-sm active:scale-95 group"
            title="Edit Details"
          >
            <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="p-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all border border-slate-200/60 hover:border-slate-300 bg-white shadow-sm active:scale-95 group"
            title="Print Preview"
          >
            <Printer size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />

        {/* Export / Share Button */}
        <button
          onClick={onExport}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 md:px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 border border-blue-500/50 w-full sm:w-auto"
        >
          <Download size={16} strokeWidth={2.5} className="hidden sm:block" />
          <Share2 size={16} strokeWidth={2.5} className="sm:hidden" />
          <span className="hidden sm:inline">Export & Share</span>
          <span className="sm:hidden">Share</span>
        </button>

      </div>

    </div>
  );
}