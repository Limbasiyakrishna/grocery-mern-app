import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openShop, setOpenShop] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openBlog, setOpenBlog] = useState(false);
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
      toast.error(error.message);
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0 && location.pathname !== "/products") {
      navigate("/products");
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 py-2 border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/95 via-white/95 to-teal-50/95 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm rounded-b-2xl md:rounded-b-[2rem]">
      <Link to="/" className="flex items-center">
        <img src={assets.freshLogo} alt="FreshNest Logo" className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105 duration-300 drop-shadow-sm" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6 lg:gap-8 font-semibold text-gray-700">
        <Link to={"/"} className="text-gray-700 hover:text-emerald-600 transition duration-300 relative group text-sm lg:text-base">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-sm lg:text-base relative pb-1">
            Shop
            <svg
              className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <ul className="hidden group-hover:block absolute top-full left-0 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-48 z-50 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/vegetables">Vegetables</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/fruits">Fresh Fruits</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/dairy">Dairy Products</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/beverages">Beverages</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/namkeens">Namkeens</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products/chocolates">Chocolates</Link>
            </li>
          </ul>
        </div>

        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-sm lg:text-base relative pb-1">
            Product
            <svg
              className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <ul className="hidden group-hover:block absolute top-full left-0 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-48 z-50 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/products">All Products</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/new-arrivals">New Arrivals</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/best-sellers">Best Sellers</Link>
            </li>
          </ul>
        </div>

        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition text-sm lg:text-base relative pb-1">
            Blog
            <svg
              className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </div>
          <ul className="hidden group-hover:block absolute top-full left-0 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl py-2 w-48 z-50 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/blog">Latest News</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/blog/cooking-tips">Cooking Tips</Link>
            </li>
            <li className="px-3 py-1.5 mx-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-medium">
              <Link className="block w-full" to="/blog/health">Health & Wellness</Link>
            </li>
          </ul>
        </div>

        <Link to={"/rewards"} className="text-gray-700 hover:text-emerald-600 transition duration-300 relative group text-sm lg:text-base">
          Rewards
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <div className="hidden lg:flex items-center text-sm gap-2.5 border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm shadow-inner group">
          <input
            onChange={handleSearch}
            value={searchQuery}
            className="py-1 w-full bg-transparent outline-none placeholder-gray-400 text-gray-700 font-medium font-sans"
            type="text"
            placeholder="Search groceries..."
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

        <div onClick={() => navigate("/cart")} className="relative cursor-pointer group flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-600 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-300 drop-shadow-sm"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            />
          </svg>
          <button className="absolute -top-1.5 -right-2 text-[10px] text-white bg-red-500 border-2 border-white w-5 h-5 rounded-full font-black shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
            {cartCount()}
          </button>
        </div>

        {user ? (
          <div className="relative group">
            <img src={assets.profile_icon} alt="Profile" className="w-9 h-9 rounded-full cursor-pointer hover:shadow-md transition-shadow" />
            <ul className="hidden group-hover:block absolute top-11 right-0 bg-white shadow-lg border border-gray-200 py-2 w-32 rounded-lg z-40 text-sm">
              <li
                onClick={() => navigate("/my-orders")}
                className="px-4 py-2.5 cursor-pointer hover:bg-emerald-50 hover:text-emerald-600 transition text-sm"
              >
                My Orders
              </li>
              <li className="cursor-pointer px-4 py-2.5 hover:bg-rose-50 hover:text-rose-600 transition text-sm" onClick={logout}>
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg active:scale-95"
          >
            Login
          </button>
        )}
      </div>
      <div className="flex items-center gap-6 md:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#059669"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-emerald-600 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          {/* Menu Icon SVG */}
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#426287"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
      >
        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full w-full mb-4">
          <input
            onChange={handleSearch}
            value={searchQuery}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              clip-rule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <Link onClick={() => setOpen(false)} to={"/"} className="w-full py-2 hover:text-emerald-600">
          Home
        </Link>

        {/* Mobile Shop Dropdown */}
        <div className="w-full">
          <button
            onClick={() => setOpenShop(!openShop)}
            className="w-full text-left py-2 hover:text-emerald-600 flex justify-between items-center"
          >
            Shop
            <svg
              className={`w-3.5 h-3.5 transition-transform ${openShop ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {openShop && (
            <div className="pl-4 flex flex-col gap-2">
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/vegetables"
                className="py-1.5 hover:text-emerald-600"
              >
                Vegetables
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/fruits"
                className="py-1.5 hover:text-emerald-600"
              >
                Fresh Fruits
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/dairy"
                className="py-1.5 hover:text-emerald-600"
              >
                Dairy Products
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/beverages"
                className="py-1.5 hover:text-emerald-600"
              >
                Beverages
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/namkeens"
                className="py-1.5 hover:text-emerald-600"
              >
                Namkeens
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenShop(false);
                }}
                to="/products/chocolates"
                className="py-1.5 hover:text-emerald-600"
              >
                Chocolates
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Product Dropdown */}
        <div className="w-full">
          <button
            onClick={() => setOpenProduct(!openProduct)}
            className="w-full text-left py-2 hover:text-emerald-600 flex justify-between items-center"
          >
            Products
            <svg
              className={`w-3.5 h-3.5 transition-transform ${openProduct ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {openProduct && (
            <div className="pl-4 flex flex-col gap-2">
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenProduct(false);
                }}
                to="/products"
                className="py-1.5 hover:text-emerald-600"
              >
                All Products
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenProduct(false);
                }}
                to="/new-arrivals"
                className="py-1.5 hover:text-emerald-600"
              >
                New Arrivals
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenProduct(false);
                }}
                to="/best-sellers"
                className="py-1.5 hover:text-emerald-600"
              >
                Best Sellers
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Blog Dropdown */}
        <div className="w-full">
          <button
            onClick={() => setOpenBlog(!openBlog)}
            className="w-full text-left py-2 hover:text-emerald-600 flex justify-between items-center"
          >
            Blog
            <svg
              className={`w-3.5 h-3.5 transition-transform ${openBlog ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {openBlog && (
            <div className="pl-4 flex flex-col gap-2">
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenBlog(false);
                }}
                to="/blog"
                className="py-1.5 hover:text-emerald-600"
              >
                Latest News
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenBlog(false);
                }}
                to="/blog/cooking-tips"
                className="py-1.5 hover:text-emerald-600"
              >
                Cooking Tips
              </Link>
              <Link
                onClick={() => {
                  setOpen(false);
                  setOpenBlog(false);
                }}
                to="/blog/health"
                className="py-1.5 hover:text-emerald-600"
              >
                Health & Wellness
              </Link>
            </div>
          )}
        </div>

        {user ? (
          <div className="w-full">
            <button
              onClick={() => navigate("/my-orders")}
              className="w-full text-left py-2 hover:text-emerald-600"
            >
              My Orders
            </button>
            <button
              className="w-full text-left py-2 hover:text-emerald-600"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full w-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
