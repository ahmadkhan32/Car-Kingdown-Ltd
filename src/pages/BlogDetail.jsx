import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost } from "../services/vehicleApi";
import { fmtDate } from "../utils/helpers";
import EmptyState from "../components/EmptyState";

export default function BlogDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(undefined);
  useEffect(() => { getPost(slug).then(setP).catch(() => setP(null)); }, [slug]);
  if (p === undefined) return <main className="container page"><p>Loading…</p></main>;
  if (!p) return <main className="container page"><EmptyState text="Article not found." /></main>;
  return (
    <main className="container page narrow">
      <Link to="/blog" className="muted">← Back to blog</Link>
      <span className="tag">{p.category}</span>
      <h1>{p.title}</h1>
      <p className="meta">{p.author} • {fmtDate(p.date)}</p>
      <img className="hero-img" src={p.image} alt={p.title} />
      <p>{p.content}</p>
      <div>{p.tags?.map((t) => <span key={t} className="tag">#{t}</span>)}</div>
    </main>
  );
}
