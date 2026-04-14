import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Auth from "./modals/Auth";
import ProductCategory from "./pages/ProductCategory";
import Address from "./pages/Address";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Dashboard from "./pages/seller/Dashboard";
import NewArrivals from "./pages/NewArrivals";
import BestSellers from "./pages/BestSellers";
import Blog from "./pages/Blog";
import CookingTips from "./pages/CookingTips";
import Health from "./pages/Health";
import Rewards from "./pages/Rewards";
import BottomNav from "./components/BottomNav";
import FloatingCart from "./components/FloatingCart";
import ContactUs from "./pages/ContactUs";
import SellerMessages from "./pages/seller/SellerMessages";
import Profile from "./pages/Profile";

/**
 * Main App component that handles all routing for the FreshNest grocery application
 * Includes both customer-facing pages and seller dashboard routes
 */
const App = () => {
  // Check if current path is seller-related for conditional rendering
  const isSellerPath = useLocation().pathname.startsWith("/seller");

  // Get authentication state from context
  const { showUserLogin, isSeller, isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen text-default transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-slate-100 text-gray-900'}`}>
      {/* Conditionally render navbar for non-seller pages */}
      {isSellerPath ? null : <Navbar />}

      {/* Show authentication modal if needed */}
      {showUserLogin ? <Auth /> : null}

      {/* Toast notifications */}
      <Toaster />

      {/* Main content container with responsive padding */}
      <div className={`${isSellerPath ? "" : "px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24"}`}>
        <Routes>
          {/* Public customer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Address />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/cooking-tips" element={<CookingTips />} />
          <Route path="/blog/health" element={<Health />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Seller dashboard routes - protected by authentication */}
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <Dashboard /> : null} />
            <Route
              path="add-product"
              element={isSeller ? <AddProduct /> : null}
            />
            <Route
              path="product-list"
              element={isSeller ? <ProductList /> : null}
            />
            <Route path="orders" element={isSeller ? <Orders /> : null} />
            <Route path="messages" element={isSeller ? <SellerMessages /> : null} />
          </Route>
        </Routes>
      </div>

      {/* Conditionally render customer UI components for non-seller pages */}
      {isSellerPath ? null : <FloatingCart />}
      {isSellerPath ? null : <Footer />}
      {isSellerPath ? null : <BottomNav />}
    </div>
  );
};

export default App;
