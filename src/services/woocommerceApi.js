import axios from "axios";
import { WP_URL, hasWordPress } from "./wordpressApi";

// WooCommerce Store API is the cart source of truth when WordPress is configured.
const store = axios.create({ baseURL: hasWordPress ? `${WP_URL.replace(/\/$/, "")}/wp-json/wc/store/v1` : undefined, withCredentials: true });
let nonce = null;
store.interceptors.request.use((c) => { if (nonce) c.headers.Nonce = nonce; return c; });
store.interceptors.response.use((r) => { nonce = r.headers.nonce || nonce; return r; });

export const woo = {
  enabled: hasWordPress,
  getCart: async () => (await store.get("/cart")).data,
  add: async (id, quantity = 1) => (await store.post("/cart/add-item", { id, quantity })).data,
  update: async (key, quantity) => (await store.post("/cart/update-item", { key, quantity })).data,
  remove: async (key) => (await store.post("/cart/remove-item", { key })).data,
};
