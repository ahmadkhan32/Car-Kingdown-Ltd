import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils/formatPrice";
import { fmtKm } from "../utils/helpers";

export default function VehicleCard({ v, base = "cars" }) {
  return (
    <motion.article className="card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
      <div className="card-img"><img src={v.image} alt={v.title} loading="lazy" /></div>
      <div className="card-body">
        <h3>{v.title}</h3>
        <div className="price">{formatPrice(v.price, v.currency)}</div>
        <div className="meta">{[v.mileage_km != null && fmtKm(v.mileage_km), v.transmission, v.fuel_type].filter(Boolean).join(" • ")}</div>
        {v.city && <div className="city">📍 {v.city}</div>}
        <p className="desc">{v.description}</p>
        <Link className="btn" to={`/${base}/${v.id}`}>View Details</Link>
      </div>
    </motion.article>
  );
}
