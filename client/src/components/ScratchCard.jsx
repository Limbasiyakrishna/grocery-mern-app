import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const ScratchCard = () => {
    const [scratched, setScratched] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const { axios, setUser } = useAppContext();

    const handleScratch = async () => {
        if (scratched || isRevealing) return;
        
        setIsRevealing(true);
        try {
            const { data } = await axios.post("/api/user/update-wallet", { amount: 25 });
            if (data.success) {
                setTimeout(() => {
                    setScratched(true);
                    setIsRevealing(false);
                    // Update global user state with new wallet balance
                    setUser(prev => ({ 
                        ...prev, 
                        walletBalance: data.walletBalance,
                        rewardPoints: data.rewardPoints 
                    }));
                    toast.success("🎉 ₹25 added to your wallet!");
                }, 800);
            }
        } catch (error) {
            setIsRevealing(false);
            toast.error("Failed to claim reward. Try again!");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative group">
            <div className="text-center mb-8">
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Daily Bonus</span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Scratch <span className="text-emerald-600">&</span> Win</h3>
            </div>

            <div 
                className="relative w-full max-w-[280px] aspect-square mx-auto cursor-pointer perspective-1000"
                onClick={handleScratch}
            >
                {/* The Reward (Underneath) */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-white shadow-inner">
                    <div className="text-5xl mb-2">💰</div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">Reward Revealed</p>
                    <p className="text-4xl font-black">₹25.00</p>
                    <p className="text-[10px] font-bold mt-4 bg-white/20 px-4 py-1.5 rounded-full">Added to Wallet</p>
                </div>

                {/* The Scratch Layer */}
                {!scratched && (
                    <div 
                        className={`absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center p-6 border-4 border-white dark:border-gray-600 transition-all duration-700 backface-hidden shadow-2xl z-20 ${
                            isRevealing ? 'opacity-0 scale-125 rotate-12 blur-xl' : 'opacity-100'
                        }`}
                    >
                         <div className="w-20 h-20 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
                         <p className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest">Scratch Here</p>
                         {/* Texture overlay */}
                         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>
                )}
            </div>

            <p className="text-center mt-8 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">Next card available in 24 hours</p>
        </div>
    );
};

export default ScratchCard;
