import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="relative mt-20 sm:mt-24 md:mt-32 overflow-hidden bg-gray-900 pt-12 sm:pt-16 md:pt-20 lg:pt-32 pb-6 sm:pb-8 md:pb-12 text-gray-300">
      {/* Decorative top wave/glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-10">

        {/* Brand Section */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-start pr-0 lg:pr-8">
          <div className="inline-block mb-4 sm:mb-6 md:mb-8 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-2xl shadow-xl border border-white/20 transition-transform hover:scale-105 duration-500">
            <Link to="/">
              <img src={assets.freshLogo} alt="FreshNest Logo" className="w-24 sm:w-28 md:w-36 lg:w-44 h-auto object-contain drop-shadow-sm" />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 sm:mb-8">
            Your destination for fresh, organic, and locally sourced groceries, bringing the best quality straight to your kitchen.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20">
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" /></svg>
            </a>
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20">
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" /></svg>
            </a>
            <a href="#" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20">
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" /></svg>
            </a>
          </div>
        </div>

        {/* Links: Company */}
        <div className="lg:col-span-2 lg:ml-auto">
          <h3 className="text-white font-black uppercase tracking-widest text-[9px] sm:text-xs mb-4 sm:mb-6">Company</h3>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-emerald-400 transition-colors">All Products</Link></li>
            <li><Link to="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors">Blog</Link></li>
            <li><Link to="/best-sellers" className="text-gray-400 hover:text-emerald-400 transition-colors">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div className="lg:col-span-2 lg:ml-auto">
          <h3 className="text-white font-black uppercase tracking-widest text-[9px] sm:text-xs mb-4 sm:mb-6">Support</h3>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Safety Info</a></li>
            <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Cancellations</a></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter Small */}
        <div className="lg:col-span-4">
          <h3 className="text-white font-black uppercase tracking-widest text-[9px] sm:text-xs mb-4 sm:mb-6">Stay Updated</h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 leading-relaxed">
            Get the latest updates, exclusive discounts, and fresh grocery tips straight to your inbox.
          </p>
          <form className="flex items-center bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-2xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-inner">
            <input
              type="email"
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-white px-3 sm:px-4 py-2.5 sm:py-3.5 w-full placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 sm:p-3.5 transition-colors m-1 rounded-lg sm:rounded-xl flex-shrink-0">
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 border-t border-gray-800 pt-6 sm:pt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[8px] sm:text-xs text-gray-500">© {new Date().getFullYear()} FreshGrocery. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-[8px] sm:text-xs text-gray-500 font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
