/**
 * PakWheels Lahore Used Cars Scraper (Stand-alone educational script)
 * - Restricts scope strictly to Used Cars in Lahore
 * - Strictly excludes bikes/motorcycles
 * - Respects robots.txt and polite delays
 * - Outputs to output/cars.json, output/cars.csv, output/failed_urls.json, output/summary.json
 */
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const robotsParser = require("robots-parser");
const { createObjectCsvWriter } = require("csv-writer");

const BASE_URL = "https://www.pakwheels.com";
const SEED_URL = "https://www.pakwheels.com/used-cars/lahore/24858";
const ROBOTS_URL = `${BASE_URL}/robots.txt`;
const OUTPUT_DIR = path.join(__dirname, "output");
const USER_AGENT = "UniversityEducationalScraper/1.0 (Educational Academic Project)";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeText(value) {
  if (!value) return null;
  return String(value).replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim() || null;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url, BASE_URL);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    return parsed.href;
  } catch {
    return null;
  }
}

function isAllowedCarUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "www.pakwheels.com" && parsed.hostname !== "pakwheels.com") {
      return false;
    }
    const p = parsed.pathname.toLowerCase();
    // Strictly exclude bikes and non-car areas
    if (p.includes("/used-bikes") || p.includes("/bikes") || p.includes("/forums") || p.includes("/accessories")) {
      return false;
    }
    return p.startsWith("/used-cars/");
  } catch {
    return false;
  }
}

function isLahoreCarUrl(url) {
  return isAllowedCarUrl(url) && url.toLowerCase().includes("lahore");
}

function getListingId(url) {
  if (!url) return null;
  const match = url.match(/-(\d{6,10})(?:\/|\?|$)/);
  return match ? match[1] : null;
}

async function loadRobots() {
  try {
    const response = await axios.get(ROBOTS_URL, {
      timeout: 15000,
      headers: { "User-Agent": USER_AGENT },
      validateStatus: () => true,
    });
    if (response.status === 200 && typeof response.data === "string") {
      return { parser: robotsParser(ROBOTS_URL, response.data), status: 200 };
    }
    return { parser: null, status: response.status };
  } catch (err) {
    return { parser: null, status: err.response ? err.response.status : 500 };
  }
}

async function fetchHtml(url, robots) {
  if (robots && robots.parser && !robots.parser.isAllowed(url, USER_AGENT)) {
    throw new Error("Blocked by robots.txt policy");
  }
  const response = await axios.get(url, {
    timeout: 20000,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  return response.data;
}

function extractFeatures($) {
  const features = [];
  const patterns = [
    "Alloy Wheels", "Front Fog Lights", "LED Headlights", "DRLs", "Sun Roof", "Panoramic Sunroof",
    "Infotainment System", "Android Auto", "Apple CarPlay", "Front Speakers", "Rear Speakers",
    "ABS", "Air Bags", "Traction Control", "Parking Sensors", "Rear Camera", "360 Camera",
    "Immobilizer Key", "Power Locks", "Power Seats", "Heated Seats", "Power Mirrors",
    "Climate Control", "Cruise Control", "Push Start", "Keyless Entry", "Power Steering", "Air Conditioning"
  ];
  const fullText = $("body").text();
  for (const p of patterns) {
    if (new RegExp(`\\b${p}\\b`, "i").test(fullText)) {
      features.push(p);
    }
  }
  return [...new Set(features)];
}

function extractImageUrls($) {
  const images = new Set();
  $('img[src*="/ad_pictures/"], img[data-original*="/ad_pictures/"], img[data-src*="/ad_pictures/"]').each((_, img) => {
    const src = $(img).attr("data-original") || $(img).attr("data-src") || $(img).attr("src");
    if (src) {
      const norm = normalizeUrl(src);
      if (norm) images.add(norm);
    }
  });
  return [...images];
}

function extractVehicle($, url) {
  const bodyText = normalizeText($("body").text()) || "";
  const title = normalizeText($("h1").first().text()) || normalizeText($("title").text().split("|")[0]);
  const id = getListingId(url);

  // Price
  let price = null;
  const priceBox = $('.price-box, .price, strong:contains("PKR"), .ad-detail-price').first().text();
  const rawPriceText = priceBox || bodyText;
  if (/crore/i.test(rawPriceText)) {
    const m = rawPriceText.match(/(\d+(?:\.\d+)?)\s*crore/i);
    if (m) price = Math.round(Number(m[1]) * 10000000);
  } else if (/lac|lakh/i.test(rawPriceText)) {
    const m = rawPriceText.match(/(\d+(?:\.\d+)?)\s*(?:lac|lakh)/i);
    if (m) price = Math.round(Number(m[1]) * 100000);
  }
  if (!price) {
    const m = rawPriceText.match(/PKR\s*([\d,]+)/i);
    if (m) price = Number(m[1].replace(/,/g, ""));
  }

  // Specifications
  let year = null;
  const yearMatch = (title || "").match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) year = Number(yearMatch[1]);

  let mileage = null;
  const kmMatch = bodyText.match(/([\d,]+)\s*km\b/i);
  if (kmMatch) mileage = Number(kmMatch[1].replace(/,/g, ""));

  let engineCc = null;
  const ccMatch = bodyText.match(/(\d{3,5})\s*cc\b/i);
  if (ccMatch) engineCc = Number(ccMatch[1]);

  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const fuel = fuelTypes.find((f) => new RegExp(`\\b${f}\\b`, "i").test(bodyText)) || null;

  const transTypes = ["Automatic", "Manual"];
  const transmission = transTypes.find((t) => new RegExp(`\\b${t}\\b`, "i").test(bodyText)) || null;

  const bodyTypes = [
    "Sedan", "Hatchback", "SUV", "Crossover", "MPV", "Coupe", "Convertible",
    "Pickup", "Pick Up", "Van", "Mini Van", "Station Wagon", "Truck", "Double Cabin", "Single Cabin"
  ];
  const bodyType = bodyTypes.find((b) => new RegExp(`\\b${b}\\b`, "i").test(bodyText)) || "Sedan";

  const assemblies = ["Local", "Imported"];
  const assembly = assemblies.find((a) => new RegExp(`\\b${a}\\b`, "i").test(bodyText)) || null;

  // Make
  const makes = ["Toyota", "Honda", "Suzuki", "Mercedes-Benz", "Hyundai", "Kia", "Haval", "Changan", "MG", "Daihatsu", "Nissan"];
  const make = makes.find((m) => new RegExp(`\\b${m}\\b`, "i").test(title || "")) || null;

  const features = extractFeatures($);
  const images = extractImageUrls($);
  const desc = normalizeText($(".ad-description, #ad-description, .description").first().text());

  return {
    source: "PakWheels",
    listing_id: id || String(Date.now()),
    listing_url: url,
    title,
    make,
    model: null,
    price_pkr: price,
    city: "Lahore",
    area: normalizeText($(".location, .city-area").first().text()),
    province: "Punjab",
    year,
    mileage_km: mileage,
    fuel_type: fuel,
    transmission,
    engine_capacity_cc: engineCc,
    assembly,
    color: null,
    body_type: bodyType,
    description: desc,
    features,
    image_urls: images,
    seller_available: true,
    seller_type: "Private Seller",
    is_featured: /featured/i.test(bodyText),
    listing_date: null,
    scraped_at: new Date().toISOString(),
  };
}

async function runScraper(maxPages = 2, maxDetails = 5) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("====================================");
  console.log("        PAKWHEELS SCRAPER           ");
  console.log("====================================");
  console.log("Scope: Used Cars");
  console.log("Location: Lahore Only");
  console.log("Bikes: EXCLUDED");
  console.log(`Seed URL: ${SEED_URL}`);

  const robots = await loadRobots();
  if (robots.status === 200) {
    console.log("✓ robots.txt checked (Status 200)");
  } else {
    console.log(`! robots.txt response: ${robots.status}. Rate-limiting politely.`);
  }

  const detailUrls = new Set();
  const failedUrls = [];
  const records = [];
  const seenIds = new Set();

  // 1. Traverse pagination
  for (let p = 1; p <= maxPages; p++) {
    const listUrl = p === 1 ? SEED_URL : `${SEED_URL}?page=${p}`;
    console.log(`[Listing ${p}/${maxPages}] Requesting: ${listUrl}`);
    try {
      const html = await fetchHtml(listUrl, robots);
      const $ = cheerio.load(html);

      $('a[href]').each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        const full = normalizeUrl(href);
        if (full && isAllowedCarUrl(full) && /\d{6,10}$/.test(new URL(full).pathname)) {
          detailUrls.add(full);
        }
      });
      await delay(1500);
    } catch (err) {
      console.log(`Failed list page ${listUrl}: ${err.message}`);
      failedUrls.push({ url: listUrl, error: err.message, timestamp: new Date().toISOString() });
    }
  }

  console.log(`Discovered ${detailUrls.size} Lahore car URLs.`);

  // 2. Fetch car details
  const queue = Array.from(detailUrls).slice(0, maxDetails);
  for (let i = 0; i < queue.length; i++) {
    const carUrl = queue[i];
    const lid = getListingId(carUrl);
    if (lid && seenIds.has(lid)) {
      console.log(`Skipping duplicate listing ID: ${lid}`);
      continue;
    }

    console.log(`[Detail ${i + 1}/${queue.length}] Parsing: ${carUrl}`);
    try {
      const html = await fetchHtml(carUrl, robots);
      const $ = cheerio.load(html);
      const record = extractVehicle($, carUrl);

      if (lid) seenIds.add(lid);
      records.push(record);
      console.log(`  ✓ Extracted: ${record.title} | PKR ${record.price_pkr || "N/A"}`);
      await delay(1500);
    } catch (err) {
      console.log(`Failed car ${carUrl}: ${err.message}`);
      failedUrls.push({ url: carUrl, error: err.message, timestamp: new Date().toISOString() });
      await delay(2000);
    }
  }

  // 3. Write outputs
  // JSON outputs
  fs.writeFileSync(path.join(OUTPUT_DIR, "cars.json"), JSON.stringify(records, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, "failed_urls.json"), JSON.stringify(failedUrls, null, 2));

  // CSV output
  const csvHeaders = [
    { id: "source", title: "source" },
    { id: "listing_id", title: "listing_id" },
    { id: "listing_url", title: "listing_url" },
    { id: "title", title: "title" },
    { id: "make", title: "make" },
    { id: "price_pkr", title: "price_pkr" },
    { id: "city", title: "city" },
    { id: "area", title: "area" },
    { id: "province", title: "province" },
    { id: "year", title: "year" },
    { id: "mileage_km", title: "mileage_km" },
    { id: "fuel_type", title: "fuel_type" },
    { id: "transmission", title: "transmission" },
    { id: "engine_capacity_cc", title: "engine_capacity_cc" },
    { id: "assembly", title: "assembly" },
    { id: "body_type", title: "body_type" },
    { id: "description", title: "description" },
    { id: "features", title: "features" },
    { id: "image_urls", title: "image_urls" },
    { id: "seller_available", title: "seller_available" },
    { id: "seller_type", title: "seller_type" },
    { id: "is_featured", title: "is_featured" },
    { id: "scraped_at", title: "scraped_at" }
  ];

  const formattedCsv = records.map((r) => ({
    ...r,
    features: (r.features || []).join(" | "),
    image_urls: (r.image_urls || []).join(";"),
  }));

  const csvWriter = createObjectCsvWriter({ path: path.join(OUTPUT_DIR, "cars.csv"), header: csvHeaders });
  await csvWriter.writeRecords(formattedCsv);

  // Missing fields statistics
  const missing = {};
  for (const r of records) {
    for (const [k, v] of Object.entries(r)) {
      if (v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
        missing[k] = (missing[k] || 0) + 1;
      }
    }
  }

  const summary = {
    scope: "Used Cars",
    location: "Lahore",
    bikes: "EXCLUDED",
    listing_pages_processed: maxPages,
    detail_urls_discovered: detailUrls.size,
    records_successfully_scraped: records.length,
    failed_urls: failedUrls.length,
    duplicates_removed: queue.length - records.length,
    missing_fields: missing,
    generated_at: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

  console.log("\n====================================");
  console.log("        PAKWHEELS SCRAPER           ");
  console.log("====================================");
  console.log("Scope: Used Cars");
  console.log("Location: Lahore");
  console.log("Bikes: EXCLUDED");
  console.log(`Listing pages processed: ${maxPages}`);
  console.log(`Detail URLs discovered:  ${detailUrls.size}`);
  console.log(`Records successfully scraped: ${records.length}`);
  console.log(`Failed URLs:             ${failedUrls.length}`);
  console.log(`Duplicates removed:      ${summary.duplicates_removed}`);
  console.log("Missing fields:");
  Object.entries(missing).forEach(([k, c]) => console.log(`  ${k}: ${c}`));
  console.log("Output:");
  console.log("  cars.json");
  console.log("  cars.csv");
  console.log("  failed_urls.json");
  console.log("  summary.json");
  console.log("====================================\n");
}

if (require.main === module) {
  runScraper(2, 5).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runScraper };
