import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VehicleCard from "../components/VehicleCard";
import { Directory } from "./Browse";
import { useVehicles } from "../hooks/useVehicles";
import { getCars, getBikes, getReviews, getPostsList, getPartsList } from "../services/vehicleApi";
import { formatPrice } from "../utils/formatPrice";

export default function Home() {
  const c = useVehicles(getCars, { page: 1 }).items.slice(0, 3);
  const b = useVehicles(getBikes, { page: 1 }).items.slice(0, 3);
  const r = useVehicles(getReviews, { page: 1 }).items.slice(0, 3);
  const p = useVehicles(getPostsList, { page: 1 }).items.slice(0, 3);
  const pt = useVehicles(getPartsList, { page: 1 }).items.slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Find your dream ride with <span>Cars Kingdom LTD</span></h1>
          <p>Used cars, bikes, new cars, reviews and parts — all in one place.</p>
          <SearchBar />
        </div>
      </section>
      <Directory />
      <section className="container section"><h2>Featured Cars</h2><div className="grid">{c.map((v) => <VehicleCard key={v.id} v={v} />)}</div></section>
      <section className="container section"><h2>Popular Bikes</h2><div className="grid">{b.map((v) => <VehicleCard key={v.id} v={v} base="bikes" />)}</div></section>
      <section className="container section"><h2>Latest Reviews</h2><div className="grid">{r.map((x) => <Link key={x.id} to={`/reviews/${x.id}`} className="card"><div className="card-img"><img src={x.image} alt={x.vehicle} /></div><div className="card-body"><h3>{x.title}</h3><div className="meta">{x.vehicle} • ⭐ {x.rating}</div></div></Link>)}</div></section>
      <section className="container section"><h2>Latest Articles</h2><div className="grid">{p.map((x) => <Link key={x.id} to={`/blog/${x.slug}`} className="card"><div className="card-img"><img src={x.image} alt={x.title} /></div><div className="card-body"><h3>{x.title}</h3><p className="desc">{x.excerpt}</p></div></Link>)}</div></section>
      <section className="container section"><h2>Auto Parts</h2><div className="grid">{pt.map((x) => <Link key={x.id} to={`/parts/${x.id}`} className="card"><div className="card-img"><img src={x.image} alt={x.title} /></div><div className="card-body"><h3>{x.title}</h3><div className="price">{formatPrice(x.price, x.currency)}</div></div></Link>)}</div></section>
    </main>
  );
}
