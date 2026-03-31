import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MysteryBox = () => {
    const { products, addToCart, navigate } = useAppContext();

    const handleUnlock = () => {
        const boxProduct = products.find(p => p.name === "Weekly Mystery Box");
        if (boxProduct) {
            addToCart(boxProduct._id);
            toast.success("✨ Mystery Box added to your cart!");
        } else {
            // Fallback if product not in DB yet
            toast.error("Mystery Box is currently unavailable.");
        }
    };

    return (
        <div className="py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 overflow-hidden relative border border-slate-800 shadow-2xl">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="flex-1 z-10 text-center lg:text-left order-last lg:order-none">
                    <div className="inline-block bg-emerald-500/20 text-emerald-400 px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-[0.2em] mb-3 sm:mb-4 md:mb-6 border border-emerald-500/30">
                        Limited Gamified Offer
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black mb-3 sm:mb-4 md:mb-6 leading-tight">THE WEEKLY <br /><span className="text-emerald-500">MYSTERY BOX</span></h2>
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 max-w-md font-medium">
                        Get 8-10 surprise organic vegetables & fruits at <span className="text-white font-bold">40% OFF</span>. Every week is a new adventure!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                        <button 
                            onClick={handleUnlock}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all shadow-lg shadow-emerald-900/40 active:scale-95 animate-pulse-glow"
                        >
                            Unlock For ₹299
                        </button>
                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                            <span className="flex">
                                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                            </span>
                            <span className="text-[9px] sm:text-xs font-bold text-slate-500">4.9/5 (2k+ box unlocked)</span>
                        </div>
                    </div>
                </div>

                <div className="relative group shrink-0 order-first lg:order-none">
                    <div className="absolute inset-[-4px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[2.5rem] animate-rotate-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-56 sm:w-60 md:w-64 lg:w-72 xl:w-80 h-56 sm:h-60 md:h-64 lg:h-72 xl:h-80 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[2.5rem] flex items-center justify-center border border-slate-700 shadow-inner overflow-hidden transform group-hover:scale-105 transition-all duration-500 relative">
                        <span className="text-9xl filter drop-shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-float">📦</span>
                        {/* Question marks floating around */}
                        <span className="absolute top-10 right-10 text-4xl text-emerald-500/20 transform -rotate-12 italic font-black animate-float-slow">?</span>
                        <span className="absolute bottom-10 left-10 text-5xl text-emerald-500/20 transform rotate-12 italic font-black animate-float-slow [animation-delay:1s]">?</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MysteryBox;
