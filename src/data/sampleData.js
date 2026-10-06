// Offline fallback used ONLY when VITE_WP_API_URL is not configured.
// When WordPress is connected, all data comes from /wp-json/carskingdom/v1/*
// Cars-only marketplace focused on Lahore used cars, new cars, car reviews and auto parts.

const IMG = {
  sedan: "/images/car-sedan.jpg",
  suv: "/images/car-suv.jpg",
  sports: "/images/car-sports.jpg",
  hatchback: "/images/car-hatchback.jpg",
  luxury: "/images/car-luxury.jpg",
};

const mk = (id, make, model, year, price, mileage_km, fuel_type, transmission, city, body_type, img, engine_cc, version = null) => ({
  id: String(id),
  listing_id: String(11934000 + Number(id)),
  title: `${make} ${model} ${version ? version + ' ' : ''}${year}`,
  make,
  model,
  version,
  year,
  price,
  currency: "PKR",
  mileage_km,
  fuel_type,
  transmission,
  city,
  location: `${city === "Lahore" ? "DHA Phase 5, Lahore" : city + " Central"}`,
  body_type,
  engine_cc,
  color: id % 2 === 0 ? "White" : "Black",
  assembly: "Local",
  description: `${make} ${model} ${year} in immaculate condition. 100% genuine condition, driven inside ${city}. Complete documents, token tax paid.`,
  features: ["ABS", "Air Conditioning", "Power Windows", "Airbags", "Keyless Entry", "Power Steering"],
  images: [img, IMG.sedan, IMG.luxury, IMG.suv].filter((v, i, a) => a.indexOf(v) === i),
  image: img,
  seller_type: "Private Seller",
  dealer_name: "Cars Kingdom LTD Lahore",
  source_page: "https://www.pakwheels.com/used-cars/lahore/",
  listing_url: `https://www.pakwheels.com/used-cars/${make.toLowerCase()}-${model.toLowerCase()}-${year}-for-sale-in-${city.toLowerCase()}-${11934000 + Number(id)}`,
  scraped_at: new Date().toISOString(),
});

export const cars = [
  mk(1, "Toyota", "Corolla", 2021, 6030000, 45000, "Petrol", "Automatic", "Lahore", "Sedan", IMG.sedan, 1800, "Altis Grande"),
  mk(2, "Honda", "Civic", 2020, 6850000, 38000, "Petrol", "Automatic", "Lahore", "Sedan", IMG.luxury, 1800, "Oriel"),
  mk(3, "Suzuki", "Cultus", 2021, 3450000, 29000, "Petrol", "Manual", "Lahore", "Hatchback", IMG.hatchback, 1000, "VXL"),
  mk(4, "Toyota", "Land Cruiser", 2019, 38500000, 52000, "Diesel", "Automatic", "Lahore", "SUV", IMG.suv, 4500, "ZX V8"),
  mk(5, "Mercedes-Benz", "S-Class", 2022, 85000000, 14000, "Petrol", "Automatic", "Lahore", "Luxury", IMG.luxury, 3000, "S500"),
  mk(6, "Ferrari", "F8", 2021, 120000000, 8000, "Petrol", "Automatic", "Lahore", "Coupe", IMG.sports, 3900, "Tributo"),
  mk(7, "Suzuki", "Alto", 2023, 2750000, 16000, "Petrol", "Automatic", "Lahore", "Hatchback", IMG.hatchback, 660, "VXL AGS"),
  mk(8, "Toyota", "Yaris", 2022, 4800000, 24000, "Petrol", "Automatic", "Lahore", "Sedan", IMG.sedan, 1500, "ATIV X"),
  mk(9, "Honda", "BR-V", 2020, 5100000, 48000, "Petrol", "Automatic", "Lahore", "MPV", IMG.suv, 1500, "i-VTEC S"),
  mk(10, "Toyota", "Prius", 2019, 6200000, 55000, "Hybrid", "Automatic", "Lahore", "Hatchback", IMG.sedan, 1800, "S Touring"),
  mk(11, "Hyundai", "Tucson", 2022, 7900000, 22000, "Petrol", "Automatic", "Lahore", "Crossover", IMG.suv, 2000, "AWD"),
  mk(12, "Kia", "Sportage", 2021, 6900000, 34000, "Petrol", "Automatic", "Lahore", "Crossover", IMG.suv, 2000, "FWD"),
  mk(13, "Toyota", "Hilux Revo", 2021, 11500000, 31000, "Diesel", "Automatic", "Lahore", "Pickup", IMG.suv, 2800, "Rocco Double Cabin"),
  mk(14, "Mazda", "MX-5", 2018, 9200000, 26000, "Petrol", "Manual", "Lahore", "Convertible", IMG.sports, 2000, "Miata RF"),
  mk(15, "Toyota", "Corolla Fielder", 2019, 4400000, 62000, "Hybrid", "Automatic", "Lahore", "Station Wagon", IMG.sedan, 1500, "Hybrid G"),
  mk(16, "Suzuki", "Every", 2020, 2350000, 41000, "Petrol", "Automatic", "Lahore", "Van", IMG.hatchback, 660, "Join Turbo"),
  mk(17, "Changan", "Oshan X7", 2022, 8300000, 19000, "Petrol", "Automatic", "Lahore", "SUV", IMG.suv, 1500, "FutureSense"),
  mk(18, "MG", "HS", 2021, 6400000, 28000, "Petrol", "Automatic", "Lahore", "Compact SUV", IMG.suv, 1500, "Exclusive"),
  mk(19, "Honda", "Freed", 2019, 4600000, 51000, "Hybrid", "Automatic", "Lahore", "Mini Van", IMG.sedan, 1500, "G Aero"),
  mk(20, "Audi", "A6", 2018, 16500000, 35000, "Petrol", "Automatic", "Lahore", "Luxury", IMG.luxury, 1800, "TFSI"),
  mk(21, "Isuzu", "D-Max", 2020, 7800000, 42000, "Diesel", "Manual", "Lahore", "Double Cabin", IMG.suv, 3000, "V-Cross"),
];

export const newCars = [
  { id: "1", title: "Toyota Corolla Altis X 2024", make: "Toyota", model: "Corolla", variant: "Altis X 1.8 CVT", price: 7550000, currency: "PKR", engine_cc: 1800, fuel_type: "Petrol", transmission: "Automatic", body_type: "Sedan", image: IMG.sedan, images: [IMG.sedan, IMG.luxury], description: "Brand new flagship Toyota Corolla sedan with modern safety suite.", features: ["Sunroof", "Cruise Control", "Vehicle Stability Control", "LED Projector Lamps"] },
  { id: "2", title: "Mercedes-Benz S580 2024", make: "Mercedes-Benz", model: "S-Class", variant: "S580 4MATIC", price: 115000000, currency: "PKR", engine_cc: 4000, fuel_type: "Petrol", transmission: "Automatic", body_type: "Luxury", image: IMG.luxury, images: [IMG.luxury], description: "Executive luxury sedan defining top-tier automotive comfort.", features: ["Burmester High-End 4D", "Executive Rear Seats", "Airmatic Suspension", "Digital Light"] },
  { id: "3", title: "Toyota Land Cruiser 300 2024", make: "Toyota", model: "Land Cruiser", variant: "LC300 ZX", price: 125000000, currency: "PKR", engine_cc: 3500, fuel_type: "Petrol", transmission: "Automatic", body_type: "SUV", image: IMG.suv, images: [IMG.suv], description: "King of the Road, all-terrain luxury SUV.", features: ["Multi-Terrain Select", "Crawl Control", "Heated/Ventilated Seats", "JBL Premium Sound"] },
  { id: "4", title: "Ferrari F8 Tributo 2024", make: "Ferrari", model: "F8", variant: "Tributo", price: 155000000, currency: "PKR", engine_cc: 3900, fuel_type: "Petrol", transmission: "Automatic", body_type: "Coupe", image: IMG.sports, images: [IMG.sports], description: "Mid-rear-engined supercar delivering legendary Italian performance.", features: ["Carbon Ceramic Brakes", "Side Slip Control", "Telemetry Kit"] },
];

export const reviews = [
  { id: "1", title: "Reliable daily driver in Lahore traffic", vehicle: "Toyota Corolla 2021", reviewer: "Ali Raza (Lahore)", date: "2026-08-12", rating: 4.5, text: "Excellent fuel economy on Canal Road and Ring Road. Air conditioning is superb even in Lahore summers. Resale value is unbeatable.", image: IMG.sedan },
  { id: "2", title: "Sporty drive and great road grip", vehicle: "Honda Civic 2020", reviewer: "Sara Khan (Lahore)", date: "2026-07-30", rating: 4, text: "Handling is precise and steering feedback is excellent. Digital dashboard and cabin feel very premium.", image: IMG.luxury },
  { id: "3", title: "Fuel saver for city commuting", vehicle: "Suzuki Cultus 2021", reviewer: "Usman Tariq (Lahore)", date: "2026-06-25", rating: 4.2, text: "Gives around 16 km/l in Lahore city commute. Easy to park in crowded markets like Gulberg and Anarkali.", image: IMG.hatchback },
  { id: "4", title: "Unmatched road presence and comfort", vehicle: "Toyota Land Cruiser 2019", reviewer: "Bilal Ahmed (Lahore)", date: "2026-06-18", rating: 5, text: "Solid build, incredible suspension absorbs all road bumps effortlessly. V8 power is effortless.", image: IMG.suv },
];

export const posts = [
  { id: "1", slug: "best-used-cars-under-50-lakh-lahore", title: "Best Used Cars Under 50 Lakh in Lahore (2026)", category: "Guides", author: "Cars Kingdom Research Team", date: "2026-09-20", excerpt: "Detailed market analysis comparing fuel economy, resale value and maintenance costs of Lahore used cars.", content: "Searching for a dependable used car in Lahore? We analyze verified listings in DHA, Gulberg, and Johar Town to find top value picks.", image: IMG.sedan, tags: ["lahore", "cars", "budget", "pakwheels"] },
  { id: "2", slug: "lahore-car-inspection-tips", title: "Essential Inspection Checklist for Buying Used Cars in Lahore", category: "Car Inspection", author: "Inspection Specialist", date: "2026-09-10", excerpt: "How to inspect engine compression, chassis accidental points, and duplicate registration files.", content: "Before finalizing a car deal in Lahore, check the MTMIS Punjab registration, verify biometric transfer and inspect body paint meters.", image: IMG.suv, tags: ["inspection", "lahore", "guide"] },
  { id: "3", slug: "suv-vs-sedan-lahore-roads", title: "SUV vs Sedan: Which is Better for Lahore Road Conditions?", category: "Analysis", author: "Editorial", date: "2026-08-14", excerpt: "Comparing ground clearance and suspension durability on Lahore city roads.", content: "With frequent monsoon rain puddles and high speed breakers, compact SUVs and crossover vehicles are gaining rapid popularity over traditional sedans.", image: IMG.luxury, tags: ["analysis", "suv", "sedan"] },
];

export const parts = [
  { id: "1", title: "Toyota Corolla Engine Air Filter (Genuine)", category: "Filters", price: 3200, currency: "PKR", image: IMG.sedan, description: "Genuine OEM air filter for 1.3L, 1.6L and 1.8L Corolla." },
  { id: "2", title: "Ceramic Coating & Polish Kit for Cars", category: "Car Care", price: 6500, currency: "PKR", image: IMG.sports, description: "Professional 9H ceramic coating protection kit against Lahore dust and sun." },
  { id: "3", title: "LED Headlight High-Beam Bulbs (H4/H11)", category: "Lighting", price: 12500, currency: "PKR", image: IMG.suv, description: "6500K bright white LED headlights with active cooling fan." },
  { id: "4", title: "Premium All-Weather 7D Car Floor Mats", category: "Accessories", price: 9500, currency: "PKR", image: IMG.luxury, description: "Custom fit waterproof leather floor mats tailored for sedans and SUVs." },
];

export const makes = ["Toyota", "Honda", "Suzuki", "Mercedes-Benz", "Ferrari", "Hyundai", "Kia", "MG", "Changan", "Audi", "Isuzu", "Mazda"];
export const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"];
export const bodyTypes = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Crossover",
  "Compact SUV",
  "Coupe",
  "Convertible",
  "MPV",
  "Mini Van",
  "Pickup",
  "Double Cabin",
  "Van",
  "Station Wagon",
  "Luxury",
];
export const categories = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Crossover",
  "Compact SUV",
  "Coupe",
  "Convertible",
  "MPV",
  "Mini Van",
  "Pickup",
  "Double Cabin",
  "Van",
  "Station Wagon",
  "Luxury",
  "Hybrid",
  "Automatic",
  "Manual",
  "Diesel",
  "Petrol",
];
