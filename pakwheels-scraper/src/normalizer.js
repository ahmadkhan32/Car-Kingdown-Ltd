const crypto = require("crypto");

const BASE_URL = "https://www.pakwheels.com";

function normalizeText(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : null;
}

function normalizePrice(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).replace(/,/g, "");
  // Matches PKR 35.5 Lac or PKR 1.2 Crore or numeric strings
  if (/crore/i.test(str)) {
    const m = str.match(/(\d+(?:\.\d+)?)/);
    return m ? Math.round(Number(m[1]) * 10000000) : null;
  }
  if (/lac|lakh/i.test(str)) {
    const m = str.match(/(\d+(?:\.\d+)?)/);
    return m ? Math.round(Number(m[1]) * 100000) : null;
  }
  const m = str.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function normalizeNumber(value) {
  if (value === null || value === undefined) return null;
  const clean = String(value).replace(/,/g, "");
  const m = clean.match(/\d+/);
  return m ? Number(m[0]) : null;
}

function normalizeUrl(value, base = BASE_URL) {
  if (!value) return null;
  try {
    const u = new URL(value, base);
    // Remove tracking query params like utm_source
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    return u.href;
  } catch {
    return null;
  }
}

function normalizeCity(value) {
  const t = normalizeText(value);
  if (!t) return null;
  return t.replace(/\b\w/g, (c) => c.toUpperCase());
}

function getRecordKey(record) {
  if (record.listing_id) {
    return `id:${record.listing_id}`;
  }
  if (record.listing_url) {
    return `url:${record.listing_url}`;
  }
  // Fallback hash
  const hash = crypto.createHash("sha1").update(String(record.title || "") + String(record.price || "")).digest("hex");
  return `hash:${hash}`;
}

module.exports = {
  normalizeText,
  normalizePrice,
  normalizeNumber,
  normalizeUrl,
  normalizeCity,
  getRecordKey,
};
