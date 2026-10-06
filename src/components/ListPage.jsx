import { Link } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import { useVehicles } from "../hooks/useVehicles";
import FilterSidebar from "./FilterSidebar";
import VehicleGrid from "./VehicleGrid";
import Pagination from "./Pagination";

// Shared listing page: AJAX-style filtering, URL-persisted filters, server pagination.
export default function ListPage({ title, fetcher, base, fixed = {}, sidebar = true }) {
  const { filters, page, update, setPage, clear } = usePagination();
  const { items, total, totalPages, loading, error } = useVehicles(fetcher, { ...filters, ...fixed, page });
  return (
    <main className="container page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px" }}>{title}</h1>
          <p className="muted" style={{ margin: 0 }}>{loading ? "Loading…" : `${total} verified car${total === 1 ? "" : "s"} listed`}</p>
        </div>
        {base === "cars" && (
          <Link to="/sell" className="btn" style={{ padding: "10px 18px", fontSize: "0.95rem" }}>
            + Post Your Car Ad
          </Link>
        )}
      </div>
      <div className={sidebar ? "layout" : ""}>
        {sidebar && <FilterSidebar filters={filters} update={update} clear={clear} />}
        <section>
          <VehicleGrid items={items} loading={loading} error={error} base={base} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>
    </main>
  );
}
