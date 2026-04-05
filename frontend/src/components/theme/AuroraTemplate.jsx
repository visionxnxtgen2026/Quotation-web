import React from "react";

/**
 * AURORA — Premium Editorial Template
 * Aesthetic: Arctic white + electric teal + geometric precision
 * Font: Syne (display) + Outfit (body)
 */
export default function AuroraTemplate({ data }) {
  const quote = data || {
    companyName: "Nexus Studio",
    companyEmail: "hello@nexusstudio.in",
    companyPhone: "+91 99400 55678",
    clientName: "Karthik Subramaniam",
    clientAddress: "Plot 7, ECR Coastal Road, Thiruvanmiyur, Chennai — 600 041",
    quotationNo: "NS-AUR-2026-019",
    date: "05-04-2026",
    sections: [
      {
        title: "Interior Surface Works",
        items: [
          { desc: "Wall Putty — 3 Coats\nSurface leveling, crack sealing", labour: "8.00", material: "14.00", total: "22.00" },
          { desc: "Anti-Fungal Primer — 2 Coats\nMoisture barrier treatment", labour: "5.00", material: "8.00", total: "13.00" },
        ],
        sectionTotal: "35.00",
      },
      {
        title: "Exterior Weatherproof Finishing",
        items: [
          { desc: "Apex Weatherproof Emulsion — 2 Coats\n7-year exterior warranty", labour: "10.00", material: "24.00", total: "34.00" },
          { desc: "Texture Finish — Sand Pattern\nFull exterior facade", labour: "18.00", material: "30.00", total: "48.00" },
        ],
        sectionTotal: "82.00",
      },
    ],
    subtotal: "117.00",
    discount: "7.00",
    tax: "2.00",
    grandTotal: "112.00",
    terms: [
      "50% advance required upon confirmation of quotation.",
      "Balance payment due within 7 days of project completion.",
      "All materials carry manufacturer warranty; labour warranty 3 years.",
      "Client to provide electricity and water access throughout project.",
    ],
    bankDetails: {
      bankName: "Axis Bank",
      accNo: "9204 5566 7712",
      ifsc: "UTIB0002340",
      accHolder: "Nexus Studio Pvt. Ltd.",
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

        .aurora-wrap * { box-sizing: border-box; }

        .aurora-wrap {
          background: #ffffff;
          min-height: 297mm;
          font-family: 'Outfit', sans-serif;
          color: #0a0f1a;
          position: relative;
          overflow: hidden;
        }

        /* ── Geometric background shapes ── */
        .aurora-wrap::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(0,210,190,.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .aurora-wrap::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(0,210,190,.12);
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── Teal left spine ── */
        .aurora-spine {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(180deg, #00d2be 0%, #00a896 50%, #007a6e 100%);
        }

        /* ── Header ── */
        .aur-header {
          padding: 44px 52px 0 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .aur-logo-ring {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid #00d2be;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          background: rgba(0,210,190,.04);
        }

        .aur-company-name {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0a0f1a;
          letter-spacing: -.01em;
          margin: 0 0 4px;
          line-height: 1;
        }

        .aur-company-sub {
          font-size: 11px;
          font-weight: 400;
          color: #8090a8;
          letter-spacing: .04em;
          margin: 0;
        }

        /* big teal QUOTATION word */
        .aur-q-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #00d2be;
          text-transform: uppercase;
          letter-spacing: .25em;
          margin: 0 0 6px;
          display: block;
          text-align: right;
        }

        .aur-q-number {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0a0f1a;
          text-align: right;
          margin: 0 0 16px;
        }

        .aur-meta-chips {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .aur-chip {
          border: 1px solid rgba(0,210,190,.3);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 500;
          color: #3a5060;
          background: rgba(0,210,190,.04);
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .aur-chip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00d2be;
          flex-shrink: 0;
        }

        /* ── Diagonal band ── */
        .aur-diagonal-band {
          margin: 32px 52px 0 60px;
          height: 80px;
          background: #0a0f1a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .aur-diagonal-band::before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 200px;
          background: linear-gradient(90deg, transparent, rgba(0,210,190,.12));
        }

        .aur-diagonal-band::after {
          content: '';
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border: 1px solid rgba(0,210,190,.2);
          border-radius: 50%;
        }

        .aur-client-name-band {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -.01em;
        }

        .aur-client-addr-band {
          font-size: 12px;
          font-weight: 300;
          color: #6080a0;
          margin-top: 4px;
        }

        .aur-band-tag {
          font-size: 9px;
          font-weight: 700;
          color: #00d2be;
          text-transform: uppercase;
          letter-spacing: .22em;
          text-align: right;
          position: relative;
          z-index: 1;
        }

        /* ── Sections ── */
        .aur-sections {
          padding: 36px 52px 0 60px;
        }

        .aur-sec {
          margin-bottom: 32px;
        }

        .aur-sec-header {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 0;
          margin-bottom: 0;
        }

        .aur-sec-index-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2px;
        }

        .aur-sec-index-num {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #e8f8f6;
          line-height: 1;
        }

        .aur-sec-index-line {
          width: 1px;
          flex: 1;
          background: linear-gradient(180deg, #00d2be, transparent);
          margin-top: 4px;
          min-height: 16px;
        }

        .aur-sec-title-col {
          padding-left: 12px;
        }

        .aur-sec-title {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #0a0f1a;
          text-transform: uppercase;
          letter-spacing: .14em;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .aur-sec-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8f0f0;
        }

        table.aur {
          width: 100%;
          border-collapse: collapse;
        }

        table.aur thead tr {
          border-bottom: 2px solid #00d2be;
        }

        table.aur th {
          padding: 10px 14px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: #00a896;
        }

        table.aur th:first-child { text-align: left; }
        table.aur th:not(:first-child) { text-align: center; width: 88px; }
        table.aur th:last-child { text-align: right; width: 110px; }

        table.aur tbody tr {
          border-bottom: 1px solid #f0f6f6;
        }

        table.aur tbody tr:hover {
          background: rgba(0,210,190,.02);
        }

        table.aur td {
          padding: 14px 14px;
          font-size: 12px;
          color: #506070;
          font-weight: 400;
        }

        table.aur td:first-child {
          font-weight: 500;
          color: #1a2535;
          white-space: pre-wrap;
          line-height: 1.65;
        }

        table.aur td:not(:first-child) { text-align: center; }

        table.aur td:last-child {
          text-align: right;
          font-weight: 700;
          color: #007a6e;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
        }

        .aur-sec-total {
          text-align: right;
          padding: 8px 0 0;
          font-size: 10px;
        }

        .aur-sec-total-label {
          font-size: 9px;
          color: #b0c0cc;
          text-transform: uppercase;
          letter-spacing: .18em;
          margin-right: 10px;
        }

        .aur-sec-total-val {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #00a896;
        }

        /* ── Totals strip ── */
        .aur-totals-strip {
          margin: 8px 52px 0 60px;
          background: #0a0f1a;
          border-radius: 16px;
          padding: 0;
          display: flex;
          overflow: hidden;
        }

        .aur-totals-left {
          flex: 1;
          padding: 28px 32px;
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .aur-totals-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .aur-totals-lbl {
          font-size: 9px;
          font-weight: 600;
          color: #3a5070;
          text-transform: uppercase;
          letter-spacing: .18em;
        }

        .aur-totals-val {
          font-size: 14px;
          font-weight: 500;
          color: #8090a8;
        }

        .aur-totals-disc { color: #00d2be !important; }

        .aur-grand-block {
          background: linear-gradient(135deg, #00d2be, #007a6e);
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 200px;
        }

        .aur-grand-lbl {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: rgba(255,255,255,.7);
          text-transform: uppercase;
          letter-spacing: .22em;
          margin-bottom: 4px;
        }

        .aur-grand-val {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        /* ── Bottom ── */
        .aur-bottom {
          padding: 36px 52px 52px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .aur-bottom-title {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #0a0f1a;
          text-transform: uppercase;
          letter-spacing: .2em;
          margin: 0 0 18px;
          padding-bottom: 10px;
          border-bottom: 2px solid #00d2be;
          display: inline-block;
        }

        .aur-terms li {
          display: flex;
          gap: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #7090a8;
          margin-bottom: 10px;
          line-height: 1.65;
          list-style: none;
          align-items: flex-start;
        }

        .aur-term-num {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: #00d2be;
          flex-shrink: 0;
          line-height: 1.7;
        }

        .aur-bank-card {
          background: #f4fafa;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(0,210,190,.15);
        }

        .aur-bank-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(0,210,190,.08);
          font-size: 12px;
        }

        .aur-bank-row:last-child { border-bottom: none; }

        .aur-bank-lbl {
          font-size: 10px;
          font-weight: 600;
          color: #90a8b8;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .aur-bank-val {
          font-weight: 600;
          color: #1a2535;
        }

        .aur-bank-val.teal { color: #00a896; }

        /* ── Footer ── */
        .aur-footer {
          margin: 0 52px 24px 60px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .aur-footer-brand {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: #c8d8e0;
          text-transform: uppercase;
          letter-spacing: .3em;
        }

        .aur-footer-sig {
          text-align: right;
        }

        .aur-sig-line {
          width: 130px;
          height: 1px;
          background: #00d2be;
          margin-bottom: 6px;
          margin-left: auto;
        }

        .aur-sig-lbl {
          font-size: 9px;
          font-weight: 600;
          color: #90a8b8;
          text-transform: uppercase;
          letter-spacing: .18em;
        }
      `}</style>

      <div className="aurora-wrap">
        <div className="aurora-spine" />

        {/* ── HEADER ── */}
        <div className="aur-header">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {quote.companyLogo ? (
              <img src={quote.companyLogo} alt="Logo" style={{ width: 54, height: 54, objectFit: "contain", borderRadius: "50%" }} />
            ) : (
              <div className="aur-logo-ring">🌊</div>
            )}
            <div>
              <h1 className="aur-company-name">{quote.companyName}</h1>
              <p className="aur-company-sub">{quote.companyPhone} &nbsp;·&nbsp; {quote.companyEmail}</p>
            </div>
          </div>

          <div>
            <span className="aur-q-label">Quotation</span>
            <p className="aur-q-number">{quote.quotationNo}</p>
            <div className="aur-meta-chips">
              <div className="aur-chip"><div className="aur-chip-dot" />{quote.date}</div>
              <div className="aur-chip"><div className="aur-chip-dot" />Valid 30 Days</div>
            </div>
          </div>
        </div>

        {/* ── CLIENT BAND ── */}
        <div className="aur-diagonal-band">
          <div>
            <div className="aur-client-name-band">{quote.clientName}</div>
            <div className="aur-client-addr-band">{quote.clientAddress}</div>
          </div>
          <div className="aur-band-tag">Prepared For ↗</div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="aur-sections">
          {sections.map((sec, idx) => (
            <div className="aur-sec" key={idx}>
              <div className="aur-sec-header">
                <div className="aur-sec-index-col">
                  <span className="aur-sec-index-num">0{idx + 1}</span>
                  <div className="aur-sec-index-line" />
                </div>
                <div className="aur-sec-title-col">
                  <h4 className="aur-sec-title">{sec.title}</h4>
                  <table className="aur">
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
                  <div className="aur-sec-total">
                    <span className="aur-sec-total-label">Section Total</span>
                    <span className="aur-sec-total-val">₹ {safeFormat(sec.sectionTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TOTALS STRIP ── */}
        <div className="aur-totals-strip">
          <div className="aur-totals-left">
            <div className="aur-totals-item">
              <span className="aur-totals-lbl">Subtotal</span>
              <span className="aur-totals-val">₹ {safeFormat(quote.subtotal)}</span>
            </div>
            {Number(quote.discount) > 0 && (
              <div className="aur-totals-item">
                <span className="aur-totals-lbl">Discount</span>
                <span className="aur-totals-val aur-totals-disc">− ₹ {safeFormat(quote.discount)}</span>
              </div>
            )}
            {Number(quote.tax) > 0 && (
              <div className="aur-totals-item">
                <span className="aur-totals-lbl">GST / Tax</span>
                <span className="aur-totals-val">₹ {safeFormat(quote.tax)}</span>
              </div>
            )}
          </div>
          <div className="aur-grand-block">
            <span className="aur-grand-lbl">Grand Total</span>
            <span className="aur-grand-val">₹ {safeFormat(quote.grandTotal)}</span>
          </div>
        </div>

        {/* ── BOTTOM ── */}
        <div className="aur-bottom">
          <div>
            <div className="aur-bottom-title">Terms &amp; Conditions</div>
            <ul className="aur-terms" style={{ padding: 0, margin: 0 }}>
              {quote.terms?.map((t, i) => (
                <li key={i}>
                  <span className="aur-term-num">{String(i + 1).padStart(2, "0")}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="aur-bottom-title">Payment Details</div>
            <div className="aur-bank-card">
              {[
                ["Bank", quote.bankDetails?.bankName, false],
                ["Account No.", quote.bankDetails?.accNo, false],
                ["IFSC Code", quote.bankDetails?.ifsc, true],
                ...(quote.bankDetails?.accHolder ? [["Account Holder", quote.bankDetails.accHolder, false]] : []),
              ].map(([label, val, isTeal]) => (
                <div className="aur-bank-row" key={label}>
                  <span className="aur-bank-lbl">{label}</span>
                  <span className={`aur-bank-val${isTeal ? " teal" : ""}`}>{val || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="aur-footer">
          <span className="aur-footer-brand">VisionX Intelligence — Premium</span>
          <div className="aur-footer-sig">
            <div className="aur-sig-line" />
            <span className="aur-sig-lbl">Authorised Signatory</span>
          </div>
        </div>
      </div>
    </>
  );
}