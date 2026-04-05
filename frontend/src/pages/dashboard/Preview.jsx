import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

// ── Template Selector toolbar ──
import TemplateSelector from "../../components/theme/TemplateSelector";

// ── Original 6 templates ──
import ClassicTemplate   from "../../components/theme/ClassicTemplate";
import ModernTemplate    from "../../components/theme/ModernTemplate";
import CorporateTemplate from "../../components/theme/CorporateTemplate";
import CompactTemplate   from "../../components/theme/CompactTemplate";
import CreativeTemplate  from "../../components/theme/CreativeTemplate";
import GroupedTemplate   from "../../components/theme/GroupedTemplate";

// ── New Premium 3 templates ──
import ObsidianTemplate  from "../../components/theme/ObsidianTemplate";
import SovereignTemplate from "../../components/theme/SovereignTemplate";
import AuroraTemplate    from "../../components/theme/AuroraTemplate";

// ─────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────
const API = axios.create({
  baseURL: "http://localhost:5000/api/quotations",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getQuotationById = (id) => API.get(`/${id}`);

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export default function Preview({
  user,
  goBack,
  goToExport,
  goToDashboard,
  goToSubscription,
  goToSettings,
  goToHelp,
  goToEditProfile,
  goToCreate,
}) {
  const { id } = useParams();

  // Persist selected template across sessions
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem("selectedTemplate") || "classic";
  });

  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  // ── Default / fallback data (Removed areaDetails & coverLetter) ──
  const getDefaultData = () => ({
    projectDetails: {
      companyLogo: "",
      companyName: "Your Company",
      clientName: "Client Name",
      subject: "", 
      paintBrand: "", // 🔥 FALLBACK TO EMPTY SO PLACEHOLDER SHOWS
      date: new Date().toISOString(),
    },
    rateSections: [],
    pricing: { grandTotal: 0, discount: 0, tax: 0, warranty: "" },
    timeline: { startDate: "", endDate: "" },
    textAreas: { scopeOfWork: "", exclusions: "", termsConditions: "" },
    paymentTerms: { step1: "Advance", step2: "Mid Work", step3: "Completion" },
    paymentPercents: { p1: "50", p2: "30", p3: "20" },
    bankDetails: { bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", branch: "" },
    signature: { name: "", designation: "", phone: "", email: "" },
    validity: ""
  });

  const [quotation, setQuotation] = useState(() => {
    if (!id) {
      const draft = localStorage.getItem("previewDraft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          // Migration: older drafts had a flat rateTable
          if (parsed.rateTable && !parsed.rateSections) {
            parsed.rateSections = [
              { title: "Material & Labour Rates", workingArea: "", rows: parsed.rateTable },
            ];
          }
          return parsed;
        } catch (e) {
          console.error("Draft parsing error:", e);
        }
      }
      return getDefaultData();
    }
    return null;
  });

  // ── Fetch from DB when id is present ──
  useEffect(() => {
    if (!id) return;
    const fetchFromDB = async () => {
      setIsLoading(true);
      try {
        const res = await getQuotationById(id);
        const data = res.data;
        if (data.rateTable && !data.rateSections) {
          data.rateSections = [
            { title: "Material & Labour Rates", workingArea: "", rows: data.rateTable },
          ];
        }
        setQuotation(data);
      } catch {
        alert("Failed to load quotation from database. Showing default template.");
        setQuotation(getDefaultData());
      } finally {
        setIsLoading(false);
      }
    };
    fetchFromDB();
  }, [id]);

  // ── Helpers (🔥 FIX: "0001" மற்றும் காலியான தேதிகளை மறைக்க) ──
  const formatDate = (dateString) => {
    // இன்புட் இல்லன்னாலோ அல்லது "0001" ல ஆரம்பிச்சாலோ காட்டக்கூடாது
    if (!dateString || dateString === "" || dateString.toString().startsWith("0001")) return ""; 
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // தப்பான தேதி இருந்தாலும் மறைத்துவிடும்

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNum = (num) => Number(num || 0).toFixed(2);

  // ── 🔥 Totals Calculation ──
  const totals = useMemo(() => {
    if (!quotation) return { subtotal: 0, discountAmount: 0, taxAmount: 0, finalAmount: 0 };

    let totalSubtotal = 0;
    quotation.rateSections?.forEach((section) => {
      const sectionTotalRate = section.rows?.reduce((acc, row) => acc + (Number(row.total) || 0), 0) || 0;
      
      // Area calculation (Default to 1 if no area is given, to act as a flat rate)
      const area = Number(section.workingArea) > 0 ? Number(section.workingArea) : 1;
      totalSubtotal += (sectionTotalRate * area);
    });

    const discountPercent = Number(quotation.pricing?.discount) || 0;
    const discountAmount  = (totalSubtotal * discountPercent) / 100;
    const taxAmount       = Number(quotation.pricing?.tax) || 0; 
    
    // Grand Total logic
    const finalAmount     = id && quotation.pricing?.grandTotal && quotation.pricing.grandTotal > 0
      ? quotation.pricing.grandTotal
      : (totalSubtotal - discountAmount + taxAmount);

    return { subtotal: totalSubtotal, discountPercent, discountAmount, taxAmount, finalAmount };
  }, [quotation, id]);

  // ── Map DB / localStorage data → unified template prop format ──
  const mappedData = useMemo(() => {
    if (!quotation) return null;

    const formattedSections = quotation.rateSections?.map((section) => {
      // Calculate Section Total (Rate × Area)
      const sectionTotalRate = section.rows?.reduce((acc, row) => acc + (Number(row.total) || 0), 0) || 0;
      const area = Number(section.workingArea) > 0 ? Number(section.workingArea) : 1;
      const sectionTotal = sectionTotalRate * area;

      return {
        title: section.title || "Material & Labour Rates",
        workingArea: section.workingArea || "", 
        ratePerSqft: formatNum(sectionTotalRate), 
        items: section.rows?.map((item) => ({
          desc:     item.work || item.workDescription || item.description || "-",
          labour:   formatNum(item.labour),
          material: formatNum(item.material),
          total:    formatNum(item.total),
        })) || [],
        sectionTotal: formatNum(sectionTotal), 
      };
    }) || [];

    return {
      companyLogo:   quotation.projectDetails?.companyLogo    || "",
      companyName:   quotation.projectDetails?.companyName    || "Your Company",
      companyPhone:  quotation.projectDetails?.companyPhone   || "",
      companyEmail:  quotation.projectDetails?.companyEmail   || "",
      clientName:    quotation.projectDetails?.clientName     || "Client Name",
      clientAddress: quotation.projectDetails?.clientAddress  || "",
      projectName:   quotation.projectDetails?.projectName    || "",
      quotationNo:   quotation.projectDetails?.referenceNo    || `QTN-${Math.floor(Math.random() * 10000)}`,
      date:          formatDate(quotation.projectDetails?.date) || formatDate(new Date().toISOString()),
      subject:       quotation.projectDetails?.subject        || "", 
      paintBrand:    quotation.projectDetails?.paintBrand     || "", // 🔥 Brand Specification mapped here

      sections: formattedSections,
      items: formattedSections.length > 0 ? formattedSections[0].items : [],

      subtotal:   formatNum(totals.subtotal),
      discount:   formatNum(totals.discountAmount),
      tax:        formatNum(totals.taxAmount),
      grandTotal: formatNum(totals.finalAmount),

      // 🔥 ALL FIELDS ADDED HERE:
      warranty: quotation.pricing?.warranty || "",
      startDate: formatDate(quotation.timeline?.startDate),
      endDate: formatDate(quotation.timeline?.endDate),
      scopeOfWork: quotation.textAreas?.scopeOfWork || "",
      exclusions: quotation.textAreas?.exclusions || "",
      validity: quotation.validity || "",
      
      terms: quotation.textAreas?.termsConditions
        ? quotation.textAreas.termsConditions.split("\n").filter((t) => t.trim())
        : [
            "Payment should be made 50% in advance.",
            "Work will commence upon receiving the advance.",
          ],

      paymentSteps: [
        { label: quotation.paymentTerms?.step1 || "Advance", percent: quotation.paymentPercents?.p1 || "0" },
        { label: quotation.paymentTerms?.step2 || "Mid Work", percent: quotation.paymentPercents?.p2 || "0" },
        { label: quotation.paymentTerms?.step3 || "Completion", percent: quotation.paymentPercents?.p3 || "0" },
      ],

      bankDetails: {
        bankName:   quotation.bankDetails?.bankName      || "", // 🔥 Fixed default to ""
        accHolder:  quotation.bankDetails?.accountHolder || "",
        accNo:      quotation.bankDetails?.accountNumber || "",
        ifsc:       quotation.bankDetails?.ifscCode      || "",
        branch:     quotation.bankDetails?.branch        || "",
      },

      signature: {
        name: quotation.signature?.name || "",
        designation: quotation.signature?.designation || "",
        phone: quotation.signature?.phone || "",
        email: quotation.signature?.email || ""
      }
    };
  }, [quotation, totals]);

  // ── Template renderer ──
  const renderTemplate = () => {
    if (!mappedData) return null;
    const props = { data: mappedData };

    switch (selectedTemplate) {
      case "modern":    return <ModernTemplate    {...props} />;
      case "corporate": return <CorporateTemplate {...props} />;
      case "compact":   return <CompactTemplate   {...props} />;
      case "creative":  return <CreativeTemplate  {...props} />;
      case "grouped":   return <GroupedTemplate   {...props} />;
      case "obsidian":  return <ObsidianTemplate  {...props} />;
      case "sovereign": return <SovereignTemplate {...props} />;
      case "aurora":    return <AuroraTemplate    {...props} />;
      case "classic":
      default:          return <ClassicTemplate   {...props} />;
    }
  };

  // ── Loading screen ──
  if (isLoading || !quotation) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex ml-[250px] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-900 selection:bg-blue-200 flex">

      {/* ── Global print styles ── */}
      <style>{`
        @media print {
          @page { margin: 15mm; }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white;
          }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
          .print-break-before { break-before: page; page-break-before: always; }
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* ── Sidebar (hidden on print) ── */}
      <div className="print:hidden w-[250px] shrink-0 z-30 shadow-lg border-r border-slate-800/60 bg-[#0B1120]">
        <Sidebar
          active="preview"
          user={user}
          goToDashboard={goToDashboard}
          goToCreate={goToCreate || goBack}
          goToPreview={() => {}}
          goToExport={goToExport}
          goToSubscription={goToSubscription}
          goToSettings={goToSettings}
          goToHelp={goToHelp}
          goToEditProfile={goToEditProfile}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative print:h-auto print:block print:overflow-visible">

        {/* Template selector toolbar */}
        <TemplateSelector
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          onPrint={() => window.print()}
          onExport={goToExport}
          onEdit={goBack}
        />

        {/* Document canvas */}
        <div className="flex-1 overflow-y-auto py-12 flex justify-center bg-slate-200 print:bg-white print:py-0 print:block print:overflow-visible no-scrollbar">
          <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:w-full print:max-w-none print:min-h-0 transition-all duration-500">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}