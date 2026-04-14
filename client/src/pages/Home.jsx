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
    <div className="pt-2 sm:pt-4 pb-16 md:pb-0 min-h-screen page-bottom-padding">
      {/* 🏙️ Floating Premium Ticker (Integrated) */}
      <div className="mx-auto max-w-7xl mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4 lg:px-0">
        <div className="relative glass-dark rounded-[1.5rem] sm:rounded-[2rem] py-2.5 sm:py-3.5 px-4 sm:px-6 overflow-hidden border-emerald-500/20 shadow-xl group">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 animate-pulse"></div>
          
          <div className="flex whitespace-nowrap animate-shimmer-slow gap-10 sm:gap-16 items-center">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-6 sm:gap-10 min-w-max">
                <span className="flex items-center gap-2 sm:gap-2.5 text-[9px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-white/60 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  42 Active Shoppers
                </span>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
                <span className="text-[9px] sm:text-[11px] font-black text-emerald-800 uppercase tracking-[0.12em] sm:tracking-[0.15em]">
                  🚚 <span className="underline underline-offset-4 decoration-emerald-500/30">Free delivery</span> over ₹499
                </span>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
                <span className="text-[9px] sm:text-[11px] font-black text-emerald-900 uppercase tracking-[0.12em] sm:tracking-[0.15em]">
                  💎 100% Quality Assurance
                </span>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-30">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <section className="animate-fade-in"><Banner /></section>
      <section className="mt-12 sm:mt-16 md:mt-20 px-2 sm:px-4 lg:px-0"><Features /></section>
      <section className="mt-10 sm:mt-16 md:mt-24 px-2 sm:px-4 lg:px-0"><Category /></section>
      <section className="mt-10 sm:mt-16 md:mt-24 px-2 sm:px-4 lg:px-0"><MysteryBox /></section>
      <section className="mt-10 sm:mt-16 md:mt-24"><SpecialOffer /></section>
      <section className="mt-10 sm:mt-16 md:mt-24 px-2 sm:px-4 lg:px-0"><RecipeSection /></section>
      <section className="mt-10 sm:mt-16 md:mt-24 px-2 sm:px-4 lg:px-0"><BestSeller /></section>
      <section className="mt-10 sm:mt-16 md:mt-24 px-2 sm:px-4 lg:px-0"><BottomBanner /></section>
      
      <div className="mt-16 sm:mt-24 md:mt-32">
        <NewsLetter />
      </div>
    </div>
  );
};
export default Home;
