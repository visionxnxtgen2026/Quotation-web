import React from "react";

/**
 * OBSIDIAN — Premium Dark Luxury Template
 * Aesthetic: Deep charcoal + burnished gold. High-end architecture firm / luxury contractor energy.
 * Font: Playfair Display (display) + DM Sans (body)
 */
export default function ObsidianTemplate({ data }) {
  const quote = data || {
    companyName: "Aurex Constructions",
    companyEmail: "studio@aurex.in",
    companyPhone: "+91 98400 11223",
    clientName: "Priya Venkatesh",
    clientAddress: "14, Boat Club Road, RA Puram, Chennai — 600 028",
    quotationNo: "AX-PRO-2026-047",
    date: "05-04-2026",
    sections: [
      {
        title: "Structural & Civil Works",
        items: [
          { desc: "Premium Wall Putty — 3 Coats\nSurface leveling, crack treatment", labour: "12.00", material: "18.00", total: "30.00" },
          { desc: "High-Build Primer — 2 Coats\nAnti-alkali formulation", labour: "6.00", material: "9.00", total: "15.00" },
        ],
        sectionTotal: "45.00",
      },
      {
        title: "Premium Finishing",
        items: [
          { desc: "Royale Luxury Emulsion — 2 Coats\nSheen finish, 10-year warranty", labour: "14.00", material: "32.00", total: "46.00" },
          { desc: "Decorative Texture Coating\nVenetian plaster effect", labour: "22.00", material: "38.00", total: "60.00" },
        ],
        sectionTotal: "106.00",
      },
    ],
    subtotal: "151.00",
    discount: "6.00",
    tax: "0.00",
    grandTotal: "145.00",
    terms: [
      "60% advance payment required before project commencement.",
      "Materials sourced exclusively from approved premium vendors.",
      "5-year workmanship warranty on all finished surfaces.",
      "Scaffolding & site access to be arranged by client.",
    ],
    bankDetails: {
      bankName: "ICICI Bank",
      accNo: "7823 0045 6712",
      ifsc: "ICIC0001782",
      accHolder: "Aurex Constructions LLP",
    },
  };

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const sections =
    quote.sections?.length > 0
      ? quote.sections
      : [{ title: "Services", items: quote.items || [], sectionTotal: quote.subtotal }];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .obsidian-wrap * { box-sizing: border-box; }

        .obsidian-wrap {
          background: #0e0e10;
          min-height: 297mm;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d0;
          position: relative;
          overflow: hidden;
        }

        /* ── Gold texture overlay ── */
        .obsidian-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 40% at 110% -10%, rgba(196,156,84,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at -10% 110%, rgba(196,156,84,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── Gold rule ── */
        .gold-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c49c54 30%, #e8c87a 50%, #c49c54 70%, transparent);
          margin: 0;
        }

        /* ── Header ── */
        .obs-header {
          padding: 44px 52px 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
        }

        .obs-logo-wrap {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .obs-logo-box {
          width: 56px;
          height: 56px;
          border: 1px solid rgba(196,156,84,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .obs-company-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #f0e6ce;
          letter-spacing: 0.02em;
          margin: 0 0 6px;
          line-height: 1;
        }

        .obs-company-sub {
          font-size: 11px;
          font-weight: 300;
          color: #8a8070;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
        }

        .obs-meta {
          text-align: right;
        }

        .obs-label {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: 400;
          font-style: italic;
          color: #c49c54;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 4px;
          display: block;
        }

        .obs-quotation-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 900;
          color: #f0e6ce;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0 0 20px;
          line-height: 1;
        }

        .obs-ref-row {
          display: flex;
          justify-content: flex-end;
          gap: 32px;
          font-size: 12px;
        }

        .obs-ref-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .obs-ref-val {
          font-weight: 500;
          color: #e8e0d0;
          font-size: 13px;
        }

        /* ── Client band ── */
        .obs-client-band {
          margin: 0 52px 36px;
          border: 1px solid rgba(196,156,84,0.2);
          padding: 28px 32px;
          position: relative;
          background: rgba(196,156,84,0.03);
        }

        .obs-client-band::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c49c54, #e8c87a 40%, transparent);
        }

        .obs-client-eyebrow {
          font-size: 10px;
          font-weight: 500;
          color: #c49c54;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin: 0 0 10px;
        }

        .obs-client-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #f0e6ce;
          margin: 0 0 6px;
        }

        .obs-client-addr {
          font-size: 13px;
          color: #7a7060;
          font-weight: 300;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Sections ── */
        .obs-sections {
          padding: 0 52px;
          margin-bottom: 40px;
        }

        .obs-section {
          margin-bottom: 36px;
        }

        .obs-section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .obs-section-num {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-style: italic;
          color: #c49c54;
          min-width: 24px;
        }

        .obs-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 600;
          color: #d4c4a8;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0;
        }

        .obs-section-line {
          flex: 1;
          height: 1px;
          background: rgba(196,156,84,0.15);
        }

        .obs-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid rgba(196,156,84,0.12);
        }

        .obs-table thead tr {
          background: rgba(196,156,84,0.08);
          border-bottom: 1px solid rgba(196,156,84,0.2);
        }

        .obs-table th {
          padding: 12px 18px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #c49c54;
        }

        .obs-table th:first-child { text-align: left; }
        .obs-table th:not(:first-child) { text-align: center; width: 90px; }
        .obs-table th:last-child { text-align: right; width: 110px; }

        .obs-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }

        .obs-table tbody tr:hover {
          background: rgba(196,156,84,0.03);
        }

        .obs-table td {
          padding: 16px 18px;
          font-size: 13px;
          color: #b8b0a0;
          font-weight: 300;
        }

        .obs-table td:first-child {
          font-weight: 400;
          color: #d8d0c0;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .obs-table td:not(:first-child) { text-align: center; }

        .obs-table td:last-child {
          text-align: right;
          font-weight: 600;
          color: #e8c87a;
          font-size: 14px;
        }

        .obs-section-total {
          text-align: right;
          padding: 10px 0 0;
          font-size: 11px;
        }

        .obs-section-total-label {
          color: #5a5248;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-right: 12px;
          font-size: 10px;
        }

        .obs-section-total-val {
          color: #c49c54;
          font-weight: 600;
          font-size: 13px;
        }

        /* ── Billing box ── */
        .obs-billing-wrap {
          padding: 0 52px;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 48px;
        }

        .obs-billing-box {
          width: 340px;
          border: 1px solid rgba(196,156,84,0.25);
          position: relative;
          overflow: hidden;
        }

        .obs-billing-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c49c54, #e8c87a 50%, #c49c54);
        }

        .obs-billing-rows {
          padding: 24px 24px 16px;
        }

        .obs-billing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 12px;
        }

        .obs-billing-row-label {
          color: #6a6258;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 10px;
          font-weight: 500;
        }

        .obs-billing-row-val {
          color: #b8b0a0;
          font-weight: 400;
        }

        .obs-billing-discount { color: #6db891 !important; }

        .obs-grand-total-row {
          padding: 20px 24px;
          background: rgba(196,156,84,0.08);
          border-top: 1px solid rgba(196,156,84,0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .obs-grand-label {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-style: italic;
          color: #c49c54;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .obs-grand-val {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #e8c87a;
        }

        /* ── Bottom split ── */
        .obs-bottom {
          margin: 0 52px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          border-top: 1px solid rgba(196,156,84,0.12);
          padding-top: 36px;
          padding-bottom: 52px;
        }

        .obs-bottom-title {
          font-size: 10px;
          font-weight: 600;
          color: #c49c54;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .obs-bottom-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(196,156,84,0.15);
        }

        .obs-terms li {
          display: flex;
          gap: 10px;
          font-size: 12px;
          font-weight: 300;
          color: #6a6258;
          margin-bottom: 10px;
          line-height: 1.65;
          list-style: none;
        }

        .obs-terms li::before {
          content: '—';
          color: #c49c54;
          flex-shrink: 0;
          font-weight: 400;
        }

        .obs-bank-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .obs-bank-label {
          font-size: 10px;
          font-weight: 500;
          color: #4a4840;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .obs-bank-val {
          font-size: 13px;
          font-weight: 500;
          color: #d0c8b8;
          letter-spacing: 0.04em;
        }

        .obs-bank-val.gold { color: #c49c54; }

        /* ── Corner ornaments ── */
        .obs-ornament {
          position: absolute;
          width: 40px;
          height: 40px;
          pointer-events: none;
        }

        .obs-ornament.tl { top: 16px; left: 16px; border-top: 1px solid rgba(196,156,84,0.3); border-left: 1px solid rgba(196,156,84,0.3); }
        .obs-ornament.tr { top: 16px; right: 16px; border-top: 1px solid rgba(196,156,84,0.3); border-right: 1px solid rgba(196,156,84,0.3); }
        .obs-ornament.bl { bottom: 16px; left: 16px; border-bottom: 1px solid rgba(196,156,84,0.3); border-left: 1px solid rgba(196,156,84,0.3); }
        .obs-ornament.br { bottom: 16px; right: 16px; border-bottom: 1px solid rgba(196,156,84,0.3); border-right: 1px solid rgba(196,156,84,0.3); }

        /* ── Footer ── */
        .obs-footer {
          text-align: center;
          padding: 0 0 32px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 10px;
          color: #3a3830;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="obsidian-wrap">
        {/* Corner ornaments */}
        <div className="obs-ornament tl" />
        <div className="obs-ornament tr" />
        <div className="obs-ornament bl" />
        <div className="obs-ornament br" />

        {/* ── HEADER ── */}
        <div className="obs-header">
          <div className="obs-logo-wrap">
            {quote.companyLogo ? (
              <img src={quote.companyLogo} alt="Logo" style={{ width: 56, height: 56, objectFit: "contain" }} />
            ) : (
              <div className="obs-logo-box">🏛️</div>
            )}
            <div>
              <h1 className="obs-company-name">{quote.companyName}</h1>
              <p className="obs-company-sub">{quote.companyPhone} &nbsp;·&nbsp; {quote.companyEmail}</p>
            </div>
          </div>

          <div className="obs-meta">
            <h2 className="obs-quotation-title">Quotation</h2>
            <div className="obs-ref-row">
              <div className="obs-ref-item">
                <span className="obs-label">Date</span>
                <span className="obs-ref-val">{quote.date}</span>
              </div>
              <div className="obs-ref-item">
                <span className="obs-label">Reference</span>
                <span className="obs-ref-val">{quote.quotationNo}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gold-rule" style={{ margin: "0 52px" }} />

        {/* ── CLIENT ── */}
        <div className="obs-client-band" style={{ marginTop: 32 }}>
          <p className="obs-client-eyebrow">Prepared Exclusively For</p>
          <h3 className="obs-client-name">{quote.clientName}</h3>
          <p className="obs-client-addr">{quote.clientAddress}</p>
        </div>

        {/* ── SECTIONS ── */}
        <div className="obs-sections">
          {sections.map((sec, idx) => (
            <div className="obs-section" key={idx}>
              <div className="obs-section-header">
                <span className="obs-section-num">0{idx + 1}</span>
                <h4 className="obs-section-title">{sec.title}</h4>
                <div className="obs-section-line" />
              </div>

              <table className="obs-table">
                <thead>
                  <tr>
                    <th>Description of Work</th>
                    <th>Labour</th>
                    <th>Material</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sec.items?.map((item, i) => (
                    <tr key={i}>
                      <td>{item.desc}</td>
                      <td>{safeFormat(item.labour)}</td>
                      <td>{safeFormat(item.material)}</td>
                      <td>₹ {safeFormat(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="obs-section-total">
                <span className="obs-section-total-label">Section Total</span>
                <span className="obs-section-total-val">₹ {safeFormat(sec.sectionTotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── BILLING ── */}
        <div className="obs-billing-wrap">
          <div className="obs-billing-box">
            <div className="obs-billing-rows">
              <div className="obs-billing-row">
                <span className="obs-billing-row-label">Subtotal</span>
                <span className="obs-billing-row-val">₹ {safeFormat(quote.subtotal)}</span>
              </div>
              {Number(quote.discount) > 0 && (
                <div className="obs-billing-row">
                  <span className="obs-billing-row-label">Discount</span>
                  <span className="obs-billing-row-val obs-billing-discount">− ₹ {safeFormat(quote.discount)}</span>
                </div>
              )}
              {Number(quote.tax) > 0 && (
                <div className="obs-billing-row">
                  <span className="obs-billing-row-label">GST / Tax</span>
                  <span className="obs-billing-row-val">₹ {safeFormat(quote.tax)}</span>
                </div>
              )}
            </div>
            <div className="obs-grand-total-row">
              <span className="obs-grand-label">Grand Total</span>
              <span className="obs-grand-val">₹ {safeFormat(quote.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ── */}
        <div className="obs-bottom">
          {/* Terms */}
          <div>
            <p className="obs-bottom-title">Terms &amp; Conditions</p>
            <ul className="obs-terms" style={{ padding: 0, margin: 0 }}>
              {quote.terms?.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          {/* Bank */}
          <div>
            <p className="obs-bottom-title">Payment Details</p>
            {[
              ["Bank", quote.bankDetails?.bankName, false],
              ["Account No.", quote.bankDetails?.accNo, false],
              ["IFSC Code", quote.bankDetails?.ifsc, true],
              ...(quote.bankDetails?.accHolder ? [["Account Holder", quote.bankDetails.accHolder, false]] : []),
            ].map(([label, val, isGold]) => (
              <div className="obs-bank-row" key={label}>
                <span className="obs-bank-label">{label}</span>
                <span className={`obs-bank-val${isGold ? " gold" : ""}`}>{val || "—"}</span>
              </div>
            ))}

            {/* Signature */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(196,156,84,0.1)", textAlign: "right" }}>
              <div style={{ width: 160, height: 1, background: "rgba(196,156,84,0.3)", marginLeft: "auto", marginBottom: 8 }} />
              <p style={{ fontSize: 10, fontWeight: 500, color: "#4a4840", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
                Authorised Signatory
              </p>
            </div>
          </div>
        </div>

        <div className="gold-rule" style={{ margin: "0 52px", marginBottom: 24 }} />
        <div className="obs-footer">VisionX Intelligence — Premium Document</div>
      </div>
    </>
  );
}