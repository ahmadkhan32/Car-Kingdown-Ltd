import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { items, subtotal, setQty, remove } = useCart();
  if (!items.length) return <main className="container page"><EmptyState text="Your cart is empty." /><p style={{ textAlign: "center" }}><Link className="btn" to="/parts">Shop parts</Link></p></main>;
  return (
    <main className="container page narrow">
      <h1>Your Cart</h1>
      {items.map((i) => (
        <div key={i.key} className="ci">{i.image && <img src={i.image} alt="" />}
          <div><b>{i.title}</b><div>{formatPrice(i.price)}</div>
            <div className="qty"><button onClick={() => setQty(i.key, i.quantity - 1)}>−</button><span>{i.quantity}</span><button onClick={() => setQty(i.key, i.quantity + 1)}>+</button><button onClick={() => remove(i.key)}>🗑</button></div></div></div>
      ))}
      <div className="sub">Subtotal: <b>{formatPrice(subtotal)}</b></div>
      <Link className="btn" to="/checkout">Proceed to Checkout</Link>
    </main>
  );
}
