import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserCar, deleteUserCar, getUserCars, bodyTypes, makes, cities } from "../services/vehicleApi";
import { formatPrice } from "../utils/formatPrice";

const IMAGE_PRESETS = [
  { label: "Sedan", url: "/images/car-sedan.jpg" },
  { label: "SUV", url: "/images/car-suv.jpg" },
  { label: "Sports / Coupe", url: "/images/car-sports.jpg" },
  { label: "Hatchback", url: "/images/car-hatchback.jpg" },
  { label: "Luxury", url: "/images/car-luxury.jpg" },
];

const POPULAR_FEATURES = [
  "ABS",
  "Air Conditioning",
  "Sunroof",
  "Alloy Wheels",
  "Airbags",
  "Power Windows",
  "Power Steering",
  "Keyless Entry",
  "Push Start",
  "Cruise Control",
  "Reverse Camera",
  "Android Auto / Apple CarPlay",
];

const LAHORE_AREAS = [
  "DHA Phase 5, Lahore",
  "Gulberg III, Lahore",
  "Johar Town, Lahore",
  "Model Town, Lahore",
  "Cantt, Lahore",
  "Bahria Town, Lahore",
  "Faisal Town, Lahore",
  "Garden Town, Lahore",
  "Allama Iqbal Town, Lahore",
  "Wapda Town, Lahore",
];

export default function Sell() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("form"); // "form" | "my-cars"
  const [myCars, setMyCars] = useState(() => getUserCars());
  const [submittedId, setSubmittedId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    make: "Toyota",
    model: "Corolla",
    version: "Altis 1.6",
    year: "2021",
    price: "5500000",
    city: "Lahore",
    location: "DHA Phase 5, Lahore",
    body_type: "Sedan",
    mileage_km: "45000",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine_cc: "1600",
    color: "White",
    assembly: "Local",
    description: "Well maintained family car in genuine condition, driven inside Lahore. All token taxes paid up to date, complete return file available.",
    image: "/images/car-sedan.jpg",
    features: ["ABS", "Air Conditioning", "Power Windows", "Airbags", "Keyless Entry"],
    seller_name: "Private Seller",
  });

  const toggleFeature = (feat) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists ? prev.features.filter((f) => f !== feat) : [...prev.features, feat],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = formData.title.trim() || `${formData.make} ${formData.model} ${formData.year}`;
    const newCar = createUserCar({
      ...formData,
      title: finalTitle,
    });
    setMyCars(getUserCars());
    setSubmittedId(newCar.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this car listing?")) {
      deleteUserCar(id);
      setMyCars(getUserCars());
    }
  };

  return (
    <main className="container page">
      <div className="section-head" style={{ marginBottom: "20px" }}>
        <div>
          <h1>Sell Your Car in <span>Lahore</span></h1>
          <p className="muted">List your used car on Cars Kingdom LTD. Verified buyers, zero brokerage fee, 100% free car listing.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          className={`btn ${tab === "form" ? "" : "btn-outline"}`}
          onClick={() => { setTab("form"); setSubmittedId(null); }}
        >
          + Post a Car Ad
        </button>
        <button
          className={`btn ${tab === "my-cars" ? "" : "btn-outline"}`}
          onClick={() => setTab("my-cars")}
        >
          My Listed Cars ({myCars.length})
        </button>
      </div>

      {submittedId ? (
        <div style={{ background: "var(--panel)", border: "1px solid var(--gold)", borderRadius: "16px", padding: "32px", textAlign: "center", maxWidth: "600px", margin: "20px auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ color: "var(--gold)", margin: "0 0 10px" }}>Car Ad Published Successfully!</h2>
          <p className="muted" style={{ marginBottom: "24px" }}>
            Your used car listing is now live in Cars Kingdom LTD's Lahore marketplace. Buyers can now discover and view your car.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to={`/cars/${submittedId}`} className="btn">
              View Your Car Ad →
            </Link>
            <button className="btn btn-outline" onClick={() => { setSubmittedId(null); setTab("form"); }}>
              Post Another Car
            </button>
          </div>
        </div>
      ) : tab === "form" ? (
        <form onSubmit={handleSubmit} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ marginTop: 0 }}>Vehicle Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <label>
              Make
              <select name="make" value={formData.make} onChange={handleChange} required>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>

            <label>
              Model
              <input name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Corolla, Civic, Cultus" required />
            </label>

            <label>
              Variant / Version
              <input name="version" value={formData.version} onChange={handleChange} placeholder="e.g. Altis 1.6, VXL, Oriel" />
            </label>

            <label>
              Model Year
              <input name="year" type="number" min="1990" max="2026" value={formData.year} onChange={handleChange} required />
            </label>

            <label>
              Price (PKR)
              <input name="price" type="number" min="100000" step="10000" value={formData.price} onChange={handleChange} required />
            </label>

            <label>
              Body Type
              <select name="body_type" value={formData.body_type} onChange={handleChange} required>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>

            <label>
              City
              <select name="city" value={formData.city} onChange={handleChange} required>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              Lahore Area / Location
              <select name="location" value={formData.location} onChange={handleChange} required>
                {LAHORE_AREAS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </label>

            <label>
              Mileage (km)
              <input name="mileage_km" type="number" min="0" value={formData.mileage_km} onChange={handleChange} required />
            </label>

            <label>
              Engine Capacity (cc)
              <input name="engine_cc" type="number" min="600" max="8000" value={formData.engine_cc} onChange={handleChange} required />
            </label>

            <label>
              Fuel Type
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </label>

            <label>
              Transmission
              <select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </label>

            <label>
              Color
              <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White, Black, Silver" />
            </label>

            <label>
              Assembly
              <select name="assembly" value={formData.assembly} onChange={handleChange}>
                <option value="Local">Local</option>
                <option value="Imported">Imported</option>
              </select>
            </label>

            <label>
              Seller Name / Title
              <input name="seller_name" value={formData.seller_name} onChange={handleChange} placeholder="Your Name or Dealer" />
            </label>
          </div>

          <div style={{ marginTop: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Select HD Studio Photo</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
              {IMAGE_PRESETS.map((preset) => (
                <div
                  key={preset.url}
                  onClick={() => setFormData((p) => ({ ...p, image: preset.url }))}
                  style={{
                    border: formData.image === preset.url ? "2px solid var(--gold)" : "1px solid var(--line)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: "4px",
                    background: formData.image === preset.url ? "var(--panel2)" : "transparent",
                    textAlign: "center",
                  }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: "100%", height: "70px", objectFit: "cover", borderRadius: "6px" }} />
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{preset.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Car Features & Options</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
              {POPULAR_FEATURES.map((feat) => {
                const checked = formData.features.includes(feat);
                return (
                  <label
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: checked ? "var(--panel2)" : "transparent",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      color: checked ? "var(--gold)" : "var(--text)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFeature(feat)}
                      style={{ width: "auto" }}
                    />
                    <span>{feat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel2)", color: "var(--text)", font: "inherit" }}
              placeholder="Describe condition, maintenance records, inspection reports, documents, etc."
            />
          </div>

          <div style={{ marginTop: "28px" }}>
            <button type="submit" className="btn" style={{ fontSize: "1.05rem", padding: "14px 28px" }}>
              🚀 Publish Car Ad
            </button>
          </div>
        </form>
      ) : (
        <div>
          {myCars.length === 0 ? (
            <div className="empty">
              <span>🚗</span>
              <p>You haven't listed any cars yet.</p>
              <button className="btn" onClick={() => setTab("form")}>+ Post Your First Car Ad</button>
            </div>
          ) : (
            <div className="grid">
              {myCars.map((car) => (
                <div key={car.id} className="card">
                  <div className="card-img">
                    <img src={car.image} alt={car.title} />
                  </div>
                  <div className="card-body">
                    <span className="tag" style={{ width: "fit-content" }}>User Listed</span>
                    <h3>{car.title}</h3>
                    <div className="price">{formatPrice(car.price, car.currency)}</div>
                    <div className="meta">
                      {car.body_type} • {car.year} • {car.mileage_km.toLocaleString()} km
                    </div>
                    <div className="city">📍 {car.location || car.city}</div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <Link to={`/cars/${car.id}`} className="btn" style={{ flex: 1, padding: "8px 12px" }}>
                        View Ad
                      </Link>
                      <button
                        className="btn btn-outline"
                        style={{ padding: "8px 12px", color: "#ff6b6b", borderColor: "#ff6b6b" }}
                        onClick={() => handleDelete(car.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
