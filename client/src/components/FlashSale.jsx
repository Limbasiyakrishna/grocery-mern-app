import React, { useState, useEffect } from 'react';

const FlashSale = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 py-3 sm:py-4 px-4 overflow-hidden relative group">
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl animate-bounce">⚡</span>
                    <h2 className="text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-[0.2em]">Flash Sale Ending In:</h2>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    {[
                        { val: timeLeft.hours, label: 'Hrs' },
                        { val: timeLeft.minutes, label: 'Min' },
                        { val: timeLeft.seconds, label: 'Sec' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                            <div className="bg-white/10 backdrop-blur-md text-white w-10 sm:w-14 h-10 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl border border-white/20 shadow-lg">
                                <span className="text-lg sm:text-2xl font-black tabular-nums">
                                    {String(item.val).padStart(2, '0')}
                                </span>
                            </div>
                            {i < 2 && <span className="text-white font-black text-xl">:</span>}
                        </div>
                    ))}
                </div>

                <button className="bg-white text-red-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                    Shop Deals
                </button>
            </div>
        </div>
    );
};

export default FlashSale;
