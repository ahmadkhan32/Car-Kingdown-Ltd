# Cars Kingdom LTD

Automotive marketplace (used cars, bikes, new cars, reviews, blog, auto parts).

| Folder | What it is |
|---|---|
| `src/`, `public/` | React + Vite frontend (deployed on Vercel) |
| `wordpress-theme/cars-kingdom/` | PHP WordPress theme: CPTs, REST API, Elementor support |

## Frontend
```bash
npm install
npm run dev
```
Set `VITE_WP_API_URL=https://your-wordpress-site.com` to read data from WordPress
(`/wp-json/carskingdom/v1/*`) and use the WooCommerce Store API cart.
Without it, the app falls back to bundled demo data in `src/data/sampleData.js`.

## WordPress theme (PHP)
Vercel cannot run PHP/WordPress. Zip `wordpress-theme/cars-kingdom`, upload it on a PHP host
(Appearance → Themes), install Elementor (and WooCommerce for parts), and add content under
Used Cars / Used Bikes / New Cars / Reviews. Elementor can edit pages and all vehicle post types.

REST endpoints: `cars`, `bikes`, `newCars`, `reviews`, `posts`, `makes`, `cities`
with `q, make, city, year, minPrice, maxPrice, fuel, transmission, page, per_page`.

## Deploy
Vercel auto-detects Vite. `vercel.json` provides SPA rewrites.
