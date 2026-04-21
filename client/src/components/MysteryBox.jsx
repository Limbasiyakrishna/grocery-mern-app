import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MysteryBox = () => {
    const { addToCart } = useAppContext();

    const handleBuyBox = () => {
        // We'll simulate adding a "Mystery Bag" product ID
        // In a real app, this would be a specific product in the DB
        toast.success("📦 Freshnest Mystery Bag added! Get ready for a surprise!");
        addToCart('mystery-box-id-123'); 
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-12 md:p-16 text-white shadow-2xl">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">New Feature</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[0.95]">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Mystery</span> <br/>
                        Surprise Bag
                    </h2>
                    
                    <p className="text-sm sm:text-base md:text-lg text-purple-100/70 font-medium max-w-lg mb-8 leading-relaxed">
                        Get ₹500 worth of premium organic groceries for just <span className="text-white font-black">₹199</span>. 
                        Every bag is unique, packed with fresh surprises from our daily farm harvest!
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <button 
                            onClick={handleBuyBox}
                            className="px-10 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-purple-100 transition-all shadow-xl active:scale-95"
                        >
                            Claim My Bag
                        </button>
                        <div className="flex flex-col items-center md:items-start">
                            <span className="text-xs font-black text-purple-300 line-through">₹499</span>
                            <span className="text-xl font-black text-white">₹199 Only</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative group">
                    {/* Visual representation of a mystery box */}
                    <div className="relative w-48 sm:w-64 md:w-80 aspect-square mx-auto cursor-pointer animate-float">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl rotate-12 group-hover:rotate-6 transition-transform duration-500 shadow-2xl opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-2xl flex items-center justify-center border border-white/20 overflow-hidden">
                             <div className="text-8xl sm:text-9xl filter drop-shadow-2xl">🎁</div>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                             <div className="absolute bottom-6 left-0 right-0 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Limited Slots</p>
                             </div>
                        </div>
                    </div>
                    {/* Floating sparkles */}
                    <div className="absolute -top-4 -right-4 text-2xl animate-pulse delay-75">✨</div>
                    <div className="absolute bottom-0 -left-4 text-xl animate-pulse delay-300">✨</div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center md:justify-start gap-8 sm:gap-12 opacity-60">
                 <div className="text-center md:text-left">
                    <p className="text-xl sm:text-2xl font-black">1.2k+</p>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-purple-300">Bags Claimed</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xl sm:text-2xl font-black">4.9/5</p>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-purple-300">Surprise Rating</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xl sm:text-2xl font-black">100%</p>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-purple-300">Freshness Guaranteed</p>
                 </div>
            </div>
        </div>
    );
};

export default MysteryBox;
