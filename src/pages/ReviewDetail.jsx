import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReview } from "../services/vehicleApi";
import { fmtDate } from "../utils/helpers";
import EmptyState from "../components/EmptyState";

export default function ReviewDetail() {
  const { id } = useParams();
  const [r, setR] = useState(undefined);
  useEffect(() => { getReview(id).then(setR).catch(() => setR(null)); }, [id]);
  if (r === undefined) return <main className="container page"><p>Loading…</p></main>;
  if (!r) return <main className="container page"><EmptyState text="Review not found." /></main>;
  return (
    <main className="container page narrow">
      <Link to="/reviews" className="muted">← Back to reviews</Link>
      <h1>{r.title}</h1>
      <img className="hero-img" src={r.image} alt={r.vehicle} />
      <p className="meta">{r.vehicle} • ⭐ {r.rating} • {r.reviewer} • {fmtDate(r.date)}</p>
      <p>{r.text}</p>
    </main>
  );
}
