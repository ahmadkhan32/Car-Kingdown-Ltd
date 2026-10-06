import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { fmtKm } from "../utils/helpers";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

const SPECS = [["make", "Make"], ["model", "Model"], ["variant", "Variant"], ["version", "Version"], ["year", "Year"], ["engine_cc", "Engine (cc)"], ["fuel_type", "Fuel"], ["transmission", "Transmission"], ["body_type", "Body type"], ["color", "Color"], ["assembly", "Assembly"], ["city", "City"]];

// Shared vehicle detail page with gallery, specs, features.
export default function VehicleDetail({ getter, back, label }) {
  const { id } = useParams();
  const [v, setV] = useState(undefined);
  const [img, setImg] = useState(0);
  useEffect(() => { setV(undefined); setImg(0); getter(id).then(setV).catch(() => setV(null)); }, [id, getter]);
  if (v === undefined) return <main className="container page"><Loading /></main>;
  if (!v) return <main className="container page"><EmptyState text={`${label} not found.`} /></main>;
  const imgs = v.images?.length ? v.images : [v.image];
  return (
    <main className="container page">
      <Link to={back} className="muted">← Back to {label}s</Link>
      <h1>{v.title}</h1>
      <div className="detail">
        <div>
          <img className="hero-img" src={imgs[img]} alt={v.title} />
          <div className="thumbs">{imgs.map((s, i) => <img key={s + i} src={s} alt="" className={i === img ? "on" : ""} onClick={() => setImg(i)} />)}</div>
        </div>
        <div>
          <div className="price big">{formatPrice(v.price, v.currency)}</div>
          {v.mileage_km != null && <p>{fmtKm(v.mileage_km)}</p>}
          <table className="specs"><tbody>{SPECS.filter(([k]) => v[k] != null).map(([k, l]) => <tr key={k}><th>{l}</th><td>{v[k]}</td></tr>)}</tbody></table>
        </div>
      </div>
      <h2>Description</h2><p>{v.description}</p>
      {v.features?.length > 0 && <><h2>Features</h2><ul className="features">{v.features.map((f) => <li key={f}>✓ {f}</li>)}</ul></>}
    </main>
  );
}
