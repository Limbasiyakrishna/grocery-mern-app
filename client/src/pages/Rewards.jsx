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
        <div className="py-8 max-w-4xl mx-auto pb-24 md:pb-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl mb-10 overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">My Rewards</h1>
                    <p className="opacity-90 mb-6">Earn points on every purchase and unlock exclusive discounts!</p>

                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-black">240</span>
                        <span className="text-xl font-medium mb-1 opacity-80 text-emerald-100 uppercase tracking-wider">Points</span>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute right-10 top-5 w-24 h-24 bg-teal-400/20 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">🎁</span>
                        Available Coupons
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/30 flex justify-between items-center group hover:border-emerald-300 transition-colors cursor-pointer">
                            <div>
                                <p className="font-bold text-emerald-700">FRESH20</p>
                                <p className="text-xs text-slate-500">20% OFF on next order</p>
                            </div>
                            <button className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Apply</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">📈</span>
                        Current Streak
                    </h2>
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day <= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {day <= 3 ? '✓' : day}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">Day {day}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        🔥 You're on a <span className="font-bold text-emerald-600">3 day streak</span>! Shop for 2 more days to earn a bonus mystery box.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Missions & Milestones</h2>
            <div className="space-y-4">
                {milestones.map((m) => (
                    <div key={m.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${m.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 opacity-60'}`}>
                            {m.completed ? '🏆' : '🔒'}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold ${m.completed ? 'text-slate-800' : 'text-slate-500'}`}>{m.title}</h3>
                            <p className="text-sm text-slate-500">{m.desc}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-black ${m.completed ? 'text-emerald-600' : 'text-slate-400'}`}>+{m.points}</span>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Points</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
