import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import SearchSuggestions from "./SearchSuggestions";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Silently handle auth errors during logout
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
      // Still clear user data on logout attempt
      setUser(null);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) setShowSuggestions(true);
    if (query.length === 0) setShowSuggestions(false);
  };

  return (
    <>
    <nav className={`flex items-center justify-between transition-all duration-500 sticky top-0 z-50 ${
      scrolled || location.pathname !== "/"
        ? "px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-2 sm:py-3 border-b border-emerald-100/60 bg-white/80 backdrop-blur-xl shadow-lg rounded-b-[2rem]" 
        : "px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-3 sm:py-5 bg-transparent"
    }`}>
      <Link to="/" className="flex items-center min-w-fit">
        <img 
          src={assets.freshLogo} 
          alt="FreshNest" 
          className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105 duration-300 drop-shadow-sm" 
          loading="eager"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-2 lg:gap-4 xl:gap-6 font-semibold text-gray-700 flex-1 px-4 lg:px-8">
        <Link to={"/"} className="text-gray-700 hover:text-emerald-600 transition duration-300 relative group text-xs lg:text-sm whitespace-nowrap">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-xs lg:text-sm relative pb-1 whitespace-nowrap">
            Shop
            <svg
              className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <div className="hidden group-hover:block absolute top-full left-0 pt-2 z-50">
            <ul className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-40 lg:w-48 animate-in fade-in slide-in-from-top-2 duration-200">
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/vegetables">Vegetables</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/fruits">Fresh Fruits</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/dairy">Dairy Products</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/beverages">Beverages</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/namkeens">Namkeens</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products/chocolates">Chocolates</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-xs lg:text-sm relative pb-1 whitespace-nowrap">
            Product
            <svg
              className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <div className="hidden group-hover:block absolute top-full left-0 pt-2 z-50">
            <ul className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-40 lg:w-48 animate-in fade-in slide-in-from-top-2 duration-200">
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/products">All Products</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/new-arrivals">New Arrivals</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/best-sellers">Best Sellers</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-xs lg:text-sm relative pb-1 whitespace-nowrap">
            Blog
            <svg
              className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <div className="hidden group-hover:block absolute top-full left-0 pt-2 z-50">
            <ul className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-40 lg:w-48 animate-in fade-in slide-in-from-top-2 duration-200">
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/blog">Latest News</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/blog/cooking-tips">Cooking Tips</Link>
              </li>
              <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs lg:text-sm font-medium">
                <Link className="block w-full" to="/blog/health">Health & Wellness</Link>
              </li>
            </ul>
          </div>
        </div>

        <Link to={"/rewards"} className="text-gray-700 hover:text-emerald-600 transition duration-300 relative group text-xs lg:text-sm whitespace-nowrap">
          Rewards
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <Link to={"/contact"} className="text-gray-700 hover:text-emerald-600 transition duration-300 relative group text-xs lg:text-sm whitespace-nowrap">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <div className="relative group">
          <div className="hidden lg:flex items-center text-sm gap-2.5 border border-gray-200 px-3 lg:px-4 py-2 lg:py-2.5 rounded-2xl hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm shadow-inner group">
            <input
              onChange={handleSearch}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              value={searchQuery}
              className="py-1 w-full bg-transparent outline-none placeholder-gray-400 text-gray-700 font-medium font-sans text-xs lg:text-sm"
              type="text"
              placeholder="Search..."
            />
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
          <SearchSuggestions 
            query={searchQuery} 
            isVisible={showSuggestions} 
            onClose={() => {
                setShowSuggestions(false);
                if (location.pathname !== "/products") navigate("/products");
            }} 
          />
        </div>
      </div>

      {/* Cart & Profile Icons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative ml-auto sm:ml-2">
        <div 
           onClick={() => {
             if (window.innerWidth > 640) {
               setShowCartDrawer(true);
             } else {
               navigate("/cart");
             }
           }} 
           className="hidden sm:flex relative cursor-pointer items-center justify-center h-9 sm:h-10 w-9 sm:w-10 bg-gray-50 text-gray-700 rounded-2xl border border-gray-100/50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-90"
        >
          <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:animate-bounce-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] sm:text-[10px] w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center font-black animate-scale-up-fade ring-2 ring-white">
              {cartCount()}
            </span>
          )}
        </div>

        <div className="relative group p-0.5 sm:p-1">
          <div
            onClick={() => !user ? setShowUserLogin(true) : null}
            className="hidden sm:flex items-center justify-center h-9 sm:h-10 w-9 sm:w-10 bg-gray-50 text-gray-700 rounded-2xl border border-gray-100/50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all cursor-pointer active:scale-90 overflow-hidden"
          >
            {user ? (
               <img src={assets.profile_icon} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )}
          </div>
          {user && (
            <div className="hidden group-hover:block absolute top-full right-0 pt-3 z-50">
              <ul className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl py-3 w-40 sm:w-44 animate-in fade-in slide-in-from-top-4">
                <li onClick={() => navigate("/my-orders")} className="px-4 py-2 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs sm:text-sm font-black cursor-pointer">
                  Orders History
                </li>
                <li onClick={() => navigate("/add-address")} className="px-4 py-2 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-xs sm:text-sm font-black cursor-pointer">
                  My Addresses
                </li>
                <li onClick={logout} className="px-4 py-2 mx-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition text-xs sm:text-sm font-black cursor-pointer mt-1 pt-3 border-t border-gray-100">
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden flex items-center justify-center h-9 w-9 bg-emerald-600 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-[65] sm:hidden transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className={`absolute top-0 right-0 w-full max-w-sm xs:max-w-xs h-full bg-white shadow-2xl transition-transform duration-500 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between">
                  <img src={assets.freshLogo} className="h-7 sm:h-8" />
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-black text-sm sm:text-base">
                  <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-lg sm:text-xl text-gray-900">Home</Link>
                  <div className="space-y-2">
                      <p className="text-[10px] text-emerald-600 uppercase tracking-widest pt-4">Categories</p>
                      <Link to="/products/vegetables" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Vegetables</Link>
                      <Link to="/products/fruits" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Fresh Fruits</Link>
                      <Link to="/products/dairy" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Dairy & Breakfast</Link>
                  </div>
                  <div className="space-y-2">
                      <p className="text-[10px] text-emerald-600 uppercase tracking-widest pt-4">Pages</p>
                      <Link to="/new-arrivals" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">New Arrivals</Link>
                      <Link to="/best-sellers" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Best Sellers</Link>
                      <Link to="/blog" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Our Blog</Link>
                      <Link to="/contact" onClick={() => setOpen(false)} className="block py-2 text-base sm:text-lg text-gray-700">Contact Us</Link>
                  </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-gray-50">
                  {user ? (
                      <button onClick={logout} className="w-full bg-red-50 text-red-600 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-red-100 transition">Sign Out</button>
                  ) : (
                      <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-emerald-700 transition">Sign In</button>
                  )}
              </div>
          </div>
      </div>
    </nav>
    <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
  );
};

export default Navbar;
