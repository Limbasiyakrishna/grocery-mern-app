import { useAppContext } from "../context/AppContext";
import ScratchCard from "../components/ScratchCard";

const Rewards = () => {
    const { user, navigate } = useAppContext();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-lg border border-gray-100 animate-in fade-in zoom-in duration-500">
                    <div className="text-6xl mb-6">🔒</div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Members Only!</h2>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">Sign in to start earning reward points on every purchase and unlock exclusive benefits.</p>
                    <button 
                        onClick={() => navigate("/")} 
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:scale-105 transition-all active:scale-95"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const points = user.rewardPoints || 0;
    const value = (points * 0.1).toFixed(2); // 1 point = ₹0.10

    return (
        <div className="min-h-screen bg-gray-50 pb-20 page-bottom-padding">
            {/* Header Section */}
            <div className="bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 uppercase leading-[0.9]">
                            FreshNest <span className="text-emerald-500">Rewards</span>
                        </h1>
                        <p className="text-sm md:text-xl text-gray-400 font-bold max-w-xl">
                            Earn points for every ₹ spent and transform them into real savings on your next order.
                        </p>
                    </div>
                    
                    {/* Points Card */}
                    <div className="bg-emerald-600 p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-emerald-900/50 min-w-[280px] md:min-w-[340px] text-center border-4 border-emerald-400/30 group hover:scale-[1.02] transition-all duration-300">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-2">Available Balance</p>
                        <div className="text-5xl md:text-7xl font-black mb-2 flex items-center justify-center gap-2">
                             <span className="tabular-nums">{points}</span>
                             <span className="text-2xl md:text-3xl text-emerald-200 animate-pulse">★</span>
                        </div>
                        <div className="h-px bg-emerald-400/30 w-1/2 mx-auto my-4"></div>
                        <p className="text-sm md:text-base font-bold text-emerald-100 opacity-80 uppercase tracking-widest">Est. Value: ₹{value}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Benefit 1 */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-500 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">🛍️</div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Shop & Earn</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Get 1 point for every ₹100 spent. Your points are automatically added after every successful order.</p>
                    </div>
                    
                    {/* Benefit 2 */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-500 group">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">🔥</div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Instant Redeem</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Use your points directly at the checkout. 10 points = ₹1 of discount. No complicated rules!</p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-500 group">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">🎁</div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Elite Perks</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Higher balances unlock lower delivery fees, birthday surprises, and early access to fresh seasonal products.</p>
                    </div>

                    {/* Benefit 4 - Viral Growth */}
                    <div className="bg-emerald-50 p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-100 hover:-translate-y-2 transition-all duration-500 group cursor-pointer" onClick={() => navigate("/refer-earn")}>
                        <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 shadow-sm transition-all duration-300">🤝</div>
                        <h3 className="text-xl font-black text-emerald-900 mb-3 uppercase tracking-tight">Refer & Earn</h3>
                        <p className="text-emerald-700/60 text-sm font-medium leading-relaxed">Invite your friends to FreshNest and get ₹100 directly in your wallet for every successful referral.</p>
                    </div>
                </div>

                {/* Milestone Section */}
                <div className="mt-16 bg-white rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 shadow-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
                    
                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Growth <span className="text-emerald-600">Track</span></h2>
                        <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-6 max-w-4xl mx-auto relative z-10">
                        <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-emerald-100">1</div>
                            <div className="flex-1">
                                <h4 className="font-black text-gray-900 uppercase text-sm md:text-base">Bronze Member</h4>
                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Base Entry Level</p>
                            </div>
                            <div className="text-emerald-600 font-black text-[10px] md:text-xs uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">Active</div>
                        </div>

                        <div className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all ${points >= 500 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-dashed border-gray-200 opacity-60'}`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black flex-shrink-0 ${points >= 500 ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-gray-100 text-gray-400'}`}>2</div>
                            <div className="flex-1">
                                <h4 className={`font-black uppercase text-sm md:text-base ${points >= 500 ? 'text-amber-900' : 'text-gray-500'}`}>Silver Star</h4>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${points >= 500 ? 'text-amber-600/70' : 'text-gray-400'}`}>Unlock 5% extra discount on Fruit baskets</p>
                            </div>
                            <div className={`font-black text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 rounded-full ${points >= 500 ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-300'}`}>
                                {points >= 500 ? 'UNLOCKED' : '500 PTS'}
                            </div>
                        </div>

                        <div className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all ${points >= 1000 ? 'bg-yellow-50/50 border-yellow-200 border-solid' : 'bg-white border-dashed border-gray-200 opacity-60'}`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black flex-shrink-0 ${points >= 1000 ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-100' : 'bg-gray-100 text-gray-400'}`}>3</div>
                            <div className="flex-1">
                                <h4 className={`font-black uppercase text-sm md:text-base ${points >= 1000 ? 'text-yellow-900' : 'text-gray-500'}`}>Gold Premium</h4>
                                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${points >= 1000 ? 'text-yellow-600/70' : 'text-gray-400'}`}>Free Priority Delivery on all orders</p>
                            </div>
                            <div className={`font-black text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 rounded-full ${points >= 1000 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-300'}`}>
                                {points >= 1000 ? 'UNLOCKED' : '1000 PTS'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamified Rewards Section */}
                <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="order-2 lg:order-1">
                        <ScratchCard />
                    </div>
                    <div className="order-1 lg:order-2 px-4 text-center lg:text-left">
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Play & Earn</span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-[0.95]">
                            Win Daily <br/>
                            <span className="text-emerald-600">Wallet Credits</span>
                        </h2>
                        <p className="text-gray-500 font-medium text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                            Feeling lucky? Every 24 hours, you get a free scratch card. Reveal instant credits that go directly into your Freshnest Wallet.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-gray-900">₹1,000+</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Won today</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-gray-900">100%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free to play</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                        <button onClick={() => navigate("/products")} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95">
                            Keep Shopping ✨
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
