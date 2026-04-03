import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import Features from "../components/Features";
import SpecialOffer from "../components/SpecialOffer";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

import MysteryBox from "../components/MysteryBox";

import RecipeSection from "../components/RecipeSection";

const Home = () => {
  return (
    <div className="pt-4 pb-16 min-h-screen">
      {/* 🏙️ Floating Premium Ticker (Integrated) */}
      <div className="mx-auto max-w-7xl mb-12 px-4 sm:px-6 lg:px-8">
        <div className="relative glass-dark rounded-[2rem] py-3.5 px-6 overflow-hidden border-emerald-500/20 shadow-xl group">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 animate-pulse"></div>
          
          <div className="flex whitespace-nowrap animate-shimmer-slow gap-16 items-center">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-10 min-w-max">
                <span className="flex items-center gap-2.5 text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-white/60 px-4 py-1.5 rounded-full shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  42 Active Shoppers
                </span>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-[0.15em]">
                  🚚 <span className="underline underline-offset-4 decoration-emerald-500/30">Free delivery</span> over ₹499
                </span>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-[0.15em]">
                  💎 100% Quality Assurance
                </span>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <section className="animate-fade-in"><Banner /></section>
      <section className="mt-20 px-4"><Features /></section>
      <section className="mt-24 px-4"><Category /></section>
      <section className="mt-24 px-4"><MysteryBox /></section>
      <section className="mt-24"><SpecialOffer /></section>
      <section className="mt-24 px-4"><RecipeSection /></section>
      <section className="mt-24 px-4"><BestSeller /></section>
      <section className="mt-24 px-4"><BottomBanner /></section>
      
      <div className="mt-32">
        <NewsLetter />
      </div>
    </div>
  );
};
export default Home;
