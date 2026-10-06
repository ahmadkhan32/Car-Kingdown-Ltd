import { useCart } from "../hooks/useCart";
import { woo } from "../services/woocommerceApi";
import { WP_URL } from "../services/wordpressApi";
import { formatPrice } from "../utils/formatPrice";

export default function Checkout() {
  const { items, subtotal } = useCart();
  return (
    <main className="container page narrow">
      <h1>Checkout</h1>
      {items.map((i) => <div key={i.key} className="sub">{i.title} × {i.quantity}</div>)}
      <div className="sub">Total: <b>{formatPrice(subtotal)}</b></div>
      {woo.enabled
        ? <a className="btn" href={`${WP_URL.replace(/\/$/, "")}/checkout/`}>Pay on WooCommerce Checkout</a>
        : <p className="muted">Connect WordPress/WooCommerce (VITE_WP_API_URL) to enable real checkout and orders.</p>}
    </main>
  );
}
