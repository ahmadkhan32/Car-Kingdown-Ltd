import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const links = [
  ["/", "Home"],
  ["/cars", "Used Cars (Lahore)"],
  ["/new-cars", "New Cars"],
  ["/reviews", "Car Reviews"],
  ["/sell", "Sell Your Car"],
  ["/blog", "Auto Blog"],
  ["/parts", "Auto Parts"],
];

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="header">
      <div className="container header-in">
        <Link to="/" className="logo" id="logo-link">👑 Cars <b>Kingdom</b> LTD</Link>
        <nav className="nav">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
        </nav>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/sell" className="btn" id="header-sell-btn" style={{ padding: "8px 14px", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            + Post Ad
          </Link>
          <button id="cart-btn" className="btn btn-outline" onClick={() => setOpen(true)}>🛒 Cart ({count})</button>
        </div>
      </div>
    </header>
  );
}
