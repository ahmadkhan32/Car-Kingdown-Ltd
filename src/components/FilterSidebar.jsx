import { makes, cities, bodyTypes } from "../services/vehicleApi";

export default function FilterSidebar({ filters, update, clear }) {
  const on = (k) => (e) => update({ [k]: e.target.value });
  return (
    <aside className="filters">
      <h3>Filters</h3>
      <label>Keyword<input id="f-q" value={filters.q || ""} onChange={on("q")} /></label>
      <label>Make<select id="f-make" value={filters.make || ""} onChange={on("make")}><option value="">All Makes</option>{makes.map((m) => <option key={m}>{m}</option>)}</select></label>
      <label>Body Type<select id="f-body" value={filters.body || ""} onChange={on("body")}><option value="">All Body Types</option>{bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}</select></label>
      <label>City<select id="f-city" value={filters.city || ""} onChange={on("city")}><option value="">All Cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>Year<input id="f-year" type="number" value={filters.year || ""} onChange={on("year")} /></label>
      <div className="row2">
        <label>Min Price<input id="f-min" type="number" value={filters.minPrice || ""} onChange={on("minPrice")} /></label>
        <label>Max Price<input id="f-max" type="number" value={filters.maxPrice || ""} onChange={on("maxPrice")} /></label>
      </div>
      <label>Transmission<select id="f-trans" value={filters.transmission || ""} onChange={on("transmission")}><option value="">All</option><option>Automatic</option><option>Manual</option></select></label>
      <label>Fuel<select id="f-fuel" value={filters.fuel || ""} onChange={on("fuel")}><option value="">All</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option></select></label>
      <button className="btn btn-outline" onClick={clear}>Clear filters</button>
    </aside>
  );
}
