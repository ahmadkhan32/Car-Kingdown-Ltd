export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [...Array(totalPages)].map((_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  const out = [];
  pages.forEach((p, i) => { if (i && p - pages[i - 1] > 1) out.push("…" + p); out.push(p); });
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      {out.map((p) => typeof p === "string" ? <span key={p}>…</span> : <button key={p} className={p === page ? "on" : ""} onClick={() => onChange(p)}>{p}</button>)}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
