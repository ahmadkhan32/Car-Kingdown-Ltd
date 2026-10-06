export const normalizeText = (v) => (v ? String(v).replace(/\s+/g, " ").trim() || null : null);
export const normalizePrice = (v) => {
  if (!v) return null;
  const m = String(v).replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
