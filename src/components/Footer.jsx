import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div><div className="logo">👑 Cars <b>Kingdom</b> LTD</div><p>Your trusted automotive marketplace for used cars, bikes, new cars, reviews and parts.</p></div>
        <div><h4>Explore</h4><Link to="/cars">Used Cars</Link><Link to="/bikes">Used Bikes</Link><Link to="/new-cars">New Cars</Link></div>
        <div><h4>Resources</h4><Link to="/reviews">Reviews</Link><Link to="/blog">Blog</Link><Link to="/parts">Auto Parts</Link></div>
        <div><h4>Cities</h4><Link to="/city/lahore">Lahore</Link><Link to="/city/karachi">Karachi</Link><Link to="/city/islamabad">Islamabad</Link></div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Cars Kingdom LTD. All rights reserved.</div>
    </footer>
  );
}
