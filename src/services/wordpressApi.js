import axios from "axios";

export const WP_URL = import.meta.env.VITE_WP_API_URL || "";
export const hasWordPress = Boolean(WP_URL);
export const wp = axios.create({ baseURL: hasWordPress ? `${WP_URL.replace(/\/$/, "")}/wp-json` : undefined, timeout: 15000 });

export async function getPosts(params = {}) {
  const { data, headers } = await wp.get("/wp/v2/posts", { params: { _embed: 1, ...params } });
  return { items: data, total: Number(headers["x-wp-total"] || data.length) };
}
export const getCategories = async () => (await wp.get("/wp/v2/categories")).data;
