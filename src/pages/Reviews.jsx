import { Link } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import { useVehicles } from "../hooks/useVehicles";
import { getReviews } from "../services/vehicleApi";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { fmtDate } from "../utils/helpers";

export default function Reviews() {
  const { page, setPage } = usePagination();
  const { items, total, totalPages, loading, error } = useVehicles(getReviews, { page });
  return (
    <main className="container page">
      <h1>Car Reviews</h1><p className="muted">{total} reviews</p>
      {loading ? <Loading /> : error || !items.length ? <EmptyState text="No reviews." /> : (
        <div className="grid">{items.map((r) => (
          <article key={r.id} className="card"><div className="card-img"><img src={r.image} alt={r.vehicle} loading="lazy" /></div>
            <div className="card-body"><h3>{r.title}</h3><div className="meta">{r.vehicle} • ⭐ {r.rating}</div><div className="meta">{r.reviewer} • {fmtDate(r.date)}</div><p className="desc">{r.text}</p><Link className="btn" to={`/reviews/${r.id}`}>Read Review</Link></div></article>
        ))}</div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
