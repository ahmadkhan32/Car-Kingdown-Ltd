import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const links = [
  ["/", "Home"],
  ["/cars", "Used Cars"],
  ["/new-cars", "New Cars"],
  ["/reviews", "Reviews"],
  ["/sell", "Sell Your Car"],
  ["/blog", "Auto Blog"],
  ["/parts", "Auto Parts"],
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="header">
      <div className="container header-in">
        <Link to="/" className="logo" id="logo-link">
          👑 Cars <b>Kingdom</b> LTD
        </Link>

        {/* Desktop Navigation: No scrollbar, cleanly spaced */}
        <nav className="nav desktop-nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="header-actions">
          <Link to="/sell" className="btn btn-sell" id="header-sell-btn">
            + Post Ad
          </Link>
          <button
            id="cart-btn"
            className="btn btn-outline btn-cart"
            onClick={() => setOpen(true)}
            aria-label="View shopping cart"
          >
            🛒 <span className="cart-text">Cart</span> ({count})
          </button>
          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-head">
              <span className="logo">👑 Cars <b>Kingdom</b></span>
              <button
                className="close-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>
            <nav className="mobile-nav-links">
              {links.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mobile-menu-foot">
              <Link
                to="/sell"
                className="btn"
                style={{ width: "100%", marginBottom: "12px", textAlign: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                + Post Free Car Ad
              </Link>
              <button
                className="btn btn-outline"
                style={{ width: "100%", textAlign: "center" }}
                onClick={() => {
                  setMobileOpen(false);
                  setOpen(true);
                }}
              >
                🛒 Open Cart ({count})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
