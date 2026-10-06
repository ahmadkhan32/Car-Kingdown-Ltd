import { useEffect, useState } from "react";

export function useVehicles(fetcher, params) {
  const [state, setState] = useState({ items: [], total: 0, totalPages: 1, loading: true, error: null });
  const key = JSON.stringify(params);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher(params)
      .then((r) => alive && setState({ items: r.items, total: r.total, totalPages: r.totalPages, loading: false, error: null }))
      .catch((e) => alive && setState({ items: [], total: 0, totalPages: 1, loading: false, error: e.message }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}
