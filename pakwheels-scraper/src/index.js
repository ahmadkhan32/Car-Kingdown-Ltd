const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const { runCrawl } = require("./crawler");

const OUTPUT_DIR = path.join(__dirname, "..", "output");

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Parse command line arguments if any
  const args = process.argv.slice(2);
  let maxListPages = 2;
  let maxDetailPages = 10;

  for (const arg of args) {
    if (arg.startsWith("--limit=")) {
      maxDetailPages = Number(arg.split("=")[1]) || 10;
    }
    if (arg.startsWith("--list-pages=")) {
      maxListPages = Number(arg.split("=")[1]) || 2;
    }
  }

  const { records, failedUrls, summary } = await runCrawl({
    maxListPages,
    maxDetailPages,
    delayMs: 1200,
  });

  // 1. Write CSV with exact university schema
  const csvPath = path.join(OUTPUT_DIR, "cars.csv");
  const csvHeaders = [
    { id: "record_id", title: "record_id" },
    { id: "record_type", title: "record_type" },
    { id: "listing_id", title: "listing_id" },
    { id: "title", title: "title" },
    { id: "category", title: "category" },
    { id: "subcategory", title: "subcategory" },
    { id: "make", title: "make" },
    { id: "model", title: "model" },
    { id: "version", title: "version" },
    { id: "year", title: "year" },
    { id: "price", title: "price" },
    { id: "currency", title: "currency" },
    { id: "mileage_km", title: "mileage_km" },
    { id: "fuel_type", title: "fuel_type" },
    { id: "engine_cc", title: "engine_cc" },
    { id: "transmission", title: "transmission" },
    { id: "body_type", title: "body_type" },
    { id: "color", title: "color" },
    { id: "assembly", title: "assembly" },
    { id: "address", title: "address" },
    { id: "city", title: "city" },
    { id: "location", title: "location" },
    { id: "phone", title: "phone" },
    { id: "email", title: "email" },
    { id: "website", title: "website" },
    { id: "description", title: "description" },
    { id: "features", title: "features" },
    { id: "opening_hours", title: "opening_hours" },
    { id: "rating", title: "rating" },
    { id: "review_count", title: "review_count" },
    { id: "seller_type", title: "seller_type" },
    { id: "seller_name", title: "seller_name" },
    { id: "dealer_name", title: "dealer_name" },
    { id: "image_url", title: "image_url" },
    { id: "image_urls", title: "image_urls" },
    { id: "author", title: "author" },
    { id: "publication_date", title: "publication_date" },
    { id: "tags", title: "tags" },
    { id: "listing_url", title: "listing_url" },
    { id: "source_page", title: "source_page" },
    { id: "scraped_at", title: "scraped_at" },
  ];

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: csvHeaders,
  });

  const formattedForCsv = records.map((r) => ({
    ...r,
    features: Array.isArray(r.features) ? r.features.join(", ") : r.features,
    image_urls: Array.isArray(r.image_urls) ? r.image_urls.join(";") : r.image_urls,
  }));

  await csvWriter.writeRecords(formattedForCsv);

  // 2. Write JSON
  const jsonPath = path.join(OUTPUT_DIR, "cars.json");
  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf8");

  // 3. Write Failed URLs
  const failedPath = path.join(OUTPUT_DIR, "failed_urls.json");
  fs.writeFileSync(failedPath, JSON.stringify(failedUrls, null, 2), "utf8");

  // 4. Write Summary JSON
  const summaryPath = path.join(OUTPUT_DIR, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");

  // 5. Print summary
  console.log("\n========================================");
  console.log("    PAKWHEELS LAHORE SCRAPING SUMMARY   ");
  console.log("========================================");
  console.log(`Pages discovered:     ${summary.pages_discovered}`);
  console.log(`Pages processed:      ${summary.pages_processed}`);
  console.log(`Successful pages:     ${summary.successful_pages}`);
  console.log(`Failed pages:         ${summary.failed_pages}`);
  console.log(`Records found:        ${summary.records_found}`);
  console.log(`Successful records:   ${summary.successful_records}`);
  console.log(`Duplicates removed:   ${summary.duplicates_removed}`);
  console.log(`Missing price:        ${summary.missing_fields.price}`);
  console.log(`Missing description:  ${summary.missing_fields.description}`);
  console.log(`Missing city:         ${summary.missing_fields.city}`);
  console.log(`Missing image:        ${summary.missing_fields.image}`);
  console.log(`CSV saved:            output/cars.csv`);
  console.log(`JSON saved:           output/cars.json`);
  console.log(`Failed URLs:          output/failed_urls.json`);
  console.log(`Summary saved:        output/summary.json`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("Scraper execution error:", err);
  process.exit(1);
});
