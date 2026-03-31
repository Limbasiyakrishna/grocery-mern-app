import React from 'react';
import { useAppContext } from '../context/AppContext';

const Rewards = () => {
    const { user } = useAppContext();

    const milestones = [
        { id: 1, title: 'First Order', desc: 'Place your first order to get 50 points', points: 50, completed: true },
        { id: 2, title: 'Weekly Warrior', desc: 'Order 3 times in a week', points: 100, completed: false },
        { id: 3, title: 'Fresh Fanatic', desc: 'Buy 10kg of fresh vegetables', points: 200, completed: false },
        { id: 4, title: 'Profile Pro', desc: 'Complete your profile details', points: 30, completed: !!user },
    ];

    return (
        <div className="py-6 sm:py-8 md:py-12 max-w-4xl mx-auto pb-20 sm:pb-24 md:pb-32 lg:pb-24 px-3 sm:px-4 md:px-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-xl mb-8 sm:mb-12 md:mb-16 overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3">My Rewards</h1>
                    <p className="opacity-90 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base lg:text-lg">Earn points on every purchase and unlock exclusive discounts!</p>

                    <div className="flex items-end gap-2 sm:gap-3">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">240</span>
                        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-0.5 sm:mb-1 md:mb-2 opacity-80 text-emerald-100 uppercase tracking-wider">Points</span>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute right-10 top-5 w-24 h-24 bg-teal-400/20 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
                <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-100">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3">
                        <span className="w-7 sm:w-8 h-7 sm:h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg sm:text-xl">🎁</span>
                        Available Coupons
                    </h2>
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                        <div className="p-3 sm:p-4 md:p-5 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/30 flex justify-between items-center group hover:border-emerald-300 transition-colors cursor-pointer">
                            <div>
                                <p className="font-bold text-emerald-700 text-sm sm:text-base">FRESH20</p>
                                <p className="text-[8px] sm:text-xs text-slate-500">20% OFF on next order</p>
                            </div>
                            <button className="text-[8px] sm:text-xs font-bold bg-emerald-600 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">Apply</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-100">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3">
                        <span className="w-7 sm:w-8 h-7 sm:h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-lg sm:text-xl">📈</span>
                        Current Streak
                    </h2>
                    <div className="flex justify-between mb-3 sm:mb-4 md:mb-6">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <div key={day} className="flex flex-col items-center gap-0.5 sm:gap-1">
                                <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-[9px] sm:text-xs font-bold ${day <= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {day <= 3 ? '✓' : day}
                                </div>
                                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-medium">Day {day}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 bg-slate-50 p-2 sm:p-3 md:p-4 rounded-lg">
                        🔥 You're on a <span className="font-bold text-emerald-600">3 day streak</span>! Shop for 2 more days to earn a bonus mystery box.
                    </p>
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-4 sm:mb-6 md:mb-8">Missions & Milestones</h2>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {milestones.map((m) => (
                    <div key={m.id} className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3 md:gap-4 group hover:shadow-md transition-shadow">
                        <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 ${m.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 opacity-60'}`}>
                            {m.completed ? '🏆' : '🔒'}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold text-sm sm:text-base ${m.completed ? 'text-slate-800' : 'text-slate-500'}`}>{m.title}</h3>
                            <p className="text-[8px] sm:text-xs md:text-sm text-slate-500">{m.desc}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs sm:text-sm font-black ${m.completed ? 'text-emerald-600' : 'text-slate-400'}`}>+{m.points}</span>
                            <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase font-bold text-slate-400 tracking-tighter">Points</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
