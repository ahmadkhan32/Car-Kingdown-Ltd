import { wp, hasWordPress } from "./wordpressApi";
import * as sample from "../data/sampleData";

const PER_PAGE = 6;
const NS = "/carskingdom/v1";

export function getUserCars() {
  try {
    const raw = localStorage.getItem("ck_user_cars");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createUserCar(carData) {
  const userCars = getUserCars();
  const id = `user-${Date.now()}`;
  const listingId = String(12099000 + Math.floor(Math.random() * 1000));
  const newCar = {
    id,
    listing_id: listingId,
    title: carData.title || `${carData.make} ${carData.model} ${carData.year}`,
    make: carData.make,
    model: carData.model,
    version: carData.version || null,
    year: Number(carData.year) || 2022,
    price: Number(carData.price) || 0,
    currency: "PKR",
    mileage_km: Number(carData.mileage_km) || 0,
    fuel_type: carData.fuel_type || "Petrol",
    transmission: carData.transmission || "Automatic",
    city: carData.city || "Lahore",
    location: carData.location || `${carData.city || "Lahore"} Central`,
    body_type: carData.body_type || "Sedan",
    engine_cc: Number(carData.engine_cc) || 1500,
    color: carData.color || "White",
    assembly: carData.assembly || "Local",
    description: carData.description || `Verified user-listed car in ${carData.city || "Lahore"}. Available for inspection.`,
    features: Array.isArray(carData.features) ? carData.features : ["ABS", "Air Conditioning", "Power Windows"],
    images: carData.images && carData.images.length > 0 ? carData.images : [carData.image || "/images/car-sedan.jpg"],
    image: carData.image || "/images/car-sedan.jpg",
    seller_name: carData.seller_name || "Private Seller",
    seller_type: "Private Seller (Verified Ad)",
    dealer_name: "Cars Kingdom LTD Lahore",
    is_user_listed: true,
    scraped_at: new Date().toISOString(),
  };
  userCars.unshift(newCar);
  try {
    localStorage.setItem("ck_user_cars", JSON.stringify(userCars));
  } catch (e) {
    console.error("Failed to save user car:", e);
  }
  return newCar;
}

export function deleteUserCar(id) {
  const userCars = getUserCars().filter((c) => c.id !== String(id));
  try {
    localStorage.setItem("ck_user_cars", JSON.stringify(userCars));
  } catch (e) {
    console.error("Failed to delete user car:", e);
  }
}

function localQuery(collection, p = {}) {
  const has = (v) => v !== undefined && v !== null && v !== "";
  const eq = (a, b) => String(a ?? "").toLowerCase() === String(b).toLowerCase();
  let list = [...(sample[collection] || [])];
  if (collection === "cars") {
    const userCars = getUserCars();
    list = [...userCars, ...list];
  }
  if (has(p.q)) list = list.filter((x) => x.title.toLowerCase().includes(String(p.q).toLowerCase()));
  if (has(p.make)) list = list.filter((x) => eq(x.make, p.make));
  if (has(p.model)) list = list.filter((x) => eq(x.model, p.model));
  if (has(p.city)) list = list.filter((x) => eq(x.city, p.city));
  if (has(p.year)) list = list.filter((x) => String(x.year) === String(p.year));
  if (has(p.fuel)) list = list.filter((x) => x.fuel_type === p.fuel);
  if (has(p.transmission)) list = list.filter((x) => x.transmission === p.transmission);
  if (has(p.body)) list = list.filter((x) => eq(x.body_type, p.body));
  if (has(p.minPrice)) list = list.filter((x) => x.price >= Number(p.minPrice));
  if (has(p.maxPrice)) list = list.filter((x) => x.price <= Number(p.maxPrice));
  const page = Number(p.page || 1);
  return { items: list.slice((page - 1) * PER_PAGE, page * PER_PAGE), total: list.length, totalPages: Math.max(1, Math.ceil(list.length / PER_PAGE)), page };
}

export async function list(collection, params = {}) {
  if (!hasWordPress) { await new Promise((r) => setTimeout(r, 250)); return localQuery(collection, params); }
  return (await wp.get(`${NS}/${collection}`, { params: { per_page: PER_PAGE, ...params } })).data;
}
export async function getOne(collection, id) {
  if (!hasWordPress) {
    if (collection === "cars") {
      const userCars = getUserCars();
      const userFound = userCars.find((x) => x.id === String(id) || x.slug === id);
      if (userFound) return userFound;
    }
    return (sample[collection] || []).find((x) => x.id === String(id) || x.slug === id) || null;
  }
  return (await wp.get(`${NS}/${collection}/${id}`)).data;
}

export const getCars = (p) => list("cars", p);
export const getCar = (id) => getOne("cars", id);
export const getNewCars = (p) => list("newCars", p);
export const getNewCar = (id) => getOne("newCars", id);
export const getReviews = (p) => list("reviews", p);
export const getReview = (id) => getOne("reviews", id);
export const getPostsList = (p) => list("posts", p);
export const getPost = (slug) => getOne("posts", slug);
export const getPartsList = (p) => list("parts", p);
export const getPart = (id) => getOne("parts", id);
export const { makes, cities, categories, bodyTypes } = sample;
