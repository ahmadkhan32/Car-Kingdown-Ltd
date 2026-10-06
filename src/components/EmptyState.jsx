export default function EmptyState({ text = "Nothing here yet." }) {
  return <div className="empty">🚗<p>{text}</p></div>;
}
