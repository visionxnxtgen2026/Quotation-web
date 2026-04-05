/**
 * Generates an HTML string for the Quotation PDF
 * Designed to perfectly match the React UI
 * @param {Object} data - Quotation MongoDB Document
 * @returns {String} HTML Content
 */
export const quotationTemplate = (data) => {
  // Safe fallbacks for all data fields
  const project = data.projectDetails || {};
  const area = data.areaDetails || {};
  const letter = data.coverLetter || {};
  const pricing = data.pricing || {};
  const terms = data.textAreas || {};
  const bank = data.bankDetails || {};
  const sig = data.signature || {};
  const payment = data.paymentTerms || {};
  
  const dateStr = project.date ? new Date(project.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

  // Generate Table Rows
  const tableRows = (data.rateTable || []).map(row => `
    <tr class="table-row">
      <td class="text-left">${row.work || "-"}</td>
      <td class="text-center">${Number(row.labour || 0).toFixed(2)}</td>
      <td class="text-center">${Number(row.material || 0).toFixed(2)}</td>
      <td class="text-right font-bold">${Number(row.total || 0).toFixed(2)}</td>
    </tr>
  `).join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation - ${project.referenceNo || 'Draft'}</title>
    <style>
      /* --- BASE STYLES --- */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      body {
        font-family: 'Inter', sans-serif;
        color: #1e293b;
        background-color: #ffffff;
        margin: 0;
        padding: 40px;
        box-sizing: border-box;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
      }

      /* --- TYPOGRAPHY & COLORS --- */
      .text-primary { color: #3b82f6; }
      .text-slate-900 { color: #0f172a; }
      .text-slate-500 { color: #64748b; }
      .text-slate-400 { color: #94a3b8; }
      .bg-primary { background-color: #3b82f6; color: white; }
      .bg-slate-50 { background-color: #f8fafc; }
      
      .font-bold { font-weight: 700; }
      .font-black { font-weight: 900; }
      .text-xs { font-size: 12px; }
      .text-sm { font-size: 14px; }
      .text-base { font-size: 16px; }
      .text-lg { font-size: 18px; }
      .text-3xl { font-size: 32px; }
      
      .uppercase { text-transform: uppercase; }
      .tracking-wider { letter-spacing: 0.05em; }
      .tracking-widest { letter-spacing: 0.1em; }
      
      /* --- LAYOUT --- */
      .flex { display: flex; }
      .justify-between { justify-content: space-between; }
      .items-start { align-items: flex-start; }
      .items-end { align-items: flex-end; }
      .items-center { align-items: center; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      
      .mt-2 { margin-top: 8px; }
      .mt-4 { margin-top: 16px; }
      .mt-8 { margin-top: 32px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-4 { margin-bottom: 16px; }
      .mb-8 { margin-bottom: 32px; }
      .p-6 { padding: 24px; }
      
      .border-b { border-bottom: 1px solid #e2e8f0; }
      .border-t { border-top: 1px solid #e2e8f0; }
      .rounded-xl { border-radius: 12px; }
      .rounded-full { border-radius: 9999px; }

      /* --- SPECIFIC COMPONENTS --- */
      .badge {
        display: inline-block;
        background-color: #eff6ff;
        color: #3b82f6;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      
      .quote-badge {
        display: inline-block;
        background-color: #3b82f6;
        color: #ffffff;
        padding: 8px 24px;
        border-radius: 8px;
        font-weight: 800;
        letter-spacing: 0.1em;
        margin-bottom: 8px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 32px;
      }
      
      th {
        color: #3b82f6;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 12px 8px;
        border-bottom: 2px solid #eff6ff;
        border-top: 2px solid #eff6ff;
      }
      
      td {
        padding: 16px 8px;
        font-size: 14px;
        color: #1e293b;
      }
      
      .table-row {
        border-bottom: 1px solid #f1f5f9;
      }

      .grand-total-box {
        background-color: #3b82f6;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
        float: right;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }

      /* Prevent page breaks inside cards */
      .avoid-break {
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <div class="container">
      
      <div class="flex justify-between items-start mb-8">
        <div>
          <span class="badge rounded-full uppercase tracking-wider border border-blue-100">
            ${project.paintBrand || "PAINT BRAND"}
          </span>
          <h1 class="text-3xl font-black text-slate-900 m-0">
            ${project.companyName || "Your Company Name"}
          </h1>
        </div>
        <div class="text-right">
          <div class="quote-badge">QUOTATION</div>
          <p class="text-sm text-slate-500 font-bold mt-2 m-0">Date: ${dateStr}</p>
        </div>
      </div>

      <div class="border-b mb-8"></div>

      <div class="flex justify-between items-start mb-8">
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-100" style="width: 55%;">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0 mb-2">Bill To</p>
          <p class="text-lg font-bold text-slate-900 m-0 mb-4">${project.clientName || "Client Name"}</p>

          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0 mb-2">Project</p>
          <p class="text-base font-bold text-slate-900 m-0">${project.projectName || "Project Name"}</p>
        </div>

        <div class="text-right text-sm" style="padding-top: 10px;">
          <div class="mb-4">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Reference No.</p>
            <p class="font-bold text-slate-900 m-0 mt-2">${project.referenceNo || "—"}</p>
          </div>
          <div class="flex justify-between" style="gap: 24px;">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Interior Area</p>
              <p class="font-bold text-slate-900 m-0 mt-2">${area.interiorArea ? area.interiorArea + " Sqft" : "—"}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Exterior Area</p>
              <p class="font-bold text-slate-900 m-0 mt-2">${area.exteriorArea ? area.exteriorArea + " Sqft" : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 avoid-break">
        <p class="font-bold text-slate-900 m-0 mb-4">Subject: ${letter.subject || "Paint Quote"}</p>
        <p class="text-sm text-slate-500 m-0" style="line-height: 1.6; white-space: pre-wrap;">${letter.body || "Please find the attached quotation."}</p>
      </div>

      <div class="mb-8">
        <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Work Details & Pricing</h2>
        <table>
          <thead>
            <tr>
              <th class="text-left">Description of Work</th>
              <th class="text-center">Labour (₹)</th>
              <th class="text-center">Material (₹)</th>
              <th class="text-right">Total / Sqft</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || `<tr><td colspan="4" class="text-center text-slate-400">No items added</td></tr>`}
          </tbody>
        </table>
      </div>

      <div class="avoid-break" style="overflow: hidden; margin-bottom: 40px;">
        <div style="float: right; width: 300px;">
          <div class="flex justify-between text-sm text-slate-500 mb-2 px-2">
            <span>Subtotal</span>
            <span class="font-bold text-slate-900">₹ ${Number(pricing.subtotal || 0).toFixed(2)}</span>
          </div>
          ${pricing.discount > 0 ? `
          <div class="flex justify-between text-sm mb-2 px-2" style="color: #10b981;">
            <span>Discount (${pricing.discount}%)</span>
            <span class="font-bold">-₹ ${Number(((pricing.subtotal || 0) * pricing.discount) / 100).toFixed(2)}</span>
          </div>` : ''}
          <div class="grand-total-box mt-4 shadow-lg">
            <span class="font-bold text-lg">Grand Total</span>
            <span class="font-black text-xl">₹ ${Number(pricing.grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="grid-2 mb-8 avoid-break">
        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest border-b pb-2 mb-2">Terms & Conditions</h4>
          <p class="text-xs text-slate-500" style="line-height: 1.5; white-space: pre-wrap;">${terms.termsConditions || "—"}</p>
        </div>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 m-0">Bank Details</h4>
          <p class="text-xs text-slate-500 m-0 mb-1"><span class="font-bold text-slate-900">Bank:</span> ${bank.bankName || "-"}</p>
          <p class="text-xs text-slate-500 m-0 mb-1"><span class="font-bold text-slate-900">A/C Name:</span> ${bank.accountHolder || "-"}</p>
          <p class="text-xs text-slate-500 m-0 mb-1"><span class="font-bold text-slate-900">A/C No:</span> ${bank.accountNumber || "-"}</p>
          <p class="text-xs text-slate-500 m-0"><span class="font-bold text-slate-900">IFSC:</span> ${bank.ifscCode || "-"}</p>
        </div>
      </div>

      <div class="flex justify-between items-end mt-8 avoid-break" style="padding-top: 40px;">
        <div class="text-center" style="width: 200px;">
          <div style="border-bottom: 1px solid #94a3b8; margin-bottom: 12px;"></div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest m-0">Customer Signature</p>
        </div>

        <div class="text-center" style="width: 200px;">
          <div class="text-primary font-bold" style="font-family: serif; font-size: 24px; font-style: italic; margin-bottom: 8px;">
            ${sig.name || project.companyName?.substring(0, 10) || "Auto Sign"}
          </div>
          <div style="border-bottom: 2px solid #0f172a; margin-bottom: 12px;"></div>
          <p class="text-xs font-bold text-slate-900 uppercase tracking-wider m-0">Authorized Signatory</p>
          <p class="text-xs text-slate-400 font-bold uppercase m-0 mt-2">${sig.designation ? sig.designation + " -" : ""} ${project.companyName || "Company"}</p>
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
};