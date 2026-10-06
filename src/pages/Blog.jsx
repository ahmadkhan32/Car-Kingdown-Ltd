import { Link } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import { useVehicles } from "../hooks/useVehicles";
import { getPostsList } from "../services/vehicleApi";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { fmtDate } from "../utils/helpers";

export default function Blog() {
  const { page, setPage } = usePagination();
  const { items, totalPages, loading, error } = useVehicles(getPostsList, { page });
  return (
    <main className="container page">
      <h1>Automotive Blog</h1>
      {loading ? <Loading /> : error || !items.length ? <EmptyState text="No articles." /> : (
        <div className="grid">{items.map((p) => (
          <article key={p.id} className="card"><div className="card-img"><img src={p.image} alt={p.title} loading="lazy" /></div>
            <div className="card-body"><span className="tag">{p.category}</span><h3>{p.title}</h3><div className="meta">{p.author} • {fmtDate(p.date)}</div><p className="desc">{p.excerpt}</p><Link className="btn" to={`/blog/${p.slug}`}>Read More</Link></div></article>
        ))}</div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
