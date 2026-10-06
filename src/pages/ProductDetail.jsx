import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPart } from "../services/vehicleApi";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import EmptyState from "../components/EmptyState";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(undefined);
  useEffect(() => { getPart(id).then(setP).catch(() => setP(null)); }, [id]);
  if (p === undefined) return <main className="container page"><p>Loading…</p></main>;
  if (!p) return <main className="container page"><EmptyState text="Product not found." /></main>;
  return (
    <main className="container page">
      <Link to="/parts" className="muted">← Back to parts</Link>
      <div className="detail">
        <img className="hero-img" src={p.image} alt={p.title} />
        <div><h1>{p.title}</h1><span className="tag">{p.category}</span><div className="price big">{formatPrice(p.price, p.currency)}</div><p>{p.description}</p><button className="btn" onClick={() => add(p)}>Add to Cart</button></div>
      </div>
    </main>
  );
}
