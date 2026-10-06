import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div>
          <div className="logo">👑 Cars <b>Kingdom</b> LTD</div>
          <p>Your trusted automotive marketplace for used cars in Lahore, new cars, detailed car reviews, and auto parts.</p>
        </div>
        <div>
          <h4>Explore Cars</h4>
          <Link to="/cars">Used Cars (Lahore)</Link>
          <Link to="/new-cars">New Cars</Link>
          <Link to="/categories/sedan">Sedans</Link>
          <Link to="/categories/suv">SUVs</Link>
        </div>
        <div>
          <h4>Resources</h4>
          <Link to="/reviews">Car Reviews</Link>
          <Link to="/blog">Auto Blog</Link>
          <Link to="/parts">Auto Parts</Link>
        </div>
        <div>
          <h4>Lahore & Regions</h4>
          <Link to="/city/lahore">Lahore Cars</Link>
          <Link to="/make/toyota">Toyota Cars</Link>
          <Link to="/make/honda">Honda Cars</Link>
          <Link to="/make/suzuki">Suzuki Cars</Link>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Cars Kingdom LTD — Lahore Automotive Portal. All rights reserved.</div>
    </footer>
  );
}
