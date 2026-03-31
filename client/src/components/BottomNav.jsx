import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const BottomNav = () => {
    const { cartCount, setShowUserLogin, user, navigate } = useAppContext();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-3 py-3 flex justify-between items-center z-[55] shadow-[0_-4px_12px_-1px_rgba(16,185,129,0.1)] safe-area-inset-bottom">
            <NavLink
                to="/"
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-colors rounded-lg px-2 py-2 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-semibold">Home</span>
            </NavLink>

            <NavLink
                to="/products"
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-colors rounded-lg px-2 py-2 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-semibold">Search</span>
            </NavLink>

            <NavLink
                to="/cart"
                className={({ isActive }) => `flex flex-col items-center gap-0.5 relative transition-colors rounded-lg px-2 py-2 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {cartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[8px] sm:text-[9px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                            {cartCount()}
                        </span>
                    )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold">Cart</span>
            </NavLink>

            <NavLink
                to="/rewards"
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-colors rounded-lg px-2 py-2 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25m18 0l-9-5.25L3 11.25m18 0V4.5A1.5 1.5 0 0 0 19.5 3H4.5A1.5 1.5 0 0 0 3 4.5v6.75m18 0l-9 5.25-9-5.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-semibold">Rewards</span>
            </NavLink>

            <div
                onClick={() => !user ? setShowUserLogin(true) : navigate("/my-orders")}
                className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer rounded-lg px-2 py-2 transition-colors hover:text-emerald-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-semibold">{user ? 'Profile' : 'Login'}</span>
            </div>
        </div>
    );
};

export default BottomNav;
