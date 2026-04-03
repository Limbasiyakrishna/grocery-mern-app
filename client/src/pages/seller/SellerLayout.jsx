import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

const SellerLayout = () => {
  const { setIsSeller, axios, navigate, products } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/seller",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h10" />
        </svg>
      ),
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: "Messages",
      path: "/seller/messages",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        setIsSeller(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch {
      toast.error("Failed to logout");
    }
  };

  const stats = [
    { label: "Products", value: products.length, icon: "📦" },
    { label: "In Stock", value: products.filter((p) => p.inStock).length, icon: "✅" },
    { label: "Out of Stock", value: products.filter((p) => !p.inStock).length, icon: "⚠️" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h8" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow">
              <img src={assets.logo} alt="Logo" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="font-black text-gray-900 text-lg hidden sm:block">
              Fresh<span className="text-emerald-600">Nest</span>
            </span>
            <span className="text-[10px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full hidden sm:block">ADMIN</span>
          </Link>
        </div>

        {/* Quick stats in header */}
        <div className="hidden md:flex items-center gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className="text-xs text-gray-500 leading-none">{s.label}</p>
                <p className="text-sm font-black text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-sm font-semibold border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Admin
          </div>
          <Link to="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium hidden sm:flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition border border-red-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside
          className={`flex-shrink-0 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} min-h-full bg-slate-900 border-r border-slate-800 shadow-2xl z-20 overflow-y-auto`}
        >
          <nav className="flex flex-col gap-2 p-4 mt-2">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${isActive
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-all ${isActive ? "bg-white/20 shadow" : ""
                        }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    {!collapsed && isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer */}
          {!collapsed && (
            <div className="mt-auto p-4">
              <div className="rounded-2xl bg-white/10 p-3 border border-white/10 text-center">
                <p className="text-emerald-100 text-xs font-semibold">FreshNest Admin</p>
                <p className="text-emerald-200/60 text-[10px] mt-0.5">v1.0.0</p>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
