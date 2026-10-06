import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const links = [["/", "Home"], ["/cars", "Used Cars"], ["/bikes", "Used Bikes"], ["/new-cars", "New Cars"], ["/reviews", "Reviews"], ["/blog", "Blog"], ["/parts", "Auto Parts"]];

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="header">
      <div className="container header-in">
        <Link to="/" className="logo" id="logo-link">👑 Cars <b>Kingdom</b> LTD</Link>
        <nav className="nav">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
        </nav>
        <button id="cart-btn" className="btn btn-outline" onClick={() => setOpen(true)}>🛒 Cart ({count})</button>
      </div>
    </header>
  );
}
