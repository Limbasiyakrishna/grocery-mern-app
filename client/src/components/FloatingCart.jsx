import React from 'react';
import { useAppContext } from '../context/AppContext';

const FloatingCart = () => {
    const { cartCount, navigate, totalCartAmount } = useAppContext();

    if (cartCount() === 0) return null;

    return (
        <div 
            onClick={() => navigate('/cart')}
            className="md:hidden fixed bottom-16 sm:bottom-20 left-3 sm:left-4 right-3 sm:right-4 bg-emerald-600 text-white p-3 sm:p-4 rounded-2xl flex items-center justify-between shadow-2xl z-[55] animate-bubble-up cursor-pointer border border-white/20"
        >
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 sm:w-5 h-4 sm:h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none mb-0.5 sm:mb-1">{cartCount()} ITEM{cartCount() > 1 ? 'S' : ''}</p>
                    <p className="text-xs sm:text-sm font-black">₹{totalCartAmount()}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 bg-emerald-700/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm">
                View Cart
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 sm:w-4 h-3 sm:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    );
};

export default FloatingCart;
