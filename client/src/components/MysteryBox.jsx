import React from 'react';

const MysteryBox = () => {
    return (
        <div className="py-12">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative border border-slate-800 shadow-2xl">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="flex-1 z-10 text-center md:text-left">
                    <div className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-emerald-500/30">
                        Limited Gamified Offer
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">THE WEEKLY <br /><span className="text-emerald-500">MYSTERY BOX</span></h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-md font-medium">
                        Get 8-10 surprise organic vegetables & fruits at <span className="text-white font-bold">40% OFF</span>. Every week is a new adventure!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                            Unlock For ₹299
                        </button>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="flex">
                                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                            </span>
                            <span className="text-xs font-bold text-slate-500">4.9/5 (2k+ box unlocked)</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 shrink-0 group">
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2.5rem] flex items-center justify-center border border-slate-700 shadow-inner overflow-hidden transform group-hover:rotate-3 transition-transform duration-500">
                        <span className="text-9xl filter drop-shadow-2xl animate-bounce">📦</span>
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {/* Question marks floating around */}
                        <span className="absolute top-10 right-10 text-4xl opacity-20 transform -rotate-12 italic font-black">?</span>
                        <span className="absolute bottom-10 left-10 text-5xl opacity-20 transform rotate-12 italic font-black">?</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MysteryBox;
