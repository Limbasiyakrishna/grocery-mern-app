import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="relative mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden min-h-[320px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[540px] flex items-center hero-gradient border border-emerald-100 shadow-2xl scene-3d">

      {/* ── Ambient 3-D orbs ── */}
      <div className="float-orb w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-300 top-[-3rem] sm:top-[-4rem] md:top-[-6rem] right-[-2rem] sm:right-[-3rem] md:right-[-4rem]" style={{ animation: "float-slow 9s ease-in-out infinite" }} />
      <div className="float-orb w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-teal-200 bottom-[-1.5rem] sm:bottom-[-2rem] md:bottom-[-3rem] left-[-1rem] sm:left-[-1.5rem] md:left-[-2rem]" style={{ animation: "float-slow 12s ease-in-out infinite reverse" }} />
      <div className="float-orb w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 bg-lime-200 top-1/2 left-1/3" style={{ animation: "float 7s ease-in-out infinite 2s" }} />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between relative z-10 py-8 sm:py-12 md:py-20 pb-12 sm:pb-16 md:pb-24 gap-6 sm:gap-8 md:gap-12">

        {/* ── LEFT: Copy ── */}
        <div className="w-full md:w-1/2 text-center md:text-left pt-2 sm:pt-4 md:pt-6">
          <span className="inline-block px-3 sm:px-5 py-1.5 sm:py-2 bg-white/90 text-emerald-700 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase mb-4 sm:mb-6 md:mb-8 shadow-sm border border-emerald-100/50 animate-bounce-in">
            🛒 SUMMER REFRESH DEALS
          </span>

          <h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-4 sm:mb-6 md:mb-8 animate-fade-in"
          >
            Organic Freshness <br/>
            <span
              className="relative inline-block py-1 sm:py-2"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              For Your Family
            </span>
            <br />
            Savings You'll Love!
          </h1>

          <p
            className="text-slate-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-md md:max-w-none mx-auto md:mx-0 animate-fade-in line-clamp-3 leading-relaxed"
          >
            We bring farm-fresh organic produce and premium grocery essentials directly to your doorstep with guaranteed quality.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 justify-center md:justify-start animate-fade-in"
          >
            <Link
              to="/products"
              className="btn-primary text-sm md:text-base px-6 sm:px-8 py-2.5 sm:py-4"
            >
              Start Shopping
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/products"
              className="px-5 sm:px-8 py-2.5 sm:py-4 bg-white/80 text-gray-900 rounded-lg sm:rounded-2xl font-black hover:bg-white transition-all border border-slate-200 shadow-sm hover:shadow-lg text-xs sm:text-sm md:text-sm uppercase tracking-widest"
            >
              Quick Deals
            </Link>
          </div>

          {/* mini stats */}
          <div
            className="flex gap-4 sm:gap-8 md:gap-10 mt-6 sm:mt-10 md:mt-12 justify-center md:justify-start animate-fade-in flex-wrap"
          >
            {[
              { num: "10K+", label: "Happy Shoppers" },
              { num: "500+", label: "Products" },
              { num: "100%", label: "Organic" },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-lg sm:text-xl md:text-2xl font-black text-emerald-600 tracking-tighter">{s.num}</p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3-D product image ── */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          {/* Rotating ring */}
          <div
            className="absolute w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 rounded-full border-2 border-dashed border-emerald-200 opacity-50"
            style={{ animation: "rotate-border 20s linear infinite" }}
          />
          {/* Second ring */}
          <div
            className="absolute w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full border border-teal-200 opacity-40"
            style={{ animation: "rotate-border 14s linear infinite reverse" }}
          />

          {/* Main image with 3-D float */}
          <div className="relative animate-float" style={{ animationDuration: "5s" }}>
            <img
              src={assets.organic_vegitable_image}
              alt="Fresh Vegetables"
              className="w-40 sm:w-56 md:w-72 lg:w-96 h-auto drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 30px 40px rgba(5,150,105,0.3))",
              }}
            />

            {/* Floating badge – OFFER */}
            <div
              className="glass absolute -top-3 sm:-top-6 -right-3 sm:-right-6 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-2xl shadow-xl animate-float"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            >
              <p className="text-[8px] sm:text-[10px] text-emerald-600 font-black uppercase tracking-widest">Offer</p>
              <p className="text-lg sm:text-2xl font-black text-gray-900">30% OFF</p>
            </div>

            {/* Floating badge – FRESH */}
            <div
              className="glass absolute bottom-4 sm:bottom-8 -left-6 sm:-left-10 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl shadow-xl animate-float flex items-center gap-1.5 sm:gap-2"
              style={{ animationDelay: "1.8s", animationDuration: "3.5s" }}
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs sm:text-lg flex-shrink-0">✓</div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-xs font-black text-gray-800 whitespace-nowrap">100% Fresh</p>
                <p className="text-[7px] sm:text-[10px] text-gray-500">Farm to table</p>
              </div>
            </div>

            {/* Orbiting dot */}
            <div
              className="absolute top-1/2 left-1/2 w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 bg-emerald-400 rounded-full shadow-lg"
              style={{
                animation: "orbit 8s linear infinite",
                marginLeft: "-5px",
                marginTop: "-5px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
