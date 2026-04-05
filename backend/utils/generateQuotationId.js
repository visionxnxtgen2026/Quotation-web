// ==============================
// 🔥 GENERATE QUOTATION ID
// Format: QT-AB12CD-4821
// ==============================

export const generateQuotationId = () => {
  // 🔹 Random 6-character alphanumeric
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  // 🔹 Last 4 digits of timestamp
  const timePart = Date.now().toString().slice(-4);

  // 🔹 Final ID
  return `QT-${randomPart}-${timePart}`;
};