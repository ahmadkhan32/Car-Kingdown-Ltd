const axios = require("axios");
const { loadRobots, isUrlAllowed, BASE_URL } = require("./robots");
const { parseListingPage, parseCarDetailPage } = require("./parser");
const { getRecordKey } = require("./normalizer");

const USER_AGENT = "UniversityResearchScraper/1.0 (Educational Academic Project)";

// Allowed prefixes: Lahore used cars only, cars only, NO bikes!
const SEED_URL = "https://www.pakwheels.com/used-cars/lahore/24858";

function isCarUrlAllowed(url) {
  try {
    const u = new URL(url);
    if (u.hostname !== "www.pakwheels.com" && u.hostname !== "pakwheels.com") {
      return false;
    }
    const path = u.pathname.toLowerCase();
    // Strict exclusion of bikes and irrelevant paths
    if (path.includes("/bikes") || path.includes("/used-bikes") || path.includes("/forums")) {
      return false;
    }
    return path.startsWith("/used-cars/");
  } catch {
    return false;
  }
}

async function fetchPage(url) {
  const res = await axios.get(url, {
    timeout: 20000,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  });
  return res.data;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCrawl(options = {}) {
  const maxListPages = options.maxListPages || 3;
  const maxDetailPages = options.maxDetailPages || 15;
  const delayMs = options.delayMs || 1500;

  console.log("==================================================");
  console.log("Starting Educational Lahore Used Cars Crawler");
  console.log(`Seed URL: ${SEED_URL}`);
  console.log(`Scope: Lahore Used Cars Only (Excluded: Bikes)`);
  console.log(`Max List Pages: ${maxListPages}, Max Detail Pages: ${maxDetailPages}`);
  console.log("==================================================");

  const robotsInfo = await loadRobots(USER_AGENT);
  if (robotsInfo.status === 200) {
    console.log("✓ robots.txt fetched successfully.");
  } else {
    console.log(`! robots.txt returned HTTP ${robotsInfo.status} (${robotsInfo.message}). Proceeding with polite rate limit.`);
  }

  const listQueue = [SEED_URL];
  const detailQueue = [];
  const visitedUrls = new Set();
  const failedUrls = [];
  const records = [];
  const seenRecordKeys = new Set();

  let listPagesProcessed = 0;
  let detailPagesProcessed = 0;
  let duplicatesRemoved = 0;

  // Step 1: Crawl listing pages with pagination
  while (listQueue.length > 0 && listPagesProcessed < maxListPages) {
    const currentListUrl = listQueue.shift();
    if (visitedUrls.has(currentListUrl)) continue;
    visitedUrls.add(currentListUrl);

    if (!isUrlAllowed(robotsInfo, currentListUrl, USER_AGENT)) {
      console.log(`[Robots Disallow] Skipping list page: ${currentListUrl}`);
      continue;
    }

    console.log(`[Listing ${listPagesProcessed + 1}/${maxListPages}] Fetching: ${currentListUrl}`);
    try {
      const html = await fetchPage(currentListUrl);
      const parsed = parseListingPage(html, currentListUrl);
      listPagesProcessed++;

      for (const dUrl of parsed.detailUrls) {
        if (!visitedUrls.has(dUrl) && isCarUrlAllowed(dUrl)) {
          detailQueue.push(dUrl);
        }
      }

      if (parsed.nextUrl && !visitedUrls.has(parsed.nextUrl) && isCarUrlAllowed(parsed.nextUrl)) {
        listQueue.push(parsed.nextUrl);
      }
    } catch (err) {
      console.error(`! Failed list page: ${currentListUrl} - ${err.message}`);
      failedUrls.push({
        url: currentListUrl,
        status: err.response ? err.response.status : 500,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }

    await sleep(delayMs);
  }

  console.log(`Found ${detailQueue.length} car detail URLs to inspect.`);

  // Step 2: Crawl car detail pages
  while (detailQueue.length > 0 && detailPagesProcessed < maxDetailPages) {
    const detailUrl = detailQueue.shift();
    if (visitedUrls.has(detailUrl)) continue;
    visitedUrls.add(detailUrl);

    if (!isUrlAllowed(robotsInfo, detailUrl, USER_AGENT)) {
      console.log(`[Robots Disallow] Skipping car detail: ${detailUrl}`);
      continue;
    }

    console.log(`[Detail ${detailPagesProcessed + 1}/${maxDetailPages}] Fetching car: ${detailUrl}`);
    try {
      const html = await fetchPage(detailUrl);
      const record = parseCarDetailPage(html, detailUrl);
      detailPagesProcessed++;

      const key = getRecordKey(record);
      if (seenRecordKeys.has(key)) {
        duplicatesRemoved++;
        console.log(`  (Duplicate listing detected: ${key})`);
      } else {
        seenRecordKeys.add(key);
        records.push(record);
        console.log(`  ✓ Parsed: ${record.title} (PKR ${record.price || "N/A"})`);
      }
    } catch (err) {
      console.error(`! Failed car detail page: ${detailUrl} - ${err.message}`);
      failedUrls.push({
        url: detailUrl,
        status: err.response ? err.response.status : 500,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }

    await sleep(delayMs);
  }

  // Calculate missing field statistics
  const missingStats = {
    price: records.filter((r) => r.price === null).length,
    description: records.filter((r) => !r.description).length,
    city: records.filter((r) => !r.city).length,
    image: records.filter((r) => !r.image_url).length,
    engine_cc: records.filter((r) => r.engine_cc === null).length,
    mileage_km: records.filter((r) => r.mileage_km === null).length,
  };

  const summary = {
    website: "PakWheels.com",
    scope: "Lahore Used Cars (Bikes excluded)",
    pages_discovered: visitedUrls.size + listQueue.length + detailQueue.length,
    pages_processed: listPagesProcessed + detailPagesProcessed,
    successful_pages: Math.max(0, (listPagesProcessed + detailPagesProcessed) - failedUrls.length),
    failed_pages: failedUrls.length,
    records_found: records.length + duplicatesRemoved,
    successful_records: records.length,
    duplicates_removed: duplicatesRemoved,
    missing_fields: missingStats,
    started_at: new Date(Date.now() - (listPagesProcessed + detailPagesProcessed) * delayMs).toISOString(),
    finished_at: new Date().toISOString(),
  };

  return {
    records,
    failedUrls,
    summary,
  };
}

module.exports = {
  runCrawl,
  SEED_URL,
};
