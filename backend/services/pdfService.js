import puppeteer from "puppeteer";

/**
 * Generate Quotation PDF using Puppeteer
 * Supported templates:
 * classic | modern | corporate | compact | creative | grouped
 * obsidian | sovereign | aurora
 *
 * @param {Object} quotation    - Full MongoDB document
 * @param {Object} res          - Express Response (or Writable stream for email)
 * @param {String} templateName - Template slug
 */
export const generateQuotationPDF = async (
  quotation,
  res,
  templateName = "classic"
) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-gpu", // 🔥 Extra safety
        "--no-zygote",   // 🔥 Extra safety
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    const page = await browser.newPage();
    const tName = templateName.toLowerCase();

    // ─────────────────────────────────────────
    // 🛠  SHARED UTILITIES
    // ─────────────────────────────────────────
    const safeFormat = (val) => {
      const num = Number(val);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    // ─────────────────────────────────────────
    // 🔢  DATA PREPARATION
    // ─────────────────────────────────────────
    const rawSections =
      quotation.rateSections?.length > 0
        ? quotation.rateSections
        : [{ title: "Material & Labour Rates", rows: quotation.rateTable || [] }];

    const sections = rawSections.map((sec) => {
      const rows = sec.rows || [];
      const sectionTotal = rows.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
      return {
        title: sec.title || "Material & Labour Rates",
        items: rows.map((r) => ({
          desc:     r.work || r.workDescription || r.description || "-",
          labour:   safeFormat(r.labour),
          material: safeFormat(r.material),
          total:    safeFormat(r.total),
        })),
        sectionTotal: safeFormat(sectionTotal),
      };
    });

    const calculatedSubtotal = sections.reduce(
      (acc, s) => acc + Number(s.sectionTotal),
      0
    );
    const discountPercent = Number(quotation.pricing?.discount) || 0;
    const discountAmount  = (calculatedSubtotal * discountPercent) / 100;
    const tax             = Number(quotation.pricing?.tax) || 0;
    const grandTotal =
      quotation.pricing?.grandTotal || calculatedSubtotal - discountAmount + tax;

    const q = {
      companyLogo:    quotation.projectDetails?.companyLogo   || "",
      companyName:    quotation.projectDetails?.companyName   || "Your Company",
      companyPhone:   quotation.projectDetails?.companyPhone  || "",
      companyEmail:   quotation.projectDetails?.companyEmail  || "",
      clientName:     quotation.projectDetails?.clientName    || "Client Name",
      clientAddress:  quotation.projectDetails?.clientAddress || "",
      subject:        quotation.projectDetails?.subject       || "", // 🔥 Added Subject Line
      quotationNo:    quotation.projectDetails?.referenceNo   || `QTN-${Math.floor(Math.random() * 10000)}`,
      date:           formatDate(quotation.projectDetails?.date),
      sections,
      subtotal:        safeFormat(calculatedSubtotal),
      discountAmount:  safeFormat(discountAmount),
      discountPercent,
      tax:             safeFormat(tax),
      grandTotal:      safeFormat(grandTotal),
      terms: quotation.textAreas?.termsConditions
        ? quotation.textAreas.termsConditions.split("\n").filter((t) => t.trim())
        : [
            "Payment should be made 50% in advance.",
            "Work will commence upon receiving the advance.",
          ],
      bankName:  quotation.bankDetails?.bankName        || "-",
      accNo:     quotation.bankDetails?.accountNumber   || "-",
      ifsc:      quotation.bankDetails?.ifscCode        || "-",
      accHolder: quotation.bankDetails?.accountHolder   || "",
    };

    // ─────────────────────────────────────────
    // 🎨  BASE <head> (Tailwind + Inter/Merriweather)
    // ─────────────────────────────────────────
    const baseHead = `
      <head>
        <meta charset="UTF-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:wght@400;700;900&display=swap');
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          body { margin: 0; padding: 0; background: white; }
          .font-sans  { font-family: 'Inter', sans-serif !important; }
          .font-serif { font-family: 'Merriweather', serif !important; }
          .page-break { break-inside: avoid; page-break-inside: avoid; }
        </style>
      </head>`;

    // Premium fonts head (for Obsidian / Sovereign / Aurora)
    const premiumHead = `
      <head>
        <meta charset="UTF-8"/>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          .page-break { break-inside: avoid; page-break-inside: avoid; }
        </style>
      </head>`;

    // ─────────────────────────────────────────
    // 🧱  SHARED SECTION TABLE HELPER (Classic)
    // ─────────────────────────────────────────
    const buildSectionsHTML = ({
      headerBg           = "#1e293b",
      headerText         = "#ffffff",
      borderColor        = "#e2e8f0",
      rowStripeBg        = "#f8fafc",
      categoryLabelColor = "#94a3b8",
      categoryValueColor = "#4f46e5",
    } = {}) =>
      q.sections
        .map(
          (sec) => `
        <div class="page-break" style="margin-bottom:2.5rem;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <h4 style="font-size:10px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:.15em;white-space:nowrap;margin:0;">${sec.title}</h4>
            <div style="height:1px;flex:1;background:${borderColor};"></div>
          </div>
          <table style="width:100%;border-collapse:collapse;border:1px solid ${borderColor};">
            <thead>
              <tr style="background:${headerBg};">
                <th style="padding:12px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${headerText};">Description of Work</th>
                <th style="padding:12px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${headerText};width:90px;">Labour</th>
                <th style="padding:12px 16px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${headerText};width:90px;">Material</th>
                <th style="padding:12px 16px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${headerText};width:110px;">Total</th>
              </tr>
            </thead>
            <tbody style="background:white;">
              ${sec.items
                .map(
                  (item, i) => `
                <tr style="border-bottom:1px solid ${borderColor};background:${
                  i % 2 === 1 ? rowStripeBg : "white"
                };">
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#1e293b;white-space:pre-wrap;">${item.desc}</td>
                  <td style="padding:12px 16px;font-size:13px;color:#64748b;text-align:center;">${item.labour}</td>
                  <td style="padding:12px 16px;font-size:13px;color:#64748b;text-align:center;">${item.material}</td>
                  <td style="padding:12px 16px;font-size:13px;font-weight:800;color:#0f172a;text-align:right;">₹ ${item.total}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div style="text-align:right;margin-top:8px;">
            <span style="font-size:10px;font-weight:800;color:${categoryLabelColor};text-transform:uppercase;letter-spacing:.15em;margin-right:12px;">Category Total:</span>
            <span style="font-size:13px;font-weight:700;color:${categoryValueColor};">₹ ${sec.sectionTotal}</span>
          </div>
        </div>`
        )
        .join("");

    // ─────────────────────────────────────────────────────────────────────
    //  TEMPLATE HTML BUILDERS
    // ─────────────────────────────────────────────────────────────────────

    // ── 1. CLASSIC ───────────────────────────────────────────────────────
    const classicHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-sans" style="background:white;padding:48px;color:#1e293b;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;" class="page-break">
        <div style="display:flex;align-items:flex-start;gap:16px;">
          ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:64px;height:64px;object-fit:contain;border-radius:8px;" />` : `<div style="width:64px;height:64px;background:#f1f5f9;border-radius:8px;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:22px;color:#94a3b8;">🏢</div>`}
          <div>
            <h1 style="font-size:22px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 8px;">${q.companyName}</h1>
            <p style="font-size:13px;color:#64748b;margin:2px 0;">${q.companyPhone}</p>
            <p style="font-size:13px;color:#64748b;margin:2px 0;">${q.companyEmail}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <h2 style="font-size:28px;font-weight:900;color:#1e293b;text-transform:uppercase;letter-spacing:.15em;margin:0 0 16px;">Quotation</h2>
          <div style="font-size:12px;display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
            <div style="display:flex;gap:16px;"><span style="font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;">Date:</span><span style="font-weight:600;color:#1e293b;">${q.date}</span></div>
            <div style="display:flex;gap:16px;"><span style="font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;">Ref No:</span><span style="font-weight:600;color:#1e293b;">${q.quotationNo}</span></div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin-bottom:32px;" />
      
      <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:24px;margin-bottom:24px;" class="page-break">
        <p style="font-size:10px;font-weight:900;color:#4f46e5;text-transform:uppercase;letter-spacing:.2em;margin:0 0 8px;">Quotation For:</p>
        <h3 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 4px;">${q.clientName}</h3>
        <p style="font-size:13px;color:#64748b;margin:0;">${q.clientAddress}</p>
      </div>

      ${q.subject ? `
      <div style="background:#f0f7ff; border-left:4px solid #2563eb; padding:16px; margin-bottom:32px; border-radius: 0 8px 8px 0;" class="page-break">
        <p style="font-size:13px; font-weight:700; color:#1e40af; margin:0;">
          <span style="text-transform:uppercase; letter-spacing:.1em; margin-right:8px; opacity:.7;">Subject:</span>
          ${q.subject}
        </p>
      </div>` : ""}

      ${buildSectionsHTML({ headerBg: "#1e293b", categoryValueColor: "#4f46e5" })}
      
      <div style="display:flex;justify-content:flex-end;margin-bottom:48px;" class="page-break">
        <div style="width:320px;background:#1e293b;color:white;border-radius:16px;padding:24px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;opacity:.7;margin-bottom:12px;"><span>Subtotal</span><span>₹ ${q.subtotal}</span></div>
          ${Number(q.discountAmount) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#6ee7b7;margin-bottom:12px;"><span>Discount</span><span>- ₹ ${q.discountAmount}</span></div>` : ""}
          ${Number(q.tax) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;opacity:.7;margin-bottom:12px;"><span>Tax</span><span>₹ ${q.tax}</span></div>` : ""}
          <div style="height:1px;background:rgba(255,255,255,.15);margin:8px 0 16px;"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <span style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.2em;">Grand Total</span>
            <span style="font-size:24px;font-weight:900;">₹ ${q.grandTotal}</span>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:1px solid #f1f5f9;padding-top:40px;" class="page-break">
        <div>
          <h4 style="font-size:11px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.15em;margin:0 0 16px;">Terms &amp; Conditions</h4>
          <ul style="list-style:none;padding:0;margin:0;">
            ${q.terms.map((t, i) => `<li style="display:flex;gap:8px;font-size:13px;color:#64748b;margin-bottom:12px;line-height:1.6;"><span style="color:#4f46e5;font-weight:700;">${i + 1}.</span><span>${t}</span></li>`).join("")}
          </ul>
        </div>
        <div style="background:#f8fafc;border-radius:16px;padding:24px;border:1px solid #f1f5f9;">
          <h4 style="font-size:11px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;margin:0 0 20px;">Payment Information</h4>
          ${[["Bank", q.bankName], ["A/C No", q.accNo], ["IFSC", q.ifsc], ...(q.accHolder ? [["Holder", q.accHolder]] : [])].map(([l, v]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-bottom:12px;font-size:13px;"><span style="color:#94a3b8;text-transform:uppercase;font-size:11px;letter-spacing:.1em;">${l}</span><span style="font-weight:700;color:#1e293b;">${v}</span></div>`).join("")}
        </div>
      </div>
    </body></html>`;

    // ── 2. MODERN (Updated to VisionX Premium) ───────────────────────────
    const modernHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-sans" style="background:white;padding:0;color:#0f172a;border-top:12px solid #2563eb;">
      <div style="padding:48px 56px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f1f5f9;padding-bottom:32px;margin-bottom:40px;" class="page-break">
          <div>
            ${q.companyLogo ? `<img src="${q.companyLogo}" style="height:64px;margin-bottom:20px;object-fit:contain;border-radius:8px;" />` : ""}
            <h1 style="font-size:36px;font-weight:900;color:#0f172a;letter-spacing:-.04em;text-transform:uppercase;margin:0 0 8px;">${q.companyName}</h1>
            <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0;">${q.companyPhone}</p>
            <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0;">${q.companyEmail}</p>
          </div>
          <div style="text-align:right;">
            <h2 style="font-size:42px;font-weight:900;color:#eff6ff;text-transform:uppercase;letter-spacing:.15em;margin:0 0 24px;">Quotation</h2>
            <div style="display:inline-flex;gap:24px;background:#f8fafc;border:1px solid #f1f5f9;padding:8px 16px;border-radius:12px;">
              <div style="text-align:left;">
                <p style="font-size:9px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.1em;margin:0 0 2px;">Quote No.</p>
                <p style="font-size:14px;font-weight:900;color:#0f172a;margin:0;">${q.quotationNo}</p>
              </div>
              <div style="width:1px;background:#e2e8f0;"></div>
              <div style="text-align:left;">
                <p style="font-size:9px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.1em;margin:0 0 2px;">Date</p>
                <p style="font-size:14px;font-weight:900;color:#0f172a;margin:0;">${q.date}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:24px;padding:24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;" class="page-break">
          <div>
            <p style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.15em;margin:0 0 8px;">Quote For</p>
            <h3 style="font-size:24px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 6px;">${q.clientName}</h3>
            <p style="font-size:12px;font-weight:700;color:#64748b;margin:0;max-width:300px;line-height:1.5;">${q.clientAddress}</p>
          </div>
        </div>

        ${q.subject ? `
        <div style="background:#f0f7ff; padding:16px 24px; margin-bottom:32px; border-radius:12px; border-left:4px solid #2563eb;" class="page-break">
          <p style="font-size:13px; font-weight:700; color:#1e40af; margin:0;">
            <span style="text-transform:uppercase; letter-spacing:.1em; margin-right:8px; opacity:.7;">Subject:</span>
            ${q.subject}
          </p>
        </div>` : ""}

        ${q.sections.map((sec) => `
          <div class="page-break" style="margin-bottom:40px;">
            <h4 style="font-size:11px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.2em;margin:0 0 16px;display:flex;align-items:center;gap:12px;">
              ${sec.title} <span style="flex:1;height:1px;background:#dbeafe;"></span>
            </h4>
            <div style="border:2px solid #f1f5f9;border-radius:16px;overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f8fafc;border-bottom:2px solid #f1f5f9;">
                    <th style="padding:16px 24px;text-align:left;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;width:50%;">Description of Work</th>
                    <th style="padding:16px 24px;text-align:center;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Labour</th>
                    <th style="padding:16px 24px;text-align:center;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Material</th>
                    <th style="padding:16px 24px;text-align:right;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${sec.items.map((item) => `
                    <tr style="border-bottom:1px solid #f1f5f9;background:white;">
                      <td style="padding:20px 24px;font-size:12px;font-weight:700;color:#1e293b;white-space:pre-wrap;">${item.desc}</td>
                      <td style="padding:20px 24px;font-size:12px;font-weight:700;color:#64748b;text-align:center;background:#f8fafc;">${item.labour}</td>
                      <td style="padding:20px 24px;font-size:12px;font-weight:700;color:#64748b;text-align:center;">${item.material}</td>
                      <td style="padding:20px 24px;font-size:14px;font-weight:900;color:#0f172a;text-align:right;background:#eff6ff;">₹ ${item.total}</td>
                    </tr>`).join("")}
                  <tr style="background:#1e293b;">
                    <td colspan="3" style="padding:16px 24px;text-align:right;font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;">Category Total</td>
                    <td style="padding:16px 24px;text-align:right;font-size:16px;font-weight:900;color:#93c5fd;">₹ ${sec.sectionTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `).join("")}

        <div style="display:flex;gap:32px;border-top:2px solid #f1f5f9;padding-top:40px;margin-bottom:48px;" class="page-break">
          <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;padding:32px;border-radius:24px;">
            <h4 style="font-size:10px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.15em;margin:0 0 20px;">Payment Details</h4>
            <div style="display:flex;flex-direction:column;gap:12px;font-size:11px;font-weight:700;color:#64748b;">
              ${[["Bank Name", q.bankName], ["Account No", q.accNo], ["IFSC Code", q.ifsc], ...(q.accHolder ? [["Holder Name", q.accHolder]] : [])]
                .map(([l, v]) => `
                <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                  <span style="text-transform:uppercase;letter-spacing:.1em;">${l}</span>
                  <span style="font-weight:900;color:#0f172a;">${v}</span>
                </div>`).join("")}
            </div>
          </div>
          <div style="width:320px;background:#2563eb;color:white;padding:32px;border-radius:24px;">
            <h4 style="font-size:10px;font-weight:900;color:#bfdbfe;text-transform:uppercase;letter-spacing:.15em;margin:0 0 24px;">Billing Summary</h4>
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:16px;">
              <span style="color:#dbeafe;text-transform:uppercase;letter-spacing:.1em;">Subtotal</span>
              <span>₹ ${q.subtotal}</span>
            </div>
            ${Number(q.discountAmount) > 0 ? `
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:16px;">
              <span style="color:#dbeafe;text-transform:uppercase;letter-spacing:.1em;">Discount</span>
              <span style="color:#6ee7b7;">- ₹ ${q.discountAmount}</span>
            </div>` : ""}
            ${Number(q.tax) > 0 ? `
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:24px;">
              <span style="color:#dbeafe;text-transform:uppercase;letter-spacing:.1em;">Tax</span>
              <span>₹ ${q.tax}</span>
            </div>` : ""}
            <div style="border-top:2px solid rgba(255,255,255,0.2);padding-top:24px;display:flex;justify-content:space-between;align-items:flex-end;">
              <span style="font-size:10px;font-weight:900;color:#bfdbfe;text-transform:uppercase;letter-spacing:.15em;">Grand Total</span>
              <span style="font-size:28px;font-weight:900;letter-spacing:-.02em;">₹ ${q.grandTotal}</span>
            </div>
          </div>
        </div>

        <div class="page-break">
          <h4 style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;margin:0 0 16px;">Terms &amp; Conditions</h4>
          <ul style="list-style:none;padding:0;margin:0;">
            ${q.terms.map((t, i) => `
              <li style="display:flex;gap:12px;font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;line-height:1.6;">
                <span style="color:#cbd5e1;">${i + 1}.</span> ${t}
              </li>`).join("")}
          </ul>
        </div>
      </div>
    </body></html>`;

    // ── 3. CORPORATE ─────────────────────────────────────────────────────
    const corporateHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-serif" style="background:white;padding:56px;color:#0f172a;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:24px;margin-bottom:32px;" class="page-break">
        <div style="display:flex;align-items:center;gap:20px;">
          ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:80px;height:80px;object-fit:contain;" />` : `<div style="width:80px;height:80px;background:#0f172a;display:flex;align-items:center;justify-content:center;font-size:32px;color:white;">🏛️</div>`}
          <div>
            <h1 style="font-size:28px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.05em;font-family:Inter,sans-serif;margin:0 0 8px;">${q.companyName}</h1>
            <div style="font-size:13px;color:#475569;font-family:Inter,sans-serif;display:flex;gap:16px;"><span>📞 ${q.companyPhone}</span><span>✉️ ${q.companyEmail}</span></div>
          </div>
        </div>
        <div style="text-align:right;">
          <h2 style="font-size:36px;font-weight:300;color:#cbd5e1;text-transform:uppercase;letter-spacing:.2em;margin:0 0 16px;">Quotation</h2>
          <div style="font-size:13px;font-family:Inter,sans-serif;color:#475569;line-height:1.8;">
            <p style="margin:0;"><strong style="color:#0f172a;display:inline-block;width:80px;text-align:right;padding-right:12px;">Date:</strong>${q.date}</p>
            <p style="margin:0;"><strong style="color:#0f172a;display:inline-block;width:80px;text-align:right;padding-right:12px;">Ref:</strong>${q.quotationNo}</p>
          </div>
        </div>
      </div>
      
      <div style="border:1px solid #cbd5e1;padding:24px;margin-bottom:24px;background:#f8fafc;position:relative;" class="page-break">
        <span style="position:absolute;top:-10px;left:24px;background:#f8fafc;padding:0 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.15em;font-family:Inter,sans-serif;">Prepared For</span>
        <h3 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 8px;">${q.clientName}</h3>
        <p style="font-size:13px;color:#475569;font-family:Inter,sans-serif;margin:0;">${q.clientAddress}</p>
      </div>

      ${q.subject ? `
      <div style="background:#f1f5f9; padding:16px 24px; margin-bottom:40px; border-left:4px solid #0f172a;" class="page-break">
        <p style="font-size:13px; font-weight:700; color:#0f172a; margin:0; font-family:Inter,sans-serif;">
          <span style="text-transform:uppercase; letter-spacing:.1em; margin-right:8px; color:#64748b;">Subject:</span>
          ${q.subject}
        </p>
      </div>` : ""}

      ${q.sections.map((sec) => `
        <div class="page-break" style="margin-bottom:40px;">
          <h4 style="font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.15em;font-family:Inter,sans-serif;margin:0 0 12px;display:flex;align-items:center;gap:16px;">${sec.title}<span style="flex:1;height:1px;background:#e2e8f0;display:inline-block;"></span></h4>
          <table style="width:100%;border-collapse:collapse;border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;font-family:Inter,sans-serif;">
            <thead><tr style="background:#f1f5f9;border-bottom:2px solid #cbd5e1;">
              <th style="padding:16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;width:40px;">No.</th>
              <th style="padding:16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;">Description</th>
              <th style="padding:16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;width:90px;">Labour</th>
              <th style="padding:16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;width:90px;">Material</th>
              <th style="padding:16px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;width:110px;">Total (₹)</th>
            </tr></thead>
            <tbody>
              ${sec.items.map((item, i) => `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:16px;text-align:center;color:#94a3b8;font-size:13px;">${String(i + 1).padStart(2, "0")}</td>
                  <td style="padding:16px;font-size:13px;font-weight:500;color:#1e293b;white-space:pre-wrap;">${item.desc}</td>
                  <td style="padding:16px;font-size:13px;color:#475569;text-align:center;">${item.labour}</td>
                  <td style="padding:16px;font-size:13px;color:#475569;text-align:center;">${item.material}</td>
                  <td style="padding:16px;font-size:13px;font-weight:700;color:#0f172a;text-align:right;">${item.total}</td>
                </tr>`).join("")}
              <tr style="background:#f8fafc;border-top:1px solid #cbd5e1;">
                <td colspan="4" style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.15em;border-right:1px solid #e2e8f0;">Category Total</td>
                <td style="padding:12px 16px;font-weight:700;color:#1e293b;text-align:right;">₹ ${sec.sectionTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>`).join("")}
      <div style="display:flex;justify-content:flex-end;margin-bottom:48px;" class="page-break">
        <div style="width:300px;border:1px solid #cbd5e1;padding:24px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;margin-bottom:16px;"><span>Subtotal</span><span style="font-weight:600;color:#1e293b;">₹ ${q.subtotal}</span></div>
          ${Number(q.discountAmount) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#15803d;margin-bottom:16px;"><span>Discount</span><span style="font-weight:600;">- ₹ ${q.discountAmount}</span></div>` : ""}
          ${Number(q.tax) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;margin-bottom:16px;"><span>Tax</span><span style="font-weight:600;color:#1e293b;">₹ ${q.tax}</span></div>` : ""}
          <div style="border-top:2px solid #0f172a;padding-top:16px;display:flex;justify-content:space-between;align-items:flex-end;">
            <span style="font-size:12px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.15em;">Total</span>
            <span style="font-size:24px;font-weight:700;color:#0f172a;">₹ ${q.grandTotal}</span>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:7fr 5fr;gap:32px;border-top:2px solid #f1f5f9;padding-top:32px;font-family:Inter,sans-serif;" class="page-break">
        <div>
          <h4 style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;margin:0 0 16px;">Terms &amp; Conditions</h4>
          <ol style="padding-left:16px;margin:0;">${q.terms.map((t) => `<li style="font-size:13px;color:#475569;margin-bottom:8px;line-height:1.7;">${t}</li>`).join("")}</ol>
        </div>
        <div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;margin-bottom:32px;">
            <h4 style="font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.15em;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #e2e8f0;">Payment Details</h4>
            ${[["Bank", q.bankName], ["A/C No.", q.accNo], ["IFSC", q.ifsc], ...(q.accHolder ? [["Holder", q.accHolder]] : [])].map(([l, v]) => `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px;"><span style="color:#64748b;">${l}</span><span style="font-weight:600;color:#1e293b;">${v}</span></div>`).join("")}
          </div>
          <div style="padding-top:40px;text-align:right;border-top:1px solid #e2e8f0;">
            <div style="width:180px;border-bottom:1px solid #94a3b8;margin-left:auto;margin-bottom:8px;"></div>
            <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.15em;margin:0;">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </body></html>`;

    // ── 4. COMPACT (Updated to VisionX Premium) ──────────────────────────
    const compactHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-sans" style="background:white;padding:40px 48px;color:#0f172a;border-top:12px solid #059669;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;border-bottom:2px solid rgba(5,150,105,0.2);padding-bottom:24px;margin-bottom:24px;" class="page-break">
        <div style="display:flex;align-items:center;gap:16px;">
          ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:6px;" />` : ""}
          <div>
            <h1 style="font-size:24px;font-weight:900;color:#064e3b;text-transform:uppercase;margin:0 0 6px;letter-spacing:-.02em;">${q.companyName}</h1>
            <p style="font-size:11px;font-weight:700;color:#64748b;margin:0;letter-spacing:.05em;">${q.companyPhone}</p>
            <p style="font-size:11px;font-weight:700;color:#64748b;margin:0;letter-spacing:.05em;">${q.companyEmail}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <h2 style="font-size:24px;font-weight:900;color:#1e293b;text-transform:uppercase;letter-spacing:.15em;margin:0 0 8px;">QUOTATION</h2>
          <table style="margin-left:auto;font-size:11px;">
            <tr><td style="font-weight:700;color:#94a3b8;text-transform:uppercase;padding-right:16px;text-align:right;letter-spacing:.1em;padding-bottom:4px;">Quote No:</td><td style="font-weight:900;color:#0f172a;padding-bottom:4px;">${q.quotationNo}</td></tr>
            <tr><td style="font-weight:700;color:#94a3b8;text-transform:uppercase;padding-right:16px;text-align:right;letter-spacing:.1em;">Date:</td><td style="font-weight:900;color:#0f172a;">${q.date}</td></tr>
          </table>
        </div>
      </div>

      <div style="background:rgba(248,250,252,0.8);border:1px solid rgba(226,232,240,0.6);border-radius:12px;padding:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;" class="page-break">
        <div>
          <p style="font-size:10px;font-weight:900;color:#059669;text-transform:uppercase;letter-spacing:.15em;margin:0 0 4px;">Bill To:</p>
          <h3 style="font-size:14px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.05em;margin:0 0 2px;">${q.clientName}</h3>
          <p style="font-size:12px;font-weight:600;color:#64748b;margin:0;">${q.clientAddress}</p>
        </div>
      </div>

      ${q.subject ? `
      <div style="background:#f0fdf4; padding:12px 16px; margin-bottom:32px; border-radius:8px; border-left:4px solid #059669;" class="page-break">
        <p style="font-size:12px; font-weight:700; color:#065f46; margin:0;">
          <span style="text-transform:uppercase; letter-spacing:.1em; margin-right:8px; opacity:.7;">Subject:</span>
          ${q.subject}
        </p>
      </div>` : ""}

      ${q.sections.map((sec) => `
        <div class="page-break" style="margin-bottom:32px;">
          <h4 style="font-size:11px;font-weight:900;color:#1e293b;text-transform:uppercase;letter-spacing:.15em;background:#f1f5f9;border:1px solid #e2e8f0;border-bottom:none;padding:8px 16px;border-radius:8px 8px 0 0;margin:0;display:inline-block;">${sec.title}</h4>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">
            <thead><tr style="background:#059669;color:white;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;">
              <th style="padding:10px 16px;border:1px solid #047857;width:40px;text-align:center;">#</th>
              <th style="padding:10px 16px;border:1px solid #047857;text-align:left;">Description of Work</th>
              <th style="padding:10px 16px;border:1px solid #047857;text-align:center;width:80px;">Labour</th>
              <th style="padding:10px 16px;border:1px solid #047857;text-align:center;width:80px;">Material</th>
              <th style="padding:10px 16px;border:1px solid #047857;text-align:right;width:100px;">Total</th>
            </tr></thead>
            <tbody>
              ${sec.items.map((item, i) => `
                <tr style="border-bottom:1px solid #e2e8f0;background:${i % 2 === 1 ? "rgba(248,250,252,0.5)" : "white"};">
                  <td style="padding:10px 16px;border-right:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8;font-weight:900;">${i + 1}</td>
                  <td style="padding:10px 16px;border-right:1px solid #e2e8f0;font-size:11px;font-weight:900;color:#334155;white-space:pre-wrap;line-height:1.5;">${item.desc}</td>
                  <td style="padding:10px 16px;border-right:1px solid #e2e8f0;font-size:11px;font-weight:900;text-align:center;color:#64748b;">${item.labour}</td>
                  <td style="padding:10px 16px;border-right:1px solid #e2e8f0;font-size:11px;font-weight:900;text-align:center;color:#64748b;">${item.material}</td>
                  <td style="padding:10px 16px;font-size:11px;font-weight:900;color:#0f172a;text-align:right;background:rgba(5,150,105,0.05);">₹ ${item.total}</td>
                </tr>`).join("")}
              <tr style="background:rgba(241,245,249,0.5);border-top:2px solid #e2e8f0;">
                <td colspan="4" style="padding:12px 16px;text-align:right;font-size:11px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.15em;border-right:1px solid #e2e8f0;">Category Total</td>
                <td style="padding:12px 16px;text-align:right;font-weight:900;font-size:12px;color:#047857;">₹ ${sec.sectionTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>`).join("")}

      <div style="display:flex;gap:24px;margin-bottom:32px;" class="page-break">
        <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:white;">
          <h4 style="font-size:10px;font-weight:900;color:#047857;text-transform:uppercase;letter-spacing:.15em;border-bottom:1px solid #f1f5f9;padding-bottom:6px;margin:0 0 12px;">Bank Account Details</h4>
          <table style="font-size:11px;width:100%;">
            ${[["Bank Name:", q.bankName], ["Account No:", q.accNo], ["IFSC Code:", q.ifsc], ...(q.accHolder ? [["Holder Name:", q.accHolder]] : [])].map(([l, v]) => `
              <tr>
                <td style="color:#94a3b8;font-weight:900;text-transform:uppercase;letter-spacing:.05em;padding-bottom:6px;width:110px;">${l}</td>
                <td style="font-weight:900;color:#0f172a;padding-bottom:6px;">${v}</td>
              </tr>`).join("")}
          </table>
        </div>
        <div style="width:280px;border:1px solid #059669;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;">
          <div style="padding:16px;background:rgba(5,150,105,0.05);flex:1;">
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:10px;"><span style="font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Subtotal</span><span style="font-weight:900;color:#0f172a;">₹ ${q.subtotal}</span></div>
            ${Number(q.discountAmount) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:10px;"><span style="font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Discount</span><span style="font-weight:900;color:#059669;">- ₹ ${q.discountAmount}</span></div>` : ""}
            ${Number(q.tax) > 0 ? `<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:10px;"><span style="font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Tax</span><span style="font-weight:900;color:#0f172a;">₹ ${q.tax}</span></div>` : ""}
          </div>
          <div style="background:#059669;padding:16px;color:white;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.2em;">Final Total</span>
            <span style="font-size:18px;font-weight:900;letter-spacing:-.02em;">₹ ${q.grandTotal}</span>
          </div>
        </div>
      </div>

      <div style="border-top:2px solid #f1f5f9;padding-top:20px;" class="page-break">
        <h4 style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.2em;margin:0 0 12px;">Terms &amp; Conditions</h4>
        <ul style="padding-left:16px;margin:0;">
          ${q.terms.map((t) => `<li style="font-size:10px;font-weight:600;color:#64748b;margin-bottom:6px;line-height:1.6;">${t}</li>`).join("")}
        </ul>
      </div>
    </body></html>`;

    // ── 5. CREATIVE (Updated to VisionX Premium) ─────────────────────────
    const creativeHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-sans" style="background:white;padding:0;color:#0f172a;">
      <div style="display:flex;min-height:220px;" class="page-break">
        <div style="background:#0f172a;color:white;flex:1;padding:40px;border-bottom-right-radius:80px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-40px;right:-40px;width:128px;height:128px;background:rgba(255,255,255,0.05);border-radius:50%;filter:blur(20px);"></div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;position:relative;z-index:1;">
            ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:12px;background:white;padding:4px;" />` : `<div style="width:48px;height:48px;background:#7e22ce;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">🎨</div>`}
            <h1 style="font-size:30px;font-weight:900;letter-spacing:-.02em;margin:0;">${q.companyName}</h1>
          </div>
          <p style="font-size:12px;font-weight:600;color:#cbd5e1;letter-spacing:.05em;margin:6px 0;position:relative;z-index:1;">${q.companyPhone}</p>
          <p style="font-size:12px;font-weight:600;color:#cbd5e1;letter-spacing:.05em;margin:6px 0;position:relative;z-index:1;">${q.companyEmail}</p>
        </div>
        <div style="flex:1;padding:40px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right;">
          <h2 style="font-size:48px;font-weight:900;color:#7e22ce;text-transform:uppercase;letter-spacing:-.04em;margin:0 0 20px;">Estimate</h2>
          <p style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;margin:0 0 2px;">Quote No.</p>
          <p style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 16px;">${q.quotationNo}</p>
          <p style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;margin:0 0 2px;">Date</p>
          <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0;">${q.date}</p>
        </div>
      </div>

      <div style="padding:24px 40px 40px;">
        
        <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:24px;padding:24px;display:inline-block;min-width:300px;margin-bottom:24px;" class="page-break">
          <p style="font-size:10px;font-weight:900;color:#7e22ce;text-transform:uppercase;letter-spacing:.15em;margin:0 0 8px;">Prepared For</p>
          <h3 style="font-size:20px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px;">${q.clientName}</h3>
          <p style="font-size:11px;font-weight:700;color:#64748b;margin:0;">${q.clientAddress}</p>
        </div>

        ${q.subject ? `
        <div style="background:#faf5ff; padding:16px 24px; margin-bottom:40px; border-radius:12px; border-left:4px solid #7e22ce;" class="page-break">
          <p style="font-size:13px; font-weight:700; color:#581c87; margin:0;">
            <span style="text-transform:uppercase; letter-spacing:.1em; margin-right:8px; opacity:.7;">Subject:</span>
            ${q.subject}
          </p>
        </div>` : ""}

        ${q.sections.map((sec) => `
          <div class="page-break" style="margin-bottom:40px;">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
              <span style="font-size:10px;font-weight:900;color:#7e22ce;text-transform:uppercase;letter-spacing:.2em;background:#faf5ff;padding:8px 16px;border-radius:12px;">${sec.title}</span>
              <div style="flex:1;border-bottom:1px dashed #cbd5e1;"></div>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="padding:0 8px 12px;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.15em;text-align:left;border-bottom:2px solid #0f172a;">Description</th>
                  <th style="padding:0 8px 12px;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.15em;text-align:center;width:90px;border-bottom:2px solid #0f172a;">Labour</th>
                  <th style="padding:0 8px 12px;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.15em;text-align:center;width:90px;border-bottom:2px solid #0f172a;">Material</th>
                  <th style="padding:0 8px 12px;font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.15em;text-align:right;width:128px;border-bottom:2px solid #0f172a;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${sec.items.map((item) => `
                  <tr style="border-bottom:1px dashed #e2e8f0;">
                    <td style="padding:16px 8px;font-size:11px;font-weight:700;color:#1e293b;white-space:pre-wrap;">${item.desc}</td>
                    <td style="padding:16px 8px;font-size:11px;font-weight:700;color:#64748b;text-align:center;">${item.labour}</td>
                    <td style="padding:16px 8px;font-size:11px;font-weight:700;color:#64748b;text-align:center;">${item.material}</td>
                    <td style="padding:16px 8px;font-size:14px;font-weight:900;color:#0f172a;text-align:right;">₹ ${item.total}</td>
                  </tr>`).join("")}
                <tr style="background:#f8fafc;">
                  <td colspan="3" style="padding:12px 8px;text-align:right;font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.15em;">Category Total</td>
                  <td style="padding:12px 8px;text-align:right;font-size:14px;font-weight:900;color:#7e22ce;">₹ ${sec.sectionTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>`).join("")}

        <div style="display:flex;justify-content:flex-end;margin-bottom:40px;" class="page-break">
          <div style="width:320px;">
            <div style="display:flex;justify-content:space-between;padding:0 8px;margin-bottom:10px;font-size:11px;font-weight:700;">
              <span style="color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Subtotal</span>
              <span style="color:#0f172a;">₹ ${q.subtotal}</span>
            </div>
            ${Number(q.discountAmount) > 0 ? `
            <div style="display:flex;justify-content:space-between;padding:0 8px;margin-bottom:10px;font-size:11px;font-weight:700;">
              <span style="color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Discount</span>
              <span style="color:#10b981;">- ₹ ${q.discountAmount}</span>
            </div>` : ""}
            ${Number(q.tax) > 0 ? `
            <div style="display:flex;justify-content:space-between;padding:0 8px;margin-bottom:16px;font-size:11px;font-weight:700;">
              <span style="color:#64748b;text-transform:uppercase;letter-spacing:.1em;">Tax</span>
              <span style="color:#0f172a;">₹ ${q.tax}</span>
            </div>` : ""}
            <div style="background:#0f172a;border-radius:16px;padding:20px;color:white;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.2em;opacity:.9;">Total Payable</span>
              <span style="font-size:24px;font-weight:900;">₹ ${q.grandTotal}</span>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:1px solid #f1f5f9;padding-top:32px;" class="page-break">
          <div>
            <h4 style="font-size:10px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.2em;margin:0 0 16px;">Terms &amp; Conditions</h4>
            ${q.terms.map((t, i) => `
              <div style="display:flex;gap:8px;font-size:11px;font-weight:600;color:#64748b;margin-bottom:8px;line-height:1.6;">
                <span style="color:#a855f7;font-weight:900;">${i + 1}.</span><span>${t}</span>
              </div>`).join("")}
          </div>
          <div style="background:#f8fafc;border-radius:24px;padding:24px;border:1px solid #f1f5f9;">
            <h4 style="font-size:10px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.2em;margin:0 0 16px;">Transfer Details</h4>
            ${[["Bank Name", q.bankName], ["Account No", q.accNo], ["IFSC Code", q.ifsc], ...(q.accHolder ? [["Name", q.accHolder]] : [])]
              .map(([l, v]) => `
              <div style="display:flex;justify-content:space-between;border-bottom:1px dashed #e2e8f0;padding-bottom:8px;margin-bottom:8px;font-size:11px;">
                <span style="color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.1em;">${l}</span>
                <span style="font-weight:900;color:#0f172a;letter-spacing:.05em;">${v}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </body></html>`;

    // ── 6. GROUPED (Updated to VisionX Premium) ──────────────────────────
    const groupedHTML = () => `<!DOCTYPE html><html>${baseHead}<body class="font-serif" style="background:white;padding:48px;color:#0f172a;border-top:16px solid #0f172a;">
      <div style="text-align:center;border-bottom:3px solid #0f172a;padding-bottom:32px;margin-bottom:40px;" class="page-break">
        ${q.companyLogo ? `<img src="${q.companyLogo}" style="height:64px;margin:0 auto 16px;display:block;object-fit:contain;border-radius:6px;" />` : ""}
        <h1 style="font-size:30px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;color:#0f172a;margin:0 0 8px;font-family:Inter,sans-serif;">${q.companyName}</h1>
        <p style="font-size:11px;font-family:Inter,sans-serif;font-weight:700;letter-spacing:.1em;color:#64748b;text-transform:uppercase;margin:0;">${q.companyPhone} <span style="margin:0 8px;color:#cbd5e1;">|</span> ${q.companyEmail}</p>
      </div>

      <div style="font-family:Inter,sans-serif;margin-bottom:40px;" class="page-break">
        <div style="display:flex;justify-content:space-between;margin-bottom:32px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #f1f5f9;padding-bottom:16px;">
          <p style="margin:0;">Date: <span style="color:#0f172a;margin-left:4px;">${q.date}</span></p>
          <p style="margin:0;">Ref: <span style="color:#0f172a;margin-left:4px;">${q.quotationNo}</span></p>
        </div>
        <div style="font-family:Merriweather,serif;font-size:15px;line-height:1.6;color:#1e293b;">
          <p style="font-weight:700;color:#0f172a;margin:0 0 16px;">Dear Sir/Madam,</p>
          <div style="background:#f8fafc;padding:16px;border-left:4px solid #0f172a;margin-bottom:24px;font-family:Inter,sans-serif;">
            <p style="font-weight:700;font-size:14px;color:#0f172a;text-transform:uppercase;letter-spacing:.05em;margin:0;">
              <span style="color:#64748b;margin-right:8px;">Subject:</span> ${q.subject || `Quote for ${q.clientName}, ${q.clientAddress}`}
            </p>
          </div>
          <p style="font-size:14px;font-weight:500;color:#334155;margin:0;">Thank you for your enquiry. Please find below our quotation for Material & Labour for this site.</p>
        </div>
      </div>

      <div style="margin-bottom:48px;">
        ${q.sections.map((sec) => `
          <div style="margin-bottom:48px;">
            <h2 style="font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#0f172a;border-bottom:2px solid #cbd5e1;padding-bottom:8px;margin-bottom:24px;font-family:Inter,sans-serif;" class="page-break">${sec.title}</h2>
            ${sec.items.map((item) => `
              <div class="page-break" style="margin-bottom:32px;">
                <h3 style="font-size:13px;font-weight:700;color:#0f172a;border-left:3px solid #0f172a;padding:8px 12px;background:#f8fafc;margin:0 0 12px;font-family:Inter,sans-serif;text-transform:uppercase;letter-spacing:.05em;white-space:pre-wrap;">${item.desc}</h3>
                <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;font-family:Inter,sans-serif;font-size:12px;">
                  <thead>
                    <tr style="background:#f1f5f9;border-bottom:1px solid #e2e8f0;">
                      <th style="padding:10px 16px;text-align:left;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;width:66%;">Work &amp; Material Breakdown</th>
                      <th style="padding:10px 16px;text-align:right;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;width:33%;">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:12px 16px;color:#475569;vertical-align:top;"><span style="font-weight:700;color:#0f172a;text-transform:uppercase;font-size:10px;letter-spacing:.1em;margin-right:8px;">Labour Cost:</span> Execution and application.</td>
                      <td style="padding:12px 16px;text-align:right;color:#334155;font-weight:600;vertical-align:top;">${item.labour}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:12px 16px;color:#475569;vertical-align:top;"><span style="font-weight:700;color:#0f172a;text-transform:uppercase;font-size:10px;letter-spacing:.1em;margin-right:8px;">Material Cost:</span> Base and finishing materials.</td>
                      <td style="padding:12px 16px;text-align:right;color:#334155;font-weight:600;vertical-align:top;">${item.material}</td>
                    </tr>
                    <tr style="background:#f8fafc;">
                      <td style="padding:12px 16px;text-align:right;font-weight:700;color:#475569;text-transform:uppercase;font-size:10px;letter-spacing:.1em;">Total Estimated Cost =</td>
                      <td style="padding:12px 16px;text-align:right;font-weight:900;color:#0f172a;font-size:14px;">${item.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>`).join("")}
            <div style="text-align:right;margin-top:20px;" class="page-break">
              <div style="display:inline-block;background:#f1f5f9;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;font-family:Inter,sans-serif;">
                <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin:0;">${sec.title} Total: <span style="color:#0f172a;font-weight:900;font-size:14px;margin-left:16px;">₹ ${sec.sectionTotal}</span></p>
              </div>
            </div>
          </div>`).join("")}
      </div>

      <div style="text-align:right;margin-bottom:56px;font-family:Inter,sans-serif;" class="page-break">
        ${Number(q.discountAmount) > 0 ? `<p style="font-size:11px;color:#059669;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Discount: - ₹ ${q.discountAmount}</p>` : ""}
        ${Number(q.tax) > 0 ? `<p style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">Tax: ₹ ${q.tax}</p>` : ""}
        <div style="border-top:4px solid #0f172a;border-bottom:4px solid #0f172a;padding:16px 32px;display:inline-block;background:#f8fafc;">
          <h2 style="font-size:18px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.1em;margin:0;">Total Working Cost <span style="color:#94a3b8;font-weight:400;margin:0 12px;">=</span> ₹ ${q.grandTotal}</h2>
        </div>
      </div>

      <div style="margin-bottom:48px;font-family:Inter,sans-serif;" class="page-break">
        <h4 style="font-size:11px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.2em;border-bottom:1px solid #e2e8f0;padding-bottom:8px;display:inline-block;margin:0 0 16px;">Terms and Conditions</h4>
        <ul style="padding-left:0;margin:0;list-style:none;">
          ${q.terms.map((t, i) => `<li style="display:flex;gap:12px;font-size:12px;font-weight:500;color:#475569;margin-bottom:10px;line-height:1.6;"><span style="font-weight:900;color:#94a3b8;">${i + 1}.</span> ${t}</li>`).join("")}
        </ul>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:2px solid #f1f5f9;padding-top:32px;font-family:Inter,sans-serif;" class="page-break">
        <div style="width:50%;">
          <h4 style="font-size:11px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.2em;margin:0 0 16px;">Bank Account Details</h4>
          <div style="background:#f8fafc;padding:20px;border-radius:12px;border:1px solid #e2e8f0;">
            ${[["Bank Name", q.bankName], ["A/c No", q.accNo], ["IFSC Code", q.ifsc], ...(q.accHolder ? [["Name", q.accHolder]] : [])]
              .map(([l, v]) => `
              <p style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin:0 0 8px;font-size:11px;">
                <span style="font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;">${l}:</span> 
                <span style="font-weight:900;color:#0f172a;letter-spacing:${l === "A/c No" || l === "IFSC Code" ? ".1em" : "0"};">${v}</span>
              </p>`).join("")}
          </div>
        </div>
        <div style="text-align:right;width:50%;display:flex;flex-direction:column;align-items:flex-end;">
          <p style="font-size:12px;color:#64748b;font-style:italic;margin:0 0 56px;font-family:Merriweather,serif;">With Regards,</p>
          <h4 style="font-size:16px;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">${q.companyName}</h4>
          <p style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.2em;margin:0;">Authorized Signatory</p>
        </div>
      </div>
    </body></html>`;

    // ─────────────────────────────────────────────────────────────────────
    //  NEW PREMIUM TEMPLATES (Obsidian, Sovereign, Aurora)
    // ─────────────────────────────────────────────────────────────────────

    // ── 7. OBSIDIAN — Deep charcoal + burnished gold ──────────────────────
    const obsidianHTML = () => `<!DOCTYPE html><html>${premiumHead}<body style="background:#0e0e10;margin:0;padding:0;font-family:'DM Sans',sans-serif;color:#e8e0d0;min-height:297mm;position:relative;">
      <div style="position:fixed;top:0;right:0;width:400px;height:400px;background:radial-gradient(ellipse at 100% 0%,rgba(196,156,84,0.07),transparent 60%);pointer-events:none;"></div>
      <div style="position:absolute;top:16px;left:16px;width:40px;height:40px;border-top:1px solid rgba(196,156,84,0.3);border-left:1px solid rgba(196,156,84,0.3);"></div>
      <div style="position:absolute;top:16px;right:16px;width:40px;height:40px;border-top:1px solid rgba(196,156,84,0.3);border-right:1px solid rgba(196,156,84,0.3);"></div>
      
      <div style="padding:44px 52px 32px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:18px;">
          ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:56px;height:56px;object-fit:contain;" />` : `<div style="width:56px;height:56px;border:1px solid rgba(196,156,84,0.4);display:flex;align-items:center;justify-content:center;font-size:22px;">🏛️</div>`}
          <div>
            <h1 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#f0e6ce;letter-spacing:0.02em;margin:0 0 6px;line-height:1;">${q.companyName}</h1>
            <p style="font-size:11px;font-weight:300;color:#8a8070;letter-spacing:0.12em;text-transform:uppercase;margin:0;">${q.companyPhone} &nbsp;·&nbsp; ${q.companyEmail}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <h2 style="font-family:'Playfair Display',serif;font-size:38px;font-weight:900;color:#f0e6ce;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 20px;line-height:1;">Quotation</h2>
          <div style="display:flex;justify-content:flex-end;gap:32px;font-size:12px;">
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
              <span style="font-family:'Playfair Display',serif;font-size:11px;font-weight:400;font-style:italic;color:#c49c54;letter-spacing:0.1em;text-transform:uppercase;">Date</span>
              <span style="font-weight:500;color:#e8e0d0;font-size:13px;">${q.date}</span>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
              <span style="font-family:'Playfair Display',serif;font-size:11px;font-weight:400;font-style:italic;color:#c49c54;letter-spacing:0.1em;text-transform:uppercase;">Reference</span>
              <span style="font-weight:500;color:#e8e0d0;font-size:13px;">${q.quotationNo}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="height:1px;background:linear-gradient(90deg,transparent,#c49c54 30%,#e8c87a 50%,#c49c54 70%,transparent);margin:0 52px;"></div>
      
      <div style="margin:32px 52px 36px;border:1px solid rgba(196,156,84,0.2);padding:28px 32px;position:relative;background:rgba(196,156,84,0.03);" class="page-break">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c49c54,#e8c87a 40%,transparent);"></div>
        <p style="font-size:10px;font-weight:500;color:#c49c54;text-transform:uppercase;letter-spacing:0.25em;margin:0 0 10px;">Prepared Exclusively For</p>
        <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:#f0e6ce;margin:0 0 6px;">${q.clientName}</h3>
        <p style="font-size:13px;color:#7a7060;font-weight:300;margin:0;">${q.clientAddress}</p>
      </div>

      ${q.subject ? `
      <div style="margin:0 52px 36px; border-left:4px solid #c49c54; padding:16px 24px; background:rgba(196,156,84,0.05);" class="page-break">
        <p style="font-size:13px; font-weight:400; color:#e8e0d0; margin:0;">
          <span style="font-family:'Playfair Display',serif; font-style:italic; color:#c49c54; margin-right:8px; letter-spacing:0.05em;">Subject:</span>
          ${q.subject}
        </p>
      </div>` : ""}
      
      <div style="padding:0 52px;margin-bottom:40px;">
        ${q.sections.map((sec, idx) => `
          <div style="margin-bottom:36px;" class="page-break">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
              <span style="font-family:'Playfair Display',serif;font-size:11px;font-style:italic;color:#c49c54;min-width:24px;">0${idx + 1}</span>
              <h4 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:#d4c4a8;text-transform:uppercase;letter-spacing:0.12em;margin:0;">${sec.title}</h4>
              <div style="flex:1;height:1px;background:rgba(196,156,84,0.15);"></div>
            </div>
            <table style="width:100%;border-collapse:collapse;border:1px solid rgba(196,156,84,0.12);">
              <thead>
                <tr style="background:rgba(196,156,84,0.08);border-bottom:1px solid rgba(196,156,84,0.2);">
                  <th style="padding:12px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;color:#c49c54;text-align:left;">Description of Work</th>
                  <th style="padding:12px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;color:#c49c54;text-align:center;width:90px;">Labour</th>
                  <th style="padding:12px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;color:#c49c54;text-align:center;width:90px;">Material</th>
                  <th style="padding:12px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;color:#c49c54;text-align:right;width:110px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${sec.items.map((item) => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:16px 18px;font-size:13px;color:#d8d0c0;font-weight:400;white-space:pre-wrap;line-height:1.6;">${item.desc}</td>
                    <td style="padding:16px 18px;font-size:13px;color:#b8b0a0;font-weight:300;text-align:center;">${item.labour}</td>
                    <td style="padding:16px 18px;font-size:13px;color:#b8b0a0;font-weight:300;text-align:center;">${item.material}</td>
                    <td style="padding:16px 18px;font-size:14px;font-weight:600;color:#e8c87a;text-align:right;">₹ ${item.total}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
            <div style="text-align:right;padding:10px 0 0;">
              <span style="color:#5a5248;text-transform:uppercase;letter-spacing:0.18em;font-size:10px;margin-right:12px;">Section Total</span>
              <span style="color:#c49c54;font-weight:600;font-size:13px;">₹ ${sec.sectionTotal}</span>
            </div>
          </div>`).join("")}
      </div>

      <div style="padding:0 52px;display:flex;justify-content:flex-end;margin-bottom:48px;" class="page-break">
        <div style="width:340px;border:1px solid rgba(196,156,84,0.25);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c49c54,#e8c87a 50%,#c49c54);"></div>
          <div style="padding:24px 24px 16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;">
              <span style="font-size:10px;font-weight:500;color:#6a6258;text-transform:uppercase;letter-spacing:0.12em;">Subtotal</span>
              <span style="color:#b8b0a0;">₹ ${q.subtotal}</span>
            </div>
            ${Number(q.discountAmount) > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;"><span style="font-size:10px;font-weight:500;color:#6a6258;text-transform:uppercase;letter-spacing:0.12em;">Discount</span><span style="color:#6db891;">− ₹ ${q.discountAmount}</span></div>` : ""}
            ${Number(q.tax) > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;"><span style="font-size:10px;font-weight:500;color:#6a6258;text-transform:uppercase;letter-spacing:0.12em;">GST / Tax</span><span style="color:#b8b0a0;">₹ ${q.tax}</span></div>` : ""}
          </div>
          <div style="padding:20px 24px;background:rgba(196,156,84,0.08);border-top:1px solid rgba(196,156,84,0.2);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:'Playfair Display',serif;font-size:11px;font-style:italic;color:#c49c54;text-transform:uppercase;letter-spacing:0.18em;">Grand Total</span>
            <span style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#e8c87a;">₹ ${q.grandTotal}</span>
          </div>
        </div>
      </div>

      <div style="margin:0 52px;display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:1px solid rgba(196,156,84,0.12);padding-top:36px;padding-bottom:52px;" class="page-break">
        <div>
          <p style="font-size:10px;font-weight:600;color:#c49c54;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 20px;padding-bottom:6px;border-bottom:1px solid rgba(196,156,84,0.15);">Terms &amp; Conditions</p>
          <ul style="list-style:none;padding:0;margin:0;">
            ${q.terms.map((t) => `<li style="display:flex;gap:10px;font-size:12px;font-weight:300;color:#6a6258;margin-bottom:10px;line-height:1.65;"><span style="color:#c49c54;flex-shrink:0;">—</span>${t}</li>`).join("")}
          </ul>
        </div>
        <div>
          <p style="font-size:10px;font-weight:600;color:#c49c54;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 20px;padding-bottom:6px;border-bottom:1px solid rgba(196,156,84,0.15);">Payment Details</p>
          ${[["Bank", q.bankName, false], ["Account No.", q.accNo, false], ["IFSC Code", q.ifsc, true], ...(q.accHolder ? [["Account Holder", q.accHolder, false]] : [])].map(([l, v, isGold]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
              <span style="font-size:10px;font-weight:500;color:#4a4840;text-transform:uppercase;letter-spacing:0.15em;">${l}</span>
              <span style="font-size:13px;font-weight:500;color:${isGold ? "#c49c54" : "#d0c8b8"};letter-spacing:0.04em;">${v || "—"}</span>
            </div>`).join("")}
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(196,156,84,0.1);text-align:right;">
            <div style="width:160px;height:1px;background:rgba(196,156,84,0.3);margin-left:auto;margin-bottom:8px;"></div>
            <p style="font-size:10px;font-weight:500;color:#4a4840;text-transform:uppercase;letter-spacing:0.2em;margin:0;">Authorised Signatory</p>
          </div>
        </div>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#c49c54 30%,#e8c87a 50%,#c49c54 70%,transparent);margin:0 52px 24px;"></div>
      <div style="text-align:center;padding:0 0 32px;font-family:'Playfair Display',serif;font-style:italic;font-size:10px;color:#3a3830;letter-spacing:0.3em;text-transform:uppercase;">Premium Document</div>
    </body></html>`;

    // ── 8. SOVEREIGN — Deep navy + crimson ───────────────────────────────
    const sovereignHTML = () => `<!DOCTYPE html><html>${premiumHead}<body style="background:#f8f6f1;margin:0;padding:0;font-family:'IBM Plex Sans',sans-serif;color:#1a1e2e;min-height:297mm;position:relative;">
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:280px;opacity:0.018;pointer-events:none;font-family:'Cormorant Garamond',serif;font-weight:700;color:#0c1535;z-index:0;letter-spacing:-0.05em;">${q.companyName.charAt(0)}</div>
      <div style="position:relative;z-index:1;">
        <div style="background:#0c1535;position:relative;overflow:hidden;">
          <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#c0392b,#e74c3c 40%,#c0392b);"></div>
          <div style="padding:36px 52px 40px;display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1;">
            <div style="display:flex;align-items:center;gap:18px;">
              ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:56px;height:56px;object-fit:contain;" />` : `<div style="width:56px;height:56px;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.05);">🏗️</div>`}
              <div>
                <h1 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#f0ece0;letter-spacing:.03em;margin:0 0 4px;line-height:1.1;">${q.companyName}</h1>
                <p style="font-size:11px;font-weight:300;color:rgba(255,255,255,.35);letter-spacing:.08em;margin:0;">${q.companyPhone} | ${q.companyEmail}</p>
              </div>
            </div>
            <div style="background:#c0392b;color:#fff;padding:10px 20px;display:flex;flex-direction:column;align-items:flex-end;gap:2px;position:relative;">
              <div style="position:absolute;left:-12px;top:0;bottom:0;width:0;border-style:solid;border-width:0 0 100% 12px;border-color:transparent transparent #c0392b transparent;"></div>
              <span style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;line-height:1;">Quotation</span>
              <span style="font-size:9px;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.6);">Formal Proposal</span>
            </div>
          </div>
          <div style="background:#111829;padding:14px 52px;display:flex;gap:48px;align-items:center;">
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:9px;font-weight:600;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.22em;">Reference No.</span>
              <span style="font-size:12px;font-weight:500;color:rgba(255,255,255,.75);">${q.quotationNo}</span>
            </div>
            <div style="width:1px;height:20px;background:rgba(255,255,255,.08);"></div>
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:9px;font-weight:600;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.22em;">Date of Issue</span>
              <span style="font-size:12px;font-weight:500;color:rgba(255,255,255,.75);">${q.date}</span>
            </div>
          </div>
        </div>

        <div style="margin:36px 52px;border:1px solid #d8d0c0;padding:28px 32px;background:#ffffff;position:relative;" class="page-break">
          <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:#c0392b;"></div>
          <div style="font-size:9px;font-weight:600;color:#c0392b;text-transform:uppercase;letter-spacing:.28em;margin:0 0 10px;">Submitted To</div>
          <h3 style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#0c1535;margin:0 0 6px;">${q.clientName}</h3>
          <p style="font-size:12px;font-weight:300;color:#6a6258;margin:0;">${q.clientAddress}</p>
        </div>

        ${q.subject ? `
        <div style="margin:0 52px 36px; border-left:4px solid #0c1535; padding:16px 24px; background:#fff; border-top:1px solid #d8d0c0; border-right:1px solid #d8d0c0; border-bottom:1px solid #d8d0c0;" class="page-break">
          <p style="font-size:13px; font-weight:500; color:#1a1e2e; margin:0;">
            <span style="font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:600; color:#c0392b; margin-right:8px;">Subject:</span>
            ${q.subject}
          </p>
        </div>` : ""}

        <div style="padding:0 52px;margin-bottom:36px;">
          ${q.sections.map((sec, idx) => `
            <div style="margin-bottom:36px;" class="page-break">
              <div style="background:#0c1535;padding:10px 20px;display:flex;align-items:center;gap:16px;">
                <span style="font-family:'Cormorant Garamond',serif;font-size:12px;font-style:italic;color:rgba(255,255,255,.35);">§ ${String(idx + 1).padStart(2, "0")}</span>
                <h4 style="font-size:10px;font-weight:600;color:#f0ece0;text-transform:uppercase;letter-spacing:.18em;margin:0;">${sec.title}</h4>
              </div>
              <table style="width:100%;border-collapse:collapse;border:1px solid #d8d0c0;border-top:none;background:#fff;">
                <thead>
                  <tr style="background:#f4f0e8;border-bottom:1px solid #d8d0c0;">
                    <th style="padding:10px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.2em;color:#8a8070;text-align:left;">Description of Work / Item</th>
                    <th style="padding:10px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.2em;color:#8a8070;text-align:center;width:88px;">Labour</th>
                    <th style="padding:10px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.2em;color:#8a8070;text-align:center;width:88px;">Material</th>
                    <th style="padding:10px 18px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.2em;color:#8a8070;text-align:right;width:110px;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${sec.items.map((item, i) => `
                    <tr style="border-bottom:1px solid #f0ece8;background:${i % 2 === 1 ? "#fdfbf8" : "white"};">
                      <td style="padding:14px 18px;font-size:12px;font-weight:500;color:#1a1e2e;white-space:pre-wrap;line-height:1.65;">${item.desc}</td>
                      <td style="padding:14px 18px;font-size:12px;color:#6a6258;text-align:center;">${item.labour}</td>
                      <td style="padding:14px 18px;font-size:12px;color:#6a6258;text-align:center;">${item.material}</td>
                      <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#0c1535;text-align:right;">${item.total}</td>
                    </tr>`).join("")}
                </tbody>
              </table>
              <div style="background:#f4f0e8;border:1px solid #d8d0c0;border-top:1px solid #c8c0b0;padding:10px 18px;display:flex;justify-content:flex-end;align-items:center;gap:16px;">
                <span style="font-size:9px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.2em;">Section Sub-Total</span>
                <span style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:#0c1535;">₹ ${sec.sectionTotal}</span>
              </div>
            </div>`).join("")}
        </div>

        <div style="padding:0 52px;display:flex;justify-content:flex-end;margin-bottom:44px;" class="page-break">
          <div style="width:360px;border:1px solid #d8d0c0;background:#fff;overflow:hidden;">
            <div style="padding:20px 24px 12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0ece8;font-size:12px;">
                <span style="font-size:10px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.15em;">Gross Amount</span>
                <span style="color:#4a4840;font-weight:500;">₹ ${q.subtotal}</span>
              </div>
              ${Number(q.discountAmount) > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0ece8;font-size:12px;"><span style="font-size:10px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.15em;">Less: Discount</span><span style="color:#27ae60;font-weight:500;">− ₹ ${q.discountAmount}</span></div>` : ""}
              ${Number(q.tax) > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0ece8;font-size:12px;"><span style="font-size:10px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.15em;">Add: GST / Tax</span><span style="color:#4a4840;font-weight:500;">₹ ${q.tax}</span></div>` : ""}
            </div>
            <div style="background:#0c1535;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;position:relative;">
              <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c0392b,#e74c3c 50%,#c0392b);"></div>
              <span style="font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:500;font-style:italic;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.2em;">Net Payable Amount</span>
              <span style="font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:700;color:#f0ece0;">₹ ${q.grandTotal}</span>
            </div>
          </div>
        </div>

        <div style="padding:0 52px 52px;display:grid;grid-template-columns:3fr 2fr;gap:40px;" class="page-break">
          <div>
            <span style="font-size:9px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.25em;display:block;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #d8d0c0;">Terms &amp; Conditions</span>
            <ul style="list-style:none;padding:0;margin:0;">
              ${q.terms.map((t) => `<li style="display:flex;gap:12px;font-size:11.5px;color:#6a6258;margin-bottom:9px;line-height:1.65;"><div style="width:5px;height:5px;border-radius:50%;background:#c0392b;flex-shrink:0;margin-top:6px;"></div><span>${t}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <span style="font-size:9px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.25em;display:block;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #d8d0c0;">Bank Account Details</span>
            <div style="background:#fff;border:1px solid #d8d0c0;padding:18px 20px;">
              ${[["Bank Name", q.bankName], ["Account No.", q.accNo], ["IFSC Code", q.ifsc], ...(q.accHolder ? [["Account Holder", q.accHolder]] : [])].map(([l, v]) => `<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0ece8;font-size:12px;"><span style="font-size:9px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.15em;">${l}</span><span style="font-weight:600;color:#1a1e2e;">${v || "—"}</span></div>`).join("")}
            </div>
          </div>
        </div>

        <div style="margin:0 52px;padding:20px 0 24px;border-top:1px solid #d8d0c0;display:flex;justify-content:space-between;align-items:flex-end;">
          <div>
            <span style="font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;color:#0c1535;display:block;">${q.companyName}</span>
            <span style="font-size:9px;color:#8a8070;text-transform:uppercase;letter-spacing:.15em;">Certified Document</span>
          </div>
          <div style="text-align:right;">
            <div style="width:150px;height:1px;background:#0c1535;margin-bottom:7px;margin-left:auto;"></div>
            <span style="font-size:9px;font-weight:600;color:#8a8070;text-transform:uppercase;letter-spacing:.2em;">Authorised Signatory &amp; Seal</span>
          </div>
        </div>
      </div>
    </body></html>`;

    // ── 9. AURORA — Arctic white + electric teal ──────────────────────────
    const auroraHTML = () => `<!DOCTYPE html><html>${premiumHead}<body style="background:#ffffff;margin:0;padding:0;font-family:'Outfit',sans-serif;color:#0a0f1a;min-height:297mm;position:relative;overflow:hidden;">
      <div style="position:fixed;top:0;left:0;width:5px;height:100%;background:linear-gradient(180deg,#00d2be,#00a896 50%,#007a6e);"></div>
      <div style="position:fixed;top:-120px;right:-120px;width:420px;height:420px;border:1px solid rgba(0,210,190,.08);border-radius:50%;pointer-events:none;"></div>
      <div style="position:fixed;top:-60px;right:-60px;width:260px;height:260px;border:1px solid rgba(0,210,190,.12);border-radius:50%;pointer-events:none;"></div>

      <div style="padding:44px 52px 0 60px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:16px;">
          ${q.companyLogo ? `<img src="${q.companyLogo}" style="width:54px;height:54px;object-fit:contain;border-radius:50%;" />` : `<div style="width:54px;height:54px;border-radius:50%;border:2px solid #00d2be;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(0,210,190,.04);">🌊</div>`}
          <div>
            <h1 style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#0a0f1a;letter-spacing:-0.01em;margin:0 0 4px;line-height:1;">${q.companyName}</h1>
            <p style="font-size:11px;color:#8090a8;letter-spacing:.04em;margin:0;">${q.companyPhone} &nbsp;·&nbsp; ${q.companyEmail}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:#00d2be;text-transform:uppercase;letter-spacing:.25em;display:block;margin-bottom:6px;">Quotation</span>
          <p style="font-family:'Syne',sans-serif;font-size:13px;font-weight:600;color:#0a0f1a;margin:0 0 16px;">${q.quotationNo}</p>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <div style="border:1px solid rgba(0,210,190,.3);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:500;color:#3a5060;background:rgba(0,210,190,.04);display:flex;gap:6px;align-items:center;">
              <div style="width:5px;height:5px;border-radius:50%;background:#00d2be;"></div>${q.date}
            </div>
            <div style="border:1px solid rgba(0,210,190,.3);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:500;color:#3a5060;background:rgba(0,210,190,.04);display:flex;gap:6px;align-items:center;">
              <div style="width:5px;height:5px;border-radius:50%;background:#00d2be;"></div>Valid 30 Days
            </div>
          </div>
        </div>
      </div>

      <div style="margin:32px 52px 0 60px;height:80px;background:#0a0f1a;border-radius:12px;display:flex;align-items:center;padding:0 32px;justify-content:space-between;position:relative;overflow:hidden;" class="page-break">
        <div style="position:absolute;right:0;top:0;bottom:0;width:200px;background:linear-gradient(90deg,transparent,rgba(0,210,190,.12));"></div>
        <div>
          <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">${q.clientName}</div>
          <div style="font-size:12px;font-weight:300;color:#6080a0;margin-top:4px;">${q.clientAddress}</div>
        </div>
        <div style="font-size:9px;font-weight:700;color:#00d2be;text-transform:uppercase;letter-spacing:.22em;position:relative;z-index:1;">Prepared For ↗</div>
      </div>

      ${q.subject ? `
      <div style="margin:32px 52px 0 60px; border-left:4px solid #00d2be; padding:12px 16px; background:rgba(0,210,190,.05);" class="page-break">
        <p style="font-size:12px; font-weight:500; color:#0a0f1a; margin:0;">
          <span style="font-family:'Syne',sans-serif; font-weight:700; color:#00a896; margin-right:8px;">SUBJECT:</span>
          ${q.subject}
        </p>
      </div>` : ""}

      <div style="padding:36px 52px 0 60px;">
        ${q.sections.map((sec, idx) => `
          <div style="margin-bottom:32px;" class="page-break">
            <div style="display:grid;grid-template-columns:36px 1fr;gap:0;">
              <div style="display:flex;flex-direction:column;align-items:center;padding-top:2px;">
                <span style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#e8f8f6;line-height:1;">0${idx + 1}</span>
                <div style="width:1px;flex:1;background:linear-gradient(180deg,#00d2be,transparent);margin-top:4px;min-height:16px;"></div>
              </div>
              <div style="padding-left:12px;">
                <h4 style="font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#0a0f1a;text-transform:uppercase;letter-spacing:.14em;margin:0 0 14px;display:flex;align-items:center;gap:12px;">${sec.title}<span style="flex:1;height:1px;background:#e8f0f0;display:inline-block;"></span></h4>
                <table style="width:100%;border-collapse:collapse;">
                  <thead>
                    <tr style="border-bottom:2px solid #00d2be;">
                      <th style="padding:10px 14px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#00a896;text-align:left;">Description of Work</th>
                      <th style="padding:10px 14px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#00a896;text-align:center;width:88px;">Labour</th>
                      <th style="padding:10px 14px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#00a896;text-align:center;width:88px;">Material</th>
                      <th style="padding:10px 14px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#00a896;text-align:right;width:110px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sec.items.map((item) => `
                      <tr style="border-bottom:1px solid #f0f6f6;">
                        <td style="padding:14px;font-size:12px;font-weight:500;color:#1a2535;white-space:pre-wrap;line-height:1.65;">${item.desc}</td>
                        <td style="padding:14px;font-size:12px;color:#506070;text-align:center;">${item.labour}</td>
                        <td style="padding:14px;font-size:12px;color:#506070;text-align:center;">${item.material}</td>
                        <td style="padding:14px;font-size:13px;font-weight:700;color:#007a6e;font-family:'Syne',sans-serif;text-align:right;">₹ ${item.total}</td>
                      </tr>`).join("")}
                  </tbody>
                </table>
                <div style="text-align:right;padding:8px 0 0;">
                  <span style="font-size:9px;color:#b0c0cc;text-transform:uppercase;letter-spacing:.18em;margin-right:10px;">Section Total</span>
                  <span style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#00a896;">₹ ${sec.sectionTotal}</span>
                </div>
              </div>
            </div>
          </div>`).join("")}
      </div>

      <div style="margin:8px 52px 0 60px;background:#0a0f1a;border-radius:16px;display:flex;overflow:hidden;" class="page-break">
        <div style="flex:1;padding:28px 32px;display:flex;gap:40px;align-items:center;">
          <div style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:9px;font-weight:600;color:#3a5070;text-transform:uppercase;letter-spacing:.18em;">Subtotal</span>
            <span style="font-size:14px;font-weight:500;color:#8090a8;">₹ ${q.subtotal}</span>
          </div>
          ${Number(q.discountAmount) > 0 ? `<div style="display:flex;flex-direction:column;gap:4px;"><span style="font-size:9px;font-weight:600;color:#3a5070;text-transform:uppercase;letter-spacing:.18em;">Discount</span><span style="font-size:14px;font-weight:500;color:#00d2be;">− ₹ ${q.discountAmount}</span></div>` : ""}
          ${Number(q.tax) > 0 ? `<div style="display:flex;flex-direction:column;gap:4px;"><span style="font-size:9px;font-weight:600;color:#3a5070;text-transform:uppercase;letter-spacing:.18em;">Tax</span><span style="font-size:14px;font-weight:500;color:#8090a8;">₹ ${q.tax}</span></div>` : ""}
        </div>
        <div style="background:linear-gradient(135deg,#00d2be,#007a6e);padding:28px 36px;display:flex;flex-direction:column;justify-content:center;min-width:200px;">
          <span style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.22em;margin-bottom:4px;">Grand Total</span>
          <span style="font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#ffffff;line-height:1;">₹ ${q.grandTotal}</span>
        </div>
      </div>

      <div style="padding:36px 52px 52px 60px;display:grid;grid-template-columns:1fr 1fr;gap:40px;" class="page-break">
        <div>
          <div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:#0a0f1a;text-transform:uppercase;letter-spacing:.2em;margin:0 0 18px;padding-bottom:10px;border-bottom:2px solid #00d2be;display:inline-block;">Terms &amp; Conditions</div>
          <ul style="list-style:none;padding:0;margin:16px 0 0;">
            ${q.terms.map((t, i) => `<li style="display:flex;gap:10px;font-size:12px;color:#7090a8;margin-bottom:10px;line-height:1.65;align-items:flex-start;"><span style="font-family:'Syne',sans-serif;font-size:10px;font-weight:800;color:#00d2be;flex-shrink:0;line-height:1.7;">${String(i + 1).padStart(2, "0")}.</span><span>${t}</span></li>`).join("")}
          </ul>
        </div>
        <div>
          <div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:#0a0f1a;text-transform:uppercase;letter-spacing:.2em;margin:0 0 18px;padding-bottom:10px;border-bottom:2px solid #00d2be;display:inline-block;">Payment Details</div>
          <div style="background:#f4fafa;border-radius:12px;padding:24px;border:1px solid rgba(0,210,190,.15);margin-top:16px;">
            ${[["Bank", q.bankName, false], ["Account No.", q.accNo, false], ["IFSC Code", q.ifsc, true], ...(q.accHolder ? [["Account Holder", q.accHolder, false]] : [])].map(([l, v, isTeal]) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(0,210,190,.08);font-size:12px;">
                <span style="font-size:10px;font-weight:600;color:#90a8b8;text-transform:uppercase;letter-spacing:.12em;">${l}</span>
                <span style="font-weight:600;color:${isTeal ? "#00a896" : "#1a2535"};">${v || "—"}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <div style="margin:0 52px 24px 60px;padding-top:20px;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:#c8d8e0;text-transform:uppercase;letter-spacing:.3em;">Premium Document</span>
        <div style="text-align:right;">
          <div style="width:130px;height:1px;background:#00d2be;margin-bottom:6px;margin-left:auto;"></div>
          <span style="font-size:9px;font-weight:600;color:#90a8b8;text-transform:uppercase;letter-spacing:.18em;">Authorised Signatory</span>
        </div>
      </div>
    </body></html>`;

    // ─────────────────────────────────────────
    // 🚀  PICK TEMPLATE & RENDER
    // ─────────────────────────────────────────
    const templateMap = {
      classic:    classicHTML,
      modern:     modernHTML,
      corporate:  corporateHTML,
      compact:    compactHTML,
      creative:   creativeHTML,
      grouped:    groupedHTML,
      obsidian:   obsidianHTML,
      sovereign:  sovereignHTML,
      aurora:     auroraHTML,
    };

    const htmlContent = (templateMap[tName] || templateMap.classic)();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    await browser.close();

    // ─────────────────────────────────────────
    // 📤  SEND RESPONSE
    // ─────────────────────────────────────────
    if (res.setHeader && !res.headersSent) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="quotation-${q.quotationNo}.pdf"`
      );
    }

    if (typeof res.end === "function") {
      res.end(pdfBuffer, 'binary'); // FORCE BINARY
    } else if (typeof res.send === "function") {
      res.send(pdfBuffer);
    }

  } catch (error) {
    console.error("🔥 Puppeteer PDF Generation Error:", error);
    if (res?.headersSent === false && typeof res.status === "function") {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF",
        error: error.message,
      });
    } else if (typeof res.end === "function") {
      res.end();
    }
  }
};