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
      <h1>{title}</h1>
      <p className="muted">{loading ? "Loading…" : `${total} result${total === 1 ? "" : "s"}`}</p>
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
