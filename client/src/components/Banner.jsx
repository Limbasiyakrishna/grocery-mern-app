import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="relative mt-6 rounded-[2.5rem] overflow-hidden min-h-[480px] md:min-h-[540px] flex items-center hero-gradient border border-emerald-100 shadow-2xl scene-3d">

      {/* ── Ambient 3-D orbs ── */}
      <div className="float-orb w-96 h-96 bg-emerald-300 top-[-6rem] right-[-4rem]" style={{ animation: "float-slow 9s ease-in-out infinite" }} />
      <div className="float-orb w-64 h-64 bg-teal-200 bottom-[-3rem] left-[-2rem]" style={{ animation: "float-slow 12s ease-in-out infinite reverse" }} />
      <div className="float-orb w-40 h-40 bg-lime-200 top-1/2 left-1/3" style={{ animation: "float 7s ease-in-out infinite 2s" }} />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between relative z-10 py-14 gap-10">

        {/* ── LEFT: Copy ── */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <span className="inline-block px-5 py-1.5 bg-white/80 text-emerald-700 rounded-full text-[11px] font-black tracking-widest uppercase mb-6 animate-fade-in shadow-sm border border-emerald-100">
            🛒 Exclusive Grocery Deals
          </span>

          <h1
            className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6 animate-fade-in opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Freshness You{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Can Trust,
            </span>
            <br />
            Savings You'll Love!
          </h1>

          <p
            className="text-gray-600 text-lg mb-8 max-w-md mx-auto md:mx-0 animate-fade-in opacity-0"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            Premium organic vegetables and daily essentials — delivered fresh to your door in under 30 minutes.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start animate-fade-in opacity-0"
            style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          >
            <Link
              to="/products"
              className="btn-primary flex items-center gap-2 text-sm tracking-wide"
            >
              Shop Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/products"
              className="px-7 py-3 bg-white/80 text-gray-900 rounded-[0.875rem] font-bold hover:bg-white transition-all border border-gray-200 shadow hover:shadow-lg text-sm"
            >
              Explore Deals
            </Link>
          </div>

          {/* mini stats */}
          <div
            className="flex gap-8 mt-10 justify-center md:justify-start animate-fade-in opacity-0"
            style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
          >
            {[
              { num: "10K+", label: "Happy Customers" },
              { num: "500+", label: "Products" },
              { num: "30min", label: "Delivery" },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-2xl font-black text-emerald-700">{s.num}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3-D product image ── */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          {/* Rotating ring */}
          <div
            className="absolute w-80 h-80 rounded-full border-2 border-dashed border-emerald-200 opacity-50"
            style={{ animation: "rotate-border 20s linear infinite" }}
          />
          {/* Second ring */}
          <div
            className="absolute w-64 h-64 rounded-full border border-teal-200 opacity-40"
            style={{ animation: "rotate-border 14s linear infinite reverse" }}
          />

          {/* Main image with 3-D float */}
          <div className="relative animate-float" style={{ animationDuration: "5s" }}>
            <img
              src={assets.organic_vegitable_image}
              alt="Fresh Vegetables"
              className="w-72 md:w-96 h-auto drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 30px 40px rgba(5,150,105,0.3))",
              }}
            />

            {/* Floating badge – OFFER */}
            <div
              className="glass absolute -top-6 -right-6 px-5 py-3 rounded-2xl shadow-xl animate-float"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            >
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Offer</p>
              <p className="text-2xl font-black text-gray-900">30% OFF</p>
            </div>

            {/* Floating badge – FRESH */}
            <div
              className="glass absolute bottom-8 -left-10 px-4 py-2.5 rounded-2xl shadow-xl animate-float flex items-center gap-2"
              style={{ animationDelay: "1.8s", animationDuration: "3.5s" }}
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-lg">✓</div>
              <div>
                <p className="text-xs font-black text-gray-800">100% Fresh</p>
                <p className="text-[10px] text-gray-500">Farm to table</p>
              </div>
            </div>

            {/* Orbiting dot */}
            <div
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"
              style={{
                animation: "orbit 8s linear infinite",
                marginLeft: "-8px",
                marginTop: "-8px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
