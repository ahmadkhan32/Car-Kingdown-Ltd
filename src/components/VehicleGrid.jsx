import VehicleCard from "./VehicleCard";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

export default function VehicleGrid({ items, loading, error, base }) {
  if (loading) return <Loading />;
  if (error) return <EmptyState text={`Could not load data: ${error}`} />;
  if (!items.length) return <EmptyState text="No results found. Try changing your filters." />;
  return <div className="grid">{items.map((v) => <VehicleCard key={v.id} v={v} base={base} />)}</div>;
}
