import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";

export default function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }}>
            <div className="drawer-h"><h3>Your Cart</h3><button onClick={() => setOpen(false)} aria-label="Close cart">✕</button></div>
            <div className="drawer-b">
              {!items.length && <p className="muted">Your cart is empty.</p>}
              {items.map((i) => (
                <div key={i.key} className="ci">
                  {i.image && <img src={i.image} alt="" />}
                  <div>
                    <b>{i.title}</b><div>{formatPrice(i.price)}</div>
                    <div className="qty"><button onClick={() => setQty(i.key, i.quantity - 1)}>−</button><span>{i.quantity}</span><button onClick={() => setQty(i.key, i.quantity + 1)}>+</button><button onClick={() => remove(i.key)} aria-label="Remove">🗑</button></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-f">
              <div className="sub">Subtotal: <b>{formatPrice(subtotal)}</b></div>
              <Link className="btn btn-outline" to="/cart" onClick={() => setOpen(false)}>View Cart</Link>
              <Link className="btn" to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
