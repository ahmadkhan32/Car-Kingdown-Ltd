# PakWheels Lahore Used Cars Scraper (Educational Project)

A responsible Node.js crawler and parser designed to analyze publicly accessible Used Cars in Lahore from PakWheels.com.

## Key Features
- **Strict Scope**: Lahore Used Cars only. Bikes and motorcycles are strictly excluded.
- **Responsible Crawling**: Respects `robots.txt`, safe delay between requests (1.2–1.5s), and never bypasses authentication, CAPTCHA, or masked seller numbers.
- **Robust Pipeline**: Axios + Cheerio with fallback JSON-LD parsing.
- **Normalization & Deduplication**: Standardizes currency/prices, mileage, years, and eliminates duplicate listings via `listing_id` and canonical URL hashing.
- **Comprehensive Output**:
  - `output/cars.csv`
  - `output/cars.json`
  - `output/failed_urls.json`
  - `output/summary.json`

## Installation & Running
```bash
cd pakwheels-scraper
npm install
npm start
```
To run a quick sample crawl:
```bash
npm test
```
