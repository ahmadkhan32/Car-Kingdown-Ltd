import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VehicleCard from "../components/VehicleCard";
import { Directory } from "./Browse";
import { useVehicles } from "../hooks/useVehicles";
import { getCars, getNewCars, getReviews, getPostsList, getPartsList } from "../services/vehicleApi";
import { formatPrice } from "../utils/formatPrice";

export default function Home() {
  const c = useVehicles(getCars, { page: 1 }).items.slice(0, 3);
  const nc = useVehicles(getNewCars, { page: 1 }).items.slice(0, 3);
  const r = useVehicles(getReviews, { page: 1 }).items.slice(0, 3);
  const p = useVehicles(getPostsList, { page: 1 }).items.slice(0, 3);
  const pt = useVehicles(getPartsList, { page: 1 }).items.slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Find your dream car with <span>Cars Kingdom LTD</span></h1>
          <p>Premier Lahore used cars marketplace, new car releases, verified reviews & parts.</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <Link to="/cars" className="btn">Browse Used Cars in Lahore →</Link>
            <Link to="/sell" className="btn btn-outline" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>+ Sell Your Car (Free Ad)</Link>
          </div>
          <SearchBar />
        </div>
      </section>
      <Directory />
      <section className="container section">
        <div className="section-head">
          <h2>Featured Used Cars in Lahore</h2>
          <Link to="/cars" className="muted">View All Used Cars →</Link>
        </div>
        <div className="grid">{c.map((v) => <VehicleCard key={v.id} v={v} base="cars" />)}</div>
      </section>
      <section className="container section">
        <div style={{ background: "linear-gradient(135deg, var(--panel), var(--panel2))", border: "1px solid var(--line)", borderRadius: "18px", padding: "36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span className="tag" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>Free Car Listing</span>
            <h2 style={{ margin: "8px 0" }}>Want to Sell Your Car in Lahore?</h2>
            <p className="muted" style={{ margin: 0, maxWidth: "600px" }}>
              List your car in 2 minutes. Reach genuine, verified car buyers across Lahore with zero commission.
            </p>
          </div>
          <Link to="/sell" className="btn" style={{ fontSize: "1.05rem", padding: "12px 24px" }}>
            + Post Free Car Ad →
          </Link>
        </div>
      </section>
      <section className="container section">
        <div className="section-head">
          <h2>Latest New Car Showroom</h2>
          <Link to="/new-cars" className="muted">Explore New Cars →</Link>
        </div>
        <div className="grid">{nc.map((v) => <VehicleCard key={v.id} v={v} base="new-cars" />)}</div>
      </section>
      <section className="container section">
        <div className="section-head">
          <h2>Verified Car Owner Reviews</h2>
          <Link to="/reviews" className="muted">All Reviews →</Link>
        </div>
        <div className="grid">{r.map((x) => (
          <Link key={x.id} to={`/reviews/${x.id}`} className="card">
            <div className="card-img"><img src={x.image} alt={x.vehicle} /></div>
            <div className="card-body">
              <h3>{x.title}</h3>
              <div className="meta">{x.vehicle} • ⭐ {x.rating}</div>
              <p className="desc">{x.text.slice(0, 95)}...</p>
            </div>
          </Link>
        ))}</div>
      </section>
      <section className="container section">
        <div className="section-head">
          <h2>Automotive News & Research</h2>
          <Link to="/blog" className="muted">Read Blog →</Link>
        </div>
        <div className="grid">{p.map((x) => (
          <Link key={x.id} to={`/blog/${x.slug}`} className="card">
            <div className="card-img"><img src={x.image} alt={x.title} /></div>
            <div className="card-body">
              <h3>{x.title}</h3>
              <p className="desc">{x.excerpt}</p>
            </div>
          </Link>
        ))}</div>
      </section>
      <section className="container section">
        <div className="section-head">
          <h2>Auto Parts & Accessories</h2>
          <Link to="/parts" className="muted">Shop All Parts →</Link>
        </div>
        <div className="grid">{pt.map((x) => (
          <Link key={x.id} to={`/parts/${x.id}`} className="card">
            <div className="card-img"><img src={x.image} alt={x.title} /></div>
            <div className="card-body">
              <h3>{x.title}</h3>
              <div className="price">{formatPrice(x.price, x.currency)}</div>
            </div>
          </Link>
        ))}</div>
      </section>
    </main>
  );
}
