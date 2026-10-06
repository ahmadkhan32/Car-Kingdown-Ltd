import { Link, useParams } from "react-router-dom";
import ListPage from "../components/ListPage";
import { getCars, categories, makes, cities } from "../services/vehicleApi";

const cap = (s = "") => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function CategoryPage() { const { slug } = useParams(); return <ListPage key={slug} title={`${cap(slug)} Cars`} fetcher={getCars} base="cars" fixed={{ body: slug }} sidebar={false} />; }
export function CityPage() { const { slug } = useParams(); return <ListPage key={slug} title={`Cars in ${cap(slug)}`} fetcher={getCars} base="cars" fixed={{ city: slug }} sidebar={false} />; }
export function MakePage() { const { make, model } = useParams(); return <ListPage key={make + model} title={cap(`${make} ${model || ""}`)} fetcher={getCars} base="cars" fixed={{ make, model }} sidebar={false} />; }

export function Directory() {
  return (
    <section className="container section">
      <h2>Browse Used Cars by Type, Make & City</h2>
      <div style={{ marginBottom: "16px" }}>
        <h4 style={{ color: "var(--muted)", margin: "0 0 8px" }}>Body Type & Category</h4>
        <div className="chips">{categories.map((c) => <Link key={c} to={`/categories/${c.toLowerCase()}`}>{c}</Link>)}</div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <h4 style={{ color: "var(--muted)", margin: "0 0 8px" }}>Popular Car Makes</h4>
        <div className="chips">{makes.map((m) => <Link key={m} to={`/make/${m.toLowerCase()}`}>{m}</Link>)}</div>
      </div>
      <div>
        <h4 style={{ color: "var(--muted)", margin: "0 0 8px" }}>Cars by City</h4>
        <div className="chips">{cities.map((c) => <Link key={c} to={`/city/${c.toLowerCase()}`}>📍 {c}</Link>)}</div>
      </div>
    </section>
  );
}
