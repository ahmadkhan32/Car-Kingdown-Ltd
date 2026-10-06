export default function Loading() {
  return <div className="grid">{[...Array(6)].map((_, i) => <div key={i} className="card skeleton" />)}</div>;
}
