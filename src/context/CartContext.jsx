import { createContext, useCallback, useEffect, useState } from "react";
import { woo } from "../services/woocommerceApi";

export const CartContext = createContext(null);

// WooCommerce Store API is the source of truth when WordPress is configured.
// Without it, a local demo cart keeps the UI testable.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fromWoo = (c) => setItems(c.items.map((i) => ({ key: i.key, id: i.id, title: i.name, price: Number(i.prices.price) / 100, image: i.images?.[0]?.src, quantity: i.quantity })));
  useEffect(() => { if (woo.enabled) woo.getCart().then(fromWoo).catch(() => {}); }, []);
  const notify = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  const add = useCallback(async (p) => {
    if (woo.enabled) fromWoo(await woo.add(p.id, 1));
    else setItems((cur) => cur.find((i) => i.id === p.id)
      ? cur.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cur, { key: p.id, id: p.id, title: p.title, price: p.price, image: p.image, quantity: 1 }]);
    notify("Added to cart");
  }, []);

  const remove = useCallback(async (key) => {
    if (woo.enabled) fromWoo(await woo.remove(key));
    else setItems((cur) => cur.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback(async (key, quantity) => {
    if (quantity < 1) return remove(key);
    if (woo.enabled) fromWoo(await woo.update(key, quantity));
    else setItems((cur) => cur.map((i) => (i.key === key ? { ...i, quantity } : i)));
  }, [remove]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  return <CartContext.Provider value={{ items, count, subtotal, open, setOpen, add, setQty, remove, toast }}>{children}</CartContext.Provider>;
}
