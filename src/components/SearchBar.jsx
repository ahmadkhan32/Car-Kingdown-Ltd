import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makes, categories } from "../services/vehicleApi";

export default function SearchBar() {
  const nav = useNavigate();
  const [f, setF] = useState({ make: "", body: "", city: "Lahore", q: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    nav(`/cars${qs ? `?${qs}` : ""}`);
  };
  return (
    <form className="searchbar" onSubmit={go}>
      <select id="search-make" value={f.make} onChange={set("make")}>
        <option value="">All Makes</option>
        {makes.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select id="search-body" value={f.body} onChange={set("body")}>
        <option value="">All Body Types</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select id="search-city" value={f.city} onChange={set("city")}>
        <option value="Lahore">Lahore Only</option>
        <option value="All">All Cities</option>
      </select>
      <input id="search-q" placeholder="Car model / keyword (e.g. Corolla, Cultus)" value={f.q} onChange={set("q")} />
      <button id="search-submit" className="btn" type="submit">Search Cars</button>
    </form>
  );
}
