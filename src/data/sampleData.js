// Offline fallback used ONLY when VITE_WP_API_URL is not configured.
// When WordPress is connected, all data comes from /wp-json/carskingdom/v1/*
const IMG = { sedan: "/images/car-sedan.jpg", suv: "/images/car-suv.jpg", sports: "/images/car-sports.jpg", bike: "/images/bike.jpg" };

const mk = (id, make, model, year, price, mileage_km, fuel_type, transmission, city, body_type, img, engine_cc) => ({
  id: String(id), title: `${make} ${model} ${year}`, make, model, year, price, currency: "PKR",
  mileage_km, fuel_type, transmission, city, body_type, engine_cc, color: null, assembly: "Local", version: null,
  description: `${make} ${model} ${year} in excellent condition, available in ${city}.`,
  features: ["ABS", "Air Conditioning", "Power Windows", "Airbags"],
  images: [img, IMG.sedan, IMG.suv].filter((v, i, a) => a.indexOf(v) === i), image: img,
});

export const cars = [
  mk(1, "Toyota", "Corolla", 2021, 6030000, 45000, "Petrol", "Automatic", "Rawalpindi", "Sedan", IMG.sedan, 1800),
  mk(2, "Honda", "Civic", 2020, 6850000, 38000, "Petrol", "Automatic", "Lahore", "Sedan", IMG.sedan, 1800),
  mk(3, "Toyota", "Land Cruiser", 2019, 38500000, 52000, "Diesel", "Automatic", "Karachi", "SUV", IMG.suv, 4500),
  mk(4, "Mercedes", "G63 AMG", 2022, 95000000, 12000, "Petrol", "Automatic", "Islamabad", "SUV", IMG.suv, 4000),
  mk(5, "Ferrari", "F8 Tributo", 2021, 120000000, 8000, "Petrol", "Automatic", "Lahore", "Coupe", IMG.sports, 3900),
  mk(6, "Suzuki", "Alto", 2022, 2650000, 18000, "Petrol", "Manual", "Multan", "Hatchback", IMG.sedan, 660),
  mk(7, "Toyota", "Yaris", 2021, 4500000, 30000, "Petrol", "Automatic", "Karachi", "Sedan", IMG.sedan, 1300),
  mk(8, "Honda", "BR-V", 2019, 5200000, 60000, "Petrol", "Manual", "Faisalabad", "SUV", IMG.suv, 1500),
  mk(9, "Suzuki", "Cultus", 2020, 3300000, 40000, "Petrol", "Manual", "Peshawar", "Hatchback", IMG.sedan, 1000),
  mk(10, "Toyota", "Prius", 2018, 5900000, 70000, "Hybrid", "Automatic", "Islamabad", "Hatchback", IMG.sedan, 1800),
];

const bk = (id, make, model, year, price, engine_cc, city) => ({
  id: String(id), title: `${make} ${model} ${year}`, make, model, year, price, currency: "PKR", engine_cc,
  fuel_type: "Petrol", transmission: "Manual", city, mileage_km: 9000 * id,
  description: `${make} ${model} ${year} well maintained in ${city}.`, features: [], images: [IMG.bike], image: IMG.bike,
});
export const bikes = [
  bk(1, "Honda", "CG 125", 2022, 280000, 125, "Lahore"),
  bk(2, "Yamaha", "YBR 125G", 2021, 390000, 125, "Karachi"),
  bk(3, "Suzuki", "GS 150", 2020, 360000, 150, "Islamabad"),
  bk(4, "Ducati", "Streetfighter V4", 2022, 6500000, 1103, "Lahore"),
];

export const newCars = [
  { id: "1", title: "Toyota Corolla Altis X", make: "Toyota", model: "Corolla", variant: "Altis X", price: 7500000, currency: "PKR", engine_cc: 1800, fuel_type: "Petrol", transmission: "Automatic", body_type: "Sedan", image: IMG.sedan, images: [IMG.sedan], description: "Latest generation Corolla.", features: ["Sunroof", "Cruise Control"] },
  { id: "2", title: "Mercedes G63 AMG", make: "Mercedes", model: "G63", variant: "AMG", price: 110000000, currency: "PKR", engine_cc: 4000, fuel_type: "Petrol", transmission: "Automatic", body_type: "SUV", image: IMG.suv, images: [IMG.suv], description: "Iconic luxury off-roader.", features: ["Burmester Audio"] },
  { id: "3", title: "Ferrari F8 Tributo", make: "Ferrari", model: "F8", variant: "Tributo", price: 150000000, currency: "PKR", engine_cc: 3900, fuel_type: "Petrol", transmission: "Automatic", body_type: "Coupe", image: IMG.sports, images: [IMG.sports], description: "Twin-turbo V8 supercar.", features: ["Carbon Package"] },
];

export const reviews = [
  { id: "1", title: "Reliable daily driver", vehicle: "Toyota Corolla 2021", reviewer: "Ali Raza", date: "2026-08-12", rating: 4.5, text: "Great fuel economy and comfortable ride. Service network is excellent.", image: IMG.sedan },
  { id: "2", title: "Sporty and refined", vehicle: "Honda Civic 2020", reviewer: "Sara Khan", date: "2026-07-30", rating: 4, text: "Handling is superb. Cabin quality is top class.", image: IMG.sedan },
  { id: "3", title: "Pure presence", vehicle: "Mercedes G63 AMG", reviewer: "Bilal Ahmed", date: "2026-06-18", rating: 5, text: "Nothing sounds or looks like it on the road.", image: IMG.suv },
  { id: "4", title: "Unreal performance", vehicle: "Ferrari F8 Tributo", reviewer: "Hamza Malik", date: "2026-05-02", rating: 5, text: "Accelerates like a rocket and sounds amazing.", image: IMG.sports },
];

export const posts = [
  { id: "1", slug: "best-cars-under-50-lakh", title: "Best Cars Under 50 Lakh in 2026", category: "Guides", author: "Cars Kingdom Team", date: "2026-09-20", excerpt: "Our picks for the best value cars in the 50 lakh budget.", content: "Looking for a car under 50 lakh? We compare reliability, resale value and running costs of the top choices.", image: IMG.sedan, tags: ["guide", "budget"] },
  { id: "2", slug: "suv-market-trends", title: "SUV Market Trends: What Buyers Want", category: "News", author: "Editorial", date: "2026-09-02", excerpt: "SUVs keep gaining ground in the local market.", content: "Demand for compact and mid-size SUVs has grown as buyers look for space and ground clearance.", image: IMG.suv, tags: ["suv", "news"] },
  { id: "3", slug: "supercar-showcase", title: "Supercar Showcase Event Recap", category: "Auto Events", author: "Editorial", date: "2026-08-14", excerpt: "Highlights from this year's supercar meetup.", content: "Enthusiasts gathered to showcase exotic machines from around the country.", image: IMG.sports, tags: ["events"] },
];

export const parts = [
  { id: "1", title: "Toyota Air Filter", category: "Filters", price: 3200, currency: "PKR", image: IMG.sedan, description: "Genuine-fit engine air filter." },
  { id: "2", title: "Car Polish Kit", category: "Care", price: 4500, currency: "PKR", image: IMG.sports, description: "Premium wax and polish kit." },
  { id: "3", title: "LED Headlight Set", category: "Lighting", price: 18500, currency: "PKR", image: IMG.suv, description: "Bright, long-life LED headlights." },
];

export const makes = ["Toyota", "Honda", "Suzuki", "Mercedes", "Ferrari", "Yamaha"];
export const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Multan", "Faisalabad", "Peshawar"];
export const categories = ["SUV", "Sedan", "Hatchback", "Coupe", "Hybrid", "Electric", "Luxury", "Automatic", "Manual"];
