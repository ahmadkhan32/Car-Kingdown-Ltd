import { useSearchParams } from "react-router-dom";

// Keeps filters + page in the URL so results are shareable.
export function usePagination() {
  const [params, setParams] = useSearchParams();
  const obj = Object.fromEntries(params.entries());
  const page = Number(obj.page || 1);
  const update = (patch, resetPage = true) => {
    const next = { ...obj, ...patch };
    if (resetPage && !("page" in patch)) delete next.page;
    Object.keys(next).forEach((k) => (next[k] === "" || next[k] == null) && delete next[k]);
    setParams(next);
  };
  return { filters: obj, page, update, setPage: (p) => update({ page: p }, false), clear: () => setParams({}) };
}
