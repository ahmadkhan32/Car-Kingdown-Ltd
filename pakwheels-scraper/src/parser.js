const cheerio = require("cheerio");
const {
  normalizeText,
  normalizePrice,
  normalizeNumber,
  normalizeUrl,
  normalizeCity,
} = require("./normalizer");

const BASE_URL = "https://www.pakwheels.com";

/**
 * Extracts JSON-LD scripts from HTML for structured data fallback.
 */
function extractJsonLd($) {
  const list = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html());
      list.push(parsed);
    } catch {
      // Ignore malformed JSON-LD
    }
  });
  return list;
}

/**
 * Parses a Used Car Listing Page (Lahore focus).
 * Returns car detail URLs and next page URL.
 */
function parseListingPage(html, currentUrl) {
  const $ = cheerio.load(html);
  const detailUrls = new Set();

  // Find all links to used cars
  $('a[href]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    // Strict Car filter: exclude bikes, forums, parts, blog
    if (href.includes("/used-bikes/") || href.includes("/bikes/") || href.includes("/forums/")) {
      return;
    }

    // PakWheels car listing URL pattern typically contains: /used-cars/...-<listing_id>
    const full = normalizeUrl(href, BASE_URL);
    if (!full) return;

    const parsed = new URL(full);
    // Detail listing pages match /used-cars/<slug>-<numeric_id>
    if (parsed.pathname.startsWith("/used-cars/") && /\d{6,10}$/.test(parsed.pathname)) {
      detailUrls.add(full);
    }
  });

  // Extract pagination "Next" page link
  let nextUrl = null;
  const nextEl = $('a[rel="next"], li.next a, a:contains("Next"), a:contains("Next »")').first();
  if (nextEl.length) {
    const nextHref = nextEl.attr("href");
    if (nextHref) {
      nextUrl = normalizeUrl(nextHref, BASE_URL);
    }
  }

  // Fallback pagination: look for current page + 1
  if (!nextUrl) {
    const curPageMatch = currentUrl.match(/page=(\d+)/);
    const curPage = curPageMatch ? Number(curPageMatch[1]) : 1;
    const nextPageEl = $(`a[href*="page=${curPage + 1}"]`).first();
    if (nextPageEl.length) {
      nextUrl = normalizeUrl(nextPageEl.attr("href"), BASE_URL);
    }
  }

  return {
    detailUrls: Array.from(detailUrls),
    nextUrl,
  };
}

/**
 * Parses an individual Car Detail Page.
 */
function parseCarDetailPage(html, url) {
  const $ = cheerio.load(html);
  const jsonLd = extractJsonLd($);

  // Listing ID: from URL or DOM or data attributes
  let listingId = null;
  const idFromUrl = url.match(/-(\d{6,10})(?:\?|$)/);
  if (idFromUrl) {
    listingId = idFromUrl[1];
  }

  // Title
  let title = normalizeText($("h1").first().text());
  if (!title) {
    title = normalizeText($("title").text().split("|")[0]);
  }

  // Price
  let price = null;
  const priceText = $('.price-box, .price, strong:contains("PKR"), .ad-detail-price, [data-price]').first().text();
  if (priceText) {
    price = normalizePrice(priceText);
  }

  // Check JSON-LD for price or vehicle attributes
  for (const item of jsonLd) {
    if (item.offers && item.offers.price) {
      price = price || normalizePrice(item.offers.price);
    }
    if (item.name && !title) {
      title = normalizeText(item.name);
    }
  }

  // Key-value specifications from details grid / table
  const specs = {};
  $("table tr, ul.detail-list li, .ad-data li, .ad-specifications li").each((_, el) => {
    const text = $(el).text();
    const parts = text.split(/[:\n\t]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const k = parts[0].toLowerCase();
      const v = parts.slice(1).join(" ");
      specs[k] = v;
    }
  });

  const getSpec = (keys) => {
    for (const k of keys) {
      for (const [sk, sv] of Object.entries(specs)) {
        if (sk.includes(k.toLowerCase())) return sv;
      }
    }
    return null;
  };

  const year = normalizeNumber(getSpec(["year", "model year"])) || normalizeNumber((title || "").match(/\b(19\d\d|20\d\d)\b/)?.[0]);
  const mileageKm = normalizeNumber(getSpec(["mileage", "km"]));
  const engineCc = normalizeNumber(getSpec(["engine", "capacity", "cc"]));
  const fuelType = normalizeText(getSpec(["fuel", "fuel type"]));
  const transmission = normalizeText(getSpec(["transmission", "gear"]));
  const bodyType = normalizeText(getSpec(["body", "body type"]));
  const color = normalizeText(getSpec(["color", "exterior color"]));
  const assembly = normalizeText(getSpec(["assembly"]));
  const city = normalizeCity(getSpec(["city", "registered in"]) || "Lahore");
  const location = normalizeText($(".location, .city-area, [itemprop='address']").first().text()) || `${city}, Pakistan`;

  // Make & Model inference
  const commonMakes = ["Toyota", "Honda", "Suzuki", "Mercedes-Benz", "Mercedes", "Hyundai", "Kia", "Nissan", "Daihatsu", "BMW", "Audi", "Changan", "MG", "Ferrari", "Porsche"];
  let make = null;
  let model = null;
  if (title) {
    for (const m of commonMakes) {
      if (new RegExp(`\\b${m}\\b`, "i").test(title)) {
        make = m;
        const afterMake = title.slice(title.indexOf(m) + m.length).trim().split(" ");
        if (afterMake.length) model = afterMake[0];
        break;
      }
    }
  }

  // Description
  const description = normalizeText($(".ad-description, #ad-description, .description, [itemprop='description']").first().text());

  // Features list
  const features = [];
  $(".car-feature-list li, .ad-features li, ul.features li").each((_, el) => {
    const f = normalizeText($(el).text());
    if (f) features.push(f);
  });

  // Images
  const imageUrls = [];
  $('img[src*="/ad_pictures/"], img[data-original*="/ad_pictures/"], img[data-src*="/ad_pictures/"], .ad-gallery img').each((_, el) => {
    const src = $(el).attr("data-original") || $(el).attr("data-src") || $(el).attr("src");
    const full = normalizeUrl(src, BASE_URL);
    if (full && !imageUrls.includes(full)) {
      imageUrls.push(full);
    }
  });

  // Dealer / Seller info
  const sellerType = normalizeText($(".seller-type, .badge-seller").first().text()) || "Private Seller";
  const dealerName = normalizeText($(".dealer-name, .seller-name").first().text());

  return {
    record_id: listingId || String(Date.now()),
    record_type: "used_car",
    listing_id: listingId,
    title,
    category: "Used Cars",
    subcategory: bodyType || "Sedan",
    make,
    model,
    version: null,
    year,
    price,
    currency: "PKR",
    mileage_km: mileageKm,
    fuel_type: fuelType,
    engine_cc: engineCc,
    transmission,
    body_type: bodyType,
    color,
    assembly,
    address: null,
    city,
    location,
    phone: null, // As required: no circumvention of contact-reveal controls
    email: null,
    website: null,
    description,
    features,
    opening_hours: null,
    rating: null,
    review_count: null,
    seller_type: sellerType,
    seller_name: null,
    dealer_name: dealerName,
    image_url: imageUrls[0] || null,
    image_urls: imageUrls,
    author: null,
    publication_date: null,
    tags: null,
    listing_url: url,
    source_page: "https://www.pakwheels.com/used-cars/lahore/",
    scraped_at: new Date().toISOString(),
  };
}

module.exports = {
  extractJsonLd,
  parseListingPage,
  parseCarDetailPage,
};
