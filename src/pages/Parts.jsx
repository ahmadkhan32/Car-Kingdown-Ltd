import { Link } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import { useVehicles } from "../hooks/useVehicles";
import { getPartsList } from "../services/vehicleApi";
import { useCart } from "../hooks/useCart";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { formatPrice } from "../utils/formatPrice";

export default function Parts() {
  const { page, setPage } = usePagination();
  const { items, totalPages, loading, error } = useVehicles(getPartsList, { page });
  const { add } = useCart();
  return (
    <main className="container page">
      <h1>Auto Parts & Accessories</h1>
      {loading ? <Loading /> : error || !items.length ? <EmptyState text="No products." /> : (
        <div className="grid">{items.map((p) => (
          <article key={p.id} className="card"><div className="card-img"><img src={p.image} alt={p.title} loading="lazy" /></div>
            <div className="card-body"><span className="tag">{p.category}</span><h3>{p.title}</h3><div className="price">{formatPrice(p.price, p.currency)}</div>
              <div className="row2"><Link className="btn btn-outline" to={`/parts/${p.id}`}>Details</Link><button className="btn" onClick={() => add(p)}>Add to Cart</button></div></div></article>
        ))}</div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
