import React from "react";

/**
 * SOVEREIGN — Premium Formal Template
 * Aesthetic: Deep navy + warm white + crimson seal. Government tender / enterprise contract energy.
 * Font: Cormorant Garamond (display) + IBM Plex Sans (body)
 */
export default function SovereignTemplate({ data }) {
  const quote = data || {
    companyName: "Meridian Infrastructure",
    companyEmail: "contracts@meridian.co.in",
    companyPhone: "+91 44 4200 8800",
    clientName: "Tamil Nadu Housing Board",
    clientAddress: "No. 1, Bhagavandas Road, T. Nagar, Chennai — 600 017",
    quotationNo: "MIL/CHN/2026/Q-114",
    date: "05-04-2026",
    sections: [
      {
        title: "Civil & Structural Preparation",
        items: [
          { desc: "Wall Putty Application — 3 Coats\nISI Grade material, crack-resistant base", labour: "18.00", material: "27.00", total: "45.00" },
          { desc: "Cement Primer — 2 Coats\nAlkali-resistant formulation", labour: "9.00", material: "13.00", total: "22.00" },
        ],
        sectionTotal: "67.00",
      },
      {
        title: "Protective Coating & Finishing",
        items: [
          { desc: "Exterior Weathershield Paint — 2 Coats\nApproved brand, 8-year warranty", labour: "16.00", material: "38.00", total: "54.00" },
          { desc: "Roof Waterproofing Treatment\nBituminous compound + fibre mesh", labour: "24.00", material: "44.00", total: "68.00" },
        ],
        sectionTotal: "122.00",
      },
    ],
    subtotal: "189.00",
    discount: "9.00",
    tax: "3.00",
    grandTotal: "183.00",
    terms: [
      "Works to be executed strictly as per approved drawings and specifications.",
      "Payment schedule: 40% mobilisation advance, 50% on completion, 10% upon certification.",
      "Defect liability period: 12 months from certified date of completion.",
      "All materials shall conform to relevant IS specifications.",
      "Contractor to maintain site safety and cleanliness throughout works.",
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accNo: "3302 1456 7890",
      ifsc: "SBIN0007248",
      accHolder: "Meridian Infrastructure Ltd.",
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

        .sovereign-wrap * { box-sizing: border-box; }

        .sovereign-wrap {
          background: #f8f6f1;
          min-height: 297mm;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #1a1e2e;
          position: relative;
        }

        /* ── Watermark crest ── */
        .sov-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 280px;
          opacity: 0.018;
          pointer-events: none;
          user-select: none;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: #0c1535;
          z-index: 0;
          letter-spacing: -.05em;
        }

        .sov-inner { position: relative; z-index: 1; }

        /* ── Navy header block ── */
        .sov-header-block {
          background: #0c1535;
          padding: 0;
          position: relative;
          overflow: hidden;
        }

        .sov-header-block::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c0392b 0%, #e74c3c 40%, #c0392b 100%);
        }

        /* subtle grid pattern on header */
        .sov-header-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .sov-header-inner {
          padding: 36px 52px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
        }

        .sov-logo-square {
          width: 56px;
          height: 56px;
          border: 1px solid rgba(255,255,255,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          background: rgba(255,255,255,.05);
          flex-shrink: 0;
        }

        .sov-company-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          color: #f0ece0;
          letter-spacing: .03em;
          margin: 0 0 4px;
          line-height: 1.1;
        }

        .sov-company-sub {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,.35);
          letter-spacing: .08em;
          margin: 0;
        }

        /* Crimson seal badge */
        .sov-seal {
          background: #c0392b;
          color: #fff;
          padding: 10px 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          position: relative;
        }

        .sov-seal::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 0;
          bottom: 0;
          width: 0;
          border-style: solid;
          border-width: 0 0 100% 12px;
          border-color: transparent transparent #c0392b transparent;
        }

        .sov-seal-word {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          line-height: 1;
        }

        .sov-seal-sub {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .25em;
          text-transform: uppercase;
          color: rgba(255,255,255,.6);
        }

        /* ── Ref strip ── */
        .sov-ref-strip {
          background: #111829;
          padding: 14px 52px;
          display: flex;
          gap: 48px;
          align-items: center;
        }

        .sov-ref-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sov-ref-lbl {
          font-size: 9px;
          font-weight: 600;
          color: rgba(255,255,255,.28);
          text-transform: uppercase;
          letter-spacing: .22em;
        }

        .sov-ref-val {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,.75);
          letter-spacing: .04em;
        }

        .sov-ref-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,.08);
        }

        /* ── Client block ── */
        .sov-client-block {
          margin: 36px 52px;
          border: 1px solid #d8d0c0;
          padding: 28px 32px;
          background: #ffffff;
          position: relative;
        }

        /* Red left accent bar */
        .sov-client-block::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #c0392b;
        }

        .sov-client-eyebrow {
          font-size: 9px;
          font-weight: 600;
          color: #c0392b;
          text-transform: uppercase;
          letter-spacing: .28em;
          margin: 0 0 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sov-client-eyebrow::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e0d0;
        }

        .sov-client-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #0c1535;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .sov-client-addr {
          font-size: 12px;
          font-weight: 300;
          color: #6a6258;
          margin: 0;
          line-height: 1.65;
        }

        /* ── Sections ── */
        .sov-sections {
          padding: 0 52px;
          margin-bottom: 36px;
        }

        .sov-sec {
          margin-bottom: 36px;
        }

        .sov-sec-title-bar {
          background: #0c1535;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 0;
        }

        .sov-sec-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          font-style: italic;
          color: rgba(255,255,255,.35);
          min-width: 28px;
        }

        .sov-sec-title {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: #f0ece0;
          text-transform: uppercase;
          letter-spacing: .18em;
          margin: 0;
        }

        table.sov {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d8d0c0;
          border-top: none;
          background: #fff;
        }

        table.sov thead tr {
          background: #f4f0e8;
          border-bottom: 1px solid #d8d0c0;
        }

        table.sov th {
          padding: 10px 18px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .2em;
          color: #8a8070;
        }

        table.sov th:first-child { text-align: left; }
        table.sov th:not(:first-child) { text-align: center; width: 88px; }
        table.sov th:last-child { text-align: right; width: 110px; }

        table.sov tbody tr {
          border-bottom: 1px solid #f0ece8;
        }

        table.sov tbody tr:nth-child(even) {
          background: #fdfbf8;
        }

        table.sov td {
          padding: 14px 18px;
          font-size: 12px;
          color: #6a6258;
          font-weight: 400;
        }

        table.sov td:first-child {
          font-weight: 500;
          color: #1a1e2e;
          white-space: pre-wrap;
          line-height: 1.65;
        }

        table.sov td:not(:first-child) { text-align: center; }

        table.sov td:last-child {
          text-align: right;
          font-weight: 700;
          color: #0c1535;
          font-size: 13px;
        }

        .sov-sec-footer {
          background: #f4f0e8;
          border: 1px solid #d8d0c0;
          border-top: 1px solid #c8c0b0;
          padding: 10px 18px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
        }

        .sov-sec-total-lbl {
          font-size: 9px;
          font-weight: 600;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .2em;
        }

        .sov-sec-total-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 700;
          color: #0c1535;
        }

        /* ── Totals ── */
        .sov-totals-wrap {
          padding: 0 52px;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 44px;
        }

        .sov-totals-panel {
          width: 360px;
          border: 1px solid #d8d0c0;
          background: #fff;
          overflow: hidden;
        }

        .sov-totals-rows {
          padding: 20px 24px 12px;
        }

        .sov-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0ece8;
          font-size: 12px;
        }

        .sov-total-lbl {
          font-size: 10px;
          font-weight: 600;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .15em;
        }

        .sov-total-val { color: #4a4840; font-weight: 500; }
        .sov-total-disc { color: #27ae60 !important; }

        .sov-grand-bar {
          background: #0c1535;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .sov-grand-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c0392b, #e74c3c 50%, #c0392b);
        }

        .sov-grand-lbl {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 500;
          font-style: italic;
          color: rgba(255,255,255,.6);
          text-transform: uppercase;
          letter-spacing: .2em;
        }

        .sov-grand-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 700;
          color: #f0ece0;
        }

        /* ── Bottom ── */
        .sov-bottom {
          padding: 0 52px 52px;
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 40px;
        }

        .sov-bottom-head {
          font-size: 9px;
          font-weight: 600;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .25em;
          margin: 0 0 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #d8d0c0;
          display: block;
        }

        .sov-terms {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sov-terms li {
          display: flex;
          gap: 12px;
          font-size: 11.5px;
          font-weight: 400;
          color: #6a6258;
          margin-bottom: 9px;
          line-height: 1.65;
        }

        .sov-term-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c0392b;
          flex-shrink: 0;
          margin-top: 6px;
        }

        .sov-bank-rows {
          background: #fff;
          border: 1px solid #d8d0c0;
          padding: 18px 20px;
        }

        .sov-bank-row {
          display: flex;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #f0ece8;
          font-size: 12px;
        }

        .sov-bank-row:last-child { border-bottom: none; }

        .sov-bank-lbl {
          font-size: 9px;
          font-weight: 600;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .15em;
        }

        .sov-bank-val {
          font-weight: 600;
          color: #1a1e2e;
        }

        .sov-bank-val.navy { color: #0c1535; }

        /* ── Official footer ── */
        .sov-official-footer {
          margin: 0 52px;
          padding: 20px 0 24px;
          border-top: 1px solid #d8d0c0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .sov-footer-stamp {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sov-footer-stamp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 600;
          color: #0c1535;
        }

        .sov-footer-stamp-sub {
          font-size: 9px;
          font-weight: 400;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .15em;
        }

        .sov-footer-sig {
          text-align: right;
        }

        .sov-sig-line {
          width: 150px;
          height: 1px;
          background: #0c1535;
          margin-bottom: 7px;
          margin-left: auto;
        }

        .sov-sig-lbl {
          font-size: 9px;
          font-weight: 600;
          color: #8a8070;
          text-transform: uppercase;
          letter-spacing: .2em;
        }
      `}</style>

      <div className="sovereign-wrap">
        <div className="sov-watermark">M</div>
        <div className="sov-inner">

          {/* ── NAVY HEADER ── */}
          <div className="sov-header-block">
            <div className="sov-header-inner">
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {quote.companyLogo ? (
                  <img src={quote.companyLogo} alt="Logo" style={{ width: 56, height: 56, objectFit: "contain" }} />
                ) : (
                  <div className="sov-logo-square">🏗️</div>
                )}
                <div>
                  <h1 className="sov-company-name">{quote.companyName}</h1>
                  <p className="sov-company-sub">{quote.companyPhone} &nbsp;|&nbsp; {quote.companyEmail}</p>
                </div>
              </div>

              <div className="sov-seal">
                <span className="sov-seal-word">Quotation</span>
                <span className="sov-seal-sub">Formal Proposal</span>
              </div>
            </div>

            {/* Ref strip */}
            <div className="sov-ref-strip">
              <div className="sov-ref-item">
                <span className="sov-ref-lbl">Reference No.</span>
                <span className="sov-ref-val">{quote.quotationNo}</span>
              </div>
              <div className="sov-ref-divider" />
              <div className="sov-ref-item">
                <span className="sov-ref-lbl">Date of Issue</span>
                <span className="sov-ref-val">{quote.date}</span>
              </div>
              <div className="sov-ref-divider" />
              <div className="sov-ref-item">
                <span className="sov-ref-lbl">Status</span>
                <span className="sov-ref-val" style={{ color: "#e74c3c" }}>Awaiting Approval</span>
              </div>
            </div>
          </div>

          {/* ── CLIENT ── */}
          <div className="sov-client-block">
            <div className="sov-client-eyebrow">Submitted To</div>
            <h3 className="sov-client-name">{quote.clientName}</h3>
            <p className="sov-client-addr">{quote.clientAddress}</p>
          </div>

          {/* ── SECTIONS ── */}
          <div className="sov-sections">
            {sections.map((sec, idx) => (
              <div className="sov-sec" key={idx}>
                <div className="sov-sec-title-bar">
                  <span className="sov-sec-num">§ {String(idx + 1).padStart(2, "0")}</span>
                  <h4 className="sov-sec-title">{sec.title}</h4>
                </div>

                <table className="sov">
                  <thead>
                    <tr>
                      <th>Description of Work / Item</th>
                      <th>Labour</th>
                      <th>Material</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.desc}</td>
                        <td>{safeFormat(item.labour)}</td>
                        <td>{safeFormat(item.material)}</td>
                        <td>{safeFormat(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="sov-sec-footer">
                  <span className="sov-sec-total-lbl">Section Sub-Total</span>
                  <span className="sov-sec-total-val">₹ {safeFormat(sec.sectionTotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── TOTALS ── */}
          <div className="sov-totals-wrap">
            <div className="sov-totals-panel">
              <div className="sov-totals-rows">
                <div className="sov-total-row">
                  <span className="sov-total-lbl">Gross Amount</span>
                  <span className="sov-total-val">₹ {safeFormat(quote.subtotal)}</span>
                </div>
                {Number(quote.discount) > 0 && (
                  <div className="sov-total-row">
                    <span className="sov-total-lbl">Less: Discount</span>
                    <span className="sov-total-val sov-total-disc">− ₹ {safeFormat(quote.discount)}</span>
                  </div>
                )}
                {Number(quote.tax) > 0 && (
                  <div className="sov-total-row">
                    <span className="sov-total-lbl">Add: GST / Tax</span>
                    <span className="sov-total-val">₹ {safeFormat(quote.tax)}</span>
                  </div>
                )}
              </div>
              <div className="sov-grand-bar">
                <span className="sov-grand-lbl">Net Payable Amount</span>
                <span className="sov-grand-val">₹ {safeFormat(quote.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ── */}
          <div className="sov-bottom">
            <div>
              <span className="sov-bottom-head">Terms &amp; Conditions</span>
              <ul className="sov-terms">
                {quote.terms?.map((t, i) => (
                  <li key={i}>
                    <div className="sov-term-bullet" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="sov-bottom-head">Bank Account Details</span>
              <div className="sov-bank-rows">
                {[
                  ["Bank Name", quote.bankDetails?.bankName],
                  ["Account No.", quote.bankDetails?.accNo],
                  ["IFSC Code", quote.bankDetails?.ifsc],
                  ...(quote.bankDetails?.accHolder ? [["Account Holder", quote.bankDetails.accHolder]] : []),
                ].map(([label, val]) => (
                  <div className="sov-bank-row" key={label}>
                    <span className="sov-bank-lbl">{label}</span>
                    <span className="sov-bank-val">{val || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── OFFICIAL FOOTER ── */}
          <div className="sov-official-footer">
            <div className="sov-footer-stamp">
              <span className="sov-footer-stamp-title">{quote.companyName}</span>
              <span className="sov-footer-stamp-sub">VisionX Intelligence — Certified Document</span>
            </div>
            <div className="sov-footer-sig">
              <div className="sov-sig-line" />
              <span className="sov-sig-lbl">Authorised Signatory &amp; Seal</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}