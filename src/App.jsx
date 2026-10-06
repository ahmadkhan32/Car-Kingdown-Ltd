import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Notification from "./components/Notification";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Bikes from "./pages/Bikes";
import BikeDetail from "./pages/BikeDetail";
import NewCars, { NewCarDetail } from "./pages/NewCars";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Parts from "./pages/Parts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CategoryPage, CityPage, MakePage } from "./pages/Browse";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/bikes/:id" element={<BikeDetail />} />
          <Route path="/new-cars" element={<NewCars />} />
          <Route path="/new-cars/:id" element={<NewCarDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/parts/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/city/:slug" element={<CityPage />} />
          <Route path="/make/:make" element={<MakePage />} />
          <Route path="/make/:make/:model" element={<MakePage />} />
          <Route path="*" element={<main className="container page"><h1>Page not found</h1></main>} />
        </Routes>
        <Footer />
        <CartDrawer />
        <Notification />
      </CartProvider>
    </BrowserRouter>
  );
}
