# Cars Kingdom LTD (PakWheels Lahore Cars Educational Platform)

Automotive marketplace web application and research platform modeled after **PakWheels.com**, focused exclusively on **Cars in Lahore** (Bikes and motorcycles are completely excluded).

- **GitHub Repository:** [https://github.com/ahmadkhan32/Car-Kingdown-Ltd](https://github.com/ahmadkhan32/Car-Kingdown-Ltd)
- **Live Vercel Production URL:** [https://car-kingdown-ltd.vercel.app](https://car-kingdown-ltd.vercel.app)
- **Academic Research Report:** [REPORT.md](./REPORT.md)

---

## Project Structure

| Directory / File | Description |
|---|---|
| `src/`, `public/` | React 19 + Vite 8 frontend deployed on Vercel |
| `wordpress-theme/cars-kingdom/` | Custom PHP WordPress Theme (`ck_car`, `ck_new_car`, `ck_review`), REST API, Elementor support |
| `pakwheels-scraper/` | Node.js + Axios + Cheerio educational crawler & parser for Lahore Used Cars |
| `REPORT.md` | Complete 9-chapter university academic project report |
| `vercel.json` | Vercel production SPA rewrite rules |

---

## 1. React Frontend (Cars Only)
- **Scope:** Used Cars (Lahore), New Cars, Car Reviews, Lahore Blog/Guides, Auto Parts. (Bikes strictly excluded).
- **Features:**
  - **User Car Listings (`/sell`):** Users can list and publish used cars for sale in Lahore, manage listings, and display verified car cards.
  - **All Used Car Body Types:** Sedan, Hatchback, SUV, Crossover, Compact SUV, Coupe, Convertible, MPV, Mini Van, Pickup, Double Cabin, Van, Station Wagon, Luxury.
  - AJAX live search and multi-criteria filters without full page reloads.
  - HD responsive photography (sedan, SUV, sports, hatchback, luxury).
  - Headless integration with WordPress REST API (`/wp-json/carskingdom/v1/*`) and WooCommerce Store API cart.
  - Bundled high-fidelity offline fallback data in `src/data/sampleData.js`.

### Local Development
```bash
npm install
npm run dev
```

---

## 2. WordPress PHP Theme (`wordpress-theme/cars-kingdom`)
- **PHP Version:** PHP 8+ compatible.
- **Custom Post Types:**
  - `ck_car` (Used Cars)
  - `ck_new_car` (New Cars)
  - `ck_review` (Car Reviews)
- **Taxonomies:** Makes (`ck_make`), Cities (`ck_city`), Body Types (`ck_body`).
- **Elementor Support:** Registered via `elementor_cpt_support`, allowing Elementor drag-and-drop page editing on all vehicle post types.
- **REST API:**
  - `GET /wp-json/carskingdom/v1/cars` (supports `q, make, city, year, minPrice, maxPrice, fuel, transmission, body, page, per_page`)
  - `POST /wp-json/carskingdom/v1/cars` (allows submitting user car listings)
  - `GET /wp-json/carskingdom/v1/newCars`
  - `GET /wp-json/carskingdom/v1/reviews`
  - `GET /wp-json/carskingdom/v1/makes`
  - `GET /wp-json/carskingdom/v1/cities`
  - `GET /wp-json/carskingdom/v1/bodies`

---

## 3. Educational Web Scraper (`pakwheels-scraper`)
- **Stack:** Node.js, Axios, Cheerio, robots-parser, csv-writer.
- **Seed:** `https://www.pakwheels.com/used-cars/lahore/24858`
- **Output:**
  - `output/cars.csv`
  - `output/cars.json`
  - `output/failed_urls.json`
  - `output/summary.json`

### Running the Scraper
```bash
cd pakwheels-scraper
npm install
npm start
```

---

## 4. Deployment
- **Frontend:** Auto-deploys to Vercel via GitHub `main` branch: `https://car-kingdown-ltd.vercel.app`
- **WordPress Backend:** Upload `wordpress-theme/cars-kingdom` to any PHP WordPress hosting provider and point `VITE_WP_API_URL` to the domain.
