# Academic Project Report
## Web Scraping, Structural Analysis, and Modern Hybrid Application: PakWheels.com (Lahore Cars Scope)

**Project Title:** Educational Web Scraping and Automotive Marketplace Platform for Lahore Used Cars  
**Branded Prototype:** Cars Kingdom LTD  
**Repository:** [https://github.com/ahmadkhan32/Car-Kingdown-Ltd](https://github.com/ahmadkhan32/Car-Kingdown-Ltd)  
**Live Production Deployment (Vercel):** [https://car-kingdown-ltd.vercel.app](https://car-kingdown-ltd.vercel.app)  

---

### Chapter 1 — Introduction
#### 1.1 Project Background
Automotive marketplaces are complex web applications that combine dynamic search, multi-faceted filtering, dealer and private seller advertisements, multimedia galleries, and editorial content. PakWheels ([https://www.pakwheels.com/](https://www.pakwheels.com/)) is Pakistan's largest automotive portal, handling millions of monthly visits and tens of thousands of active vehicle listings.

#### 1.2 Objectives & Educational Purpose
This university project achieves two interconnected milestones:
1. **Part A (Data Analysis & Web Scraping):** Implement an ethical, responsible web scraper using Node.js, Axios, and Cheerio to analyze publicly accessible Used Cars listed in Lahore, evaluate data quality, measure missing fields, and handle pagination and deduplication.
2. **Part B (Modern Frontend & Headless CMS):** Build a high-performance React application branded as **Cars Kingdom LTD** integrated with a custom PHP WordPress theme featuring Custom Post Types (`ck_car`, `ck_new_car`, `ck_review`), custom REST API endpoints, and full Elementor page-builder support.

#### 1.3 Scope Constraints
- **Geographic Focus:** Lahore city only (`/used-cars/lahore/`).
- **Vehicle Type:** **Cars only**. Bikes, motorcycles, and forums are strictly excluded from the application and scraping scope.
- **Ethical Boundary:** Zero attempts to bypass login mechanisms, CAPTCHA, private accounts, masked seller phone numbers, or HTTP access restrictions.

---

### Chapter 2 — Website & Architectural Analysis
#### 2.1 Website Classification: Hybrid Application
Contrary to common misconceptions, PakWheels is **not purely a WordPress site**. It is classified as a **hybrid platform**:
- **Main Marketplace / Used Cars:** Custom high-concurrency web application backed by relational/NoSQL datastores.
- **New Car Catalog & Specifications:** Automotive database engine with variant comparisons.
- **Blog & News:** CMS-oriented editorial system (traditionally WordPress-patterned).
- **Forums:** Dedicated community forum platform.

#### 2.2 Navigation Hierarchy & Seed Discovery
The crawl map originates at the Lahore Used Cars landing page:
```
pakwheels.com
└── Used Cars
    └── Lahore (/used-cars/lahore/)
        ├── Pagination (Page 1, 2, 3...)
        ├── Category / Body Type Filters (Sedan, Hatchback, SUV, Luxury)
        ├── Make & Model Discovery (Toyota, Honda, Suzuki, Mercedes)
        └── Individual Car Detail Pages (/used-cars/<slug>-<listing_id>)
```

---

### Chapter 3 — Technical Analysis & Tool Evaluation
#### 3.1 Scraping Stack: Axios + Cheerio vs. Playwright
| Feature / Criteria | Axios + Cheerio (Selected) | Playwright / Puppeteer |
|---|---|---|
| **Resource Efficiency** | Extremely lightweight; low RAM and CPU | Heavy Chromium browser instances |
| **Execution Speed** | Fast HTTP stream parsing (<200ms per request) | Slower due to DOM lifecycle & rendering |
| **Server-Rendered HTML** | ✅ Full access to title, specs, price, images | ✅ Full access |
| **Headless Overhead** | Minimal network traffic | Significant headless overhead |
| **Suitability for Project** | **Ideal for public listing & detail pages** | Unnecessary resource overhead for static public listings |

#### 3.2 HTML Elements & Resilient Selectors
Rather than relying on auto-generated or volatile CSS class names, the scraper employs semantic tags and structured markup:
- Headings & Metadata: `h1`, `title`, `<meta property="og:title">`
- Structured Data: `<script type="application/ld+json">`
- Specification Tables: `table tr`, `ul.detail-list li`, `.ad-data li`
- Pagination: `a[rel="next"]`, `li.next a`

---

### Chapter 4 — Crawling & Scraping Methodology
#### 4.1 Pipeline Architecture
```
robots.txt Ingestion
        │
        ▼
Permitted URL Discovery & Validation (Lahore + Cars Only; Bike Excluded)
        │
        ▼
Listing Page Extraction (Pagination Discovery + Car Detail Links)
        │
        ▼
Rate-Limited HTTP Request (1.2s - 1.5s Polite Delay)
        │
        ▼
Cheerio HTML + JSON-LD Parsing
        │
        ▼
Normalization (Price / Currency / Mileage / Strings)
        │
        ▼
Deduplication (1. listing_id -> 2. Canonical URL -> 3. SHA-1 Hash)
        │
        ▼
Export to CSV, JSON, Failed URLs Log, and Execution Summary
```

#### 4.2 Handling Missing Values & Phone Masking
In strict adherence to academic ethics and real-world data science best practices, missing attributes are saved as `null` (or `[]` for lists) rather than fabricated values. Public seller phone numbers that require interactive click-to-reveal or authenticated access are preserved as `null`.

---

### Chapter 5 — Database & Data Schemas
#### 5.1 CSV Schema
`record_id, record_type, listing_id, title, category, subcategory, make, model, version, year, price, currency, mileage_km, fuel_type, engine_cc, transmission, body_type, color, assembly, address, city, location, phone, email, website, description, features, opening_hours, rating, review_count, seller_type, seller_name, dealer_name, image_url, image_urls, author, publication_date, tags, listing_url, source_page, scraped_at`

#### 5.2 JSON Document Schema
```json
{
  "record_id": "11934294",
  "record_type": "used_car",
  "listing_id": "11934294",
  "title": "Toyota Corolla Altis Grande 2021",
  "category": "Used Cars",
  "subcategory": "Sedan",
  "vehicle": {
    "make": "Toyota",
    "model": "Corolla",
    "version": "Altis Grande 1.8",
    "year": 2021,
    "body_type": "Sedan",
    "color": "White",
    "assembly": "Local"
  },
  "pricing": {
    "price": 6030000,
    "currency": "PKR"
  },
  "specifications": {
    "mileage_km": 45000,
    "fuel_type": "Petrol",
    "engine_cc": 1800,
    "transmission": "Automatic"
  },
  "location": {
    "city": "Lahore",
    "location": "DHA Phase 5, Lahore"
  },
  "features": ["ABS", "Air Conditioning", "Airbags", "Sunroof", "Cruise Control"],
  "images": ["https://.../car-sedan.jpg"],
  "listing_url": "https://www.pakwheels.com/used-cars/toyota-corolla-2021-for-sale-in-lahore-11934294",
  "source_page": "https://www.pakwheels.com/used-cars/lahore/",
  "scraped_at": "2026-10-06T12:00:00.000Z"
}
```

#### 5.3 MongoDB Schema
```javascript
{
  recordId: { type: String, unique: true, index: true },
  recordType: { type: String, default: "used_car" },
  listingId: { type: String, index: true },
  title: String,
  category: String,
  subcategory: String,
  vehicle: {
    make: { type: String, index: true },
    model: { type: String, index: true },
    version: String,
    year: { type: Number, index: true },
    bodyType: String,
    color: String,
    assembly: String
  },
  pricing: {
    amount: Number,
    currency: String
  },
  specifications: {
    mileageKm: Number,
    fuelType: String,
    engineCc: Number,
    transmission: String
  },
  location: {
    city: { type: String, index: true },
    location: String
  },
  features: [String],
  images: [String],
  url: String,
  sourcePage: String,
  scrapedAt: Date
}
```

---

### Chapter 6 — Cars Kingdom LTD Application
#### 6.1 React.js Frontend
- **Framework:** React 19 + Vite 8.
- **Routing:** React Router v7.
- **Design System:** Vanilla CSS custom design tokens, dark automotive aesthetic with gold highlights (`#f5b942`), subtle Framer Motion micro-animations.
- **Pages:**
  - `Home.jsx`: Lahore featured cars, new cars showroom, car owner reviews, automotive research, auto parts.
  - `Cars.jsx`: Used cars listing with AJAX-style live filtering (make, body type, year, min/max price, transmission, fuel) without full-page reloads.
  - `CarDetail.jsx`: Vehicle specifications table, HD photo gallery, features checklist.
  - `NewCars.jsx` & detail: Showroom catalog for new vehicle models.
  - `Reviews.jsx` & detail: Owner reviews with star ratings.
  - `Blog.jsx` & detail: Articles and market research guides.
  - `Parts.jsx` & `CartDrawer.jsx`: Auto accessories with cart state management.
  - `Browse.jsx`: Category, make, and city routing.

#### 6.2 WordPress PHP Theme (`cars-kingdom`)
- **Custom Post Types:** `ck_car` (Used Cars), `ck_new_car` (New Cars), `ck_review` (Car Reviews).
- **Taxonomies:** `ck_make`, `ck_city`, `ck_body`.
- **Elementor Support:** Registered via `elementor_cpt_support` hook, enabling drag-and-drop page editing on all vehicle post types.
- **Headless REST API:** Custom `/wp-json/carskingdom/v1/{cars, newCars, reviews, posts, makes, cities}` endpoints with CORS headers.

---

### Chapter 7 — Results & Execution Summary
The crawler execution against live PakWheels Lahore Used Cars produced the following verified operational metrics (recorded in `pakwheels-scraper/output/summary.json`):
- **Seed Route:** `https://www.pakwheels.com/used-cars/lahore/24858`
- **Scope Enforced:** Lahore Used Cars (Cars only; 0 bikes crawled).
- **Pages Discovered:** 186 pages
- **Pages Processed:** 5 pages
- **Successful Pages:** 5 pages (100% success rate)
- **Failed Pages:** 0
- **Total Records Found:** 3 records
- **Successful Records Extracted:** 3 records
  - *Toyota Corolla Altis SR 1.8 2010* — PKR 2,950,000 (Lahore)
  - *Haval Jolion HEV 2024* — PKR 8,500,000 (Liberty Market, Lahore)
  - *Toyota Passo Moda S 2016* — PKR 3,300,000 (Liberty Market, Lahore)
- **Duplicates Removed:** 0
- **Missing Field Analysis:**
  - Missing Price: 0
  - Missing City: 0
  - Missing Image: 0
  - Missing Description: 3
  - Missing Engine CC: 3
  - Missing Mileage: 3
- **Outputs Stored:** `output/cars.csv`, `output/cars.json`, `output/failed_urls.json`, `output/summary.json`.

---

### Chapter 8 — Limitations & Recommendations
1. **Dynamic Inventory:** Used vehicle listings expire or update continuously; scraping represents a point-in-time snapshot.
2. **Rate Limiting:** Production scrapers should respect HTTP 429 and implement exponential backoff.
3. **Endpoint Restrictions:** Certain metadata endpoints on commercial automotive sites return HTTP 403 to automated scripts, which our pipeline handles without crashing.

---

### Chapter 9 — Conclusion
The project satisfies all academic requirements: thorough structural analysis of PakWheels.com, an educational Node.js scraper focused on Lahore used cars, and a modern, responsive React frontend integrated with a WordPress PHP theme supporting Elementor. All bike elements were excluded, and code is committed to GitHub and deployed live on Vercel.
