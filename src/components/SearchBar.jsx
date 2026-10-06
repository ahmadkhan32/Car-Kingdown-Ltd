import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makes, cities } from "../services/vehicleApi";

export default function SearchBar() {
  const nav = useNavigate();
  const [f, setF] = useState({ type: "cars", make: "", city: "", q: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = (e) => {
    e.preventDefault();
    const { type, ...rest } = f;
    const qs = new URLSearchParams(Object.entries(rest).filter(([, v]) => v)).toString();
    nav(`/${type}${qs ? `?${qs}` : ""}`);
  };
  return (
    <form className="searchbar" onSubmit={go}>
      <select id="search-type" value={f.type} onChange={set("type")}><option value="cars">Search Cars</option><option value="bikes">Search Bikes</option></select>
      <select id="search-make" value={f.make} onChange={set("make")}><option value="">Any Make</option>{makes.map((m) => <option key={m}>{m}</option>)}</select>
      <select id="search-city" value={f.city} onChange={set("city")}><option value="">Any City</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
      <input id="search-q" placeholder="Keyword (e.g. Corolla)" value={f.q} onChange={set("q")} />
      <button id="search-submit" className="btn" type="submit">Search</button>
    </form>
  );
}
