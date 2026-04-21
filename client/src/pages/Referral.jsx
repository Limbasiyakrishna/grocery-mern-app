import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Referral = () => {
    const { user } = useContext(AppContext);
    
    const referralCode = user?._id ? `FRESH-${user._id.slice(-6).toUpperCase()}` : "LOGIN-REQUIRED";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        toast.success("📋 Referral code copied! Share it with friends.");
    };

    return (
        <div className="mt-8 sm:mt-12 md:mt-16 pb-16 sm:pb-24 max-w-5xl mx-auto px-4 page-bottom-padding">
            <div className="flex flex-col items-center text-center mb-12">
                <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-3">Community Growth</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6">
                    Refer a Friend, <br/>
                    <span className="text-emerald-600">Earn ₹100</span>
                </h1>
                <p className="text-gray-400 font-bold text-sm max-w-xl mx-auto">
                    Help your friends eat better. When they sign up using your code, you both get ₹100 directly into your Freshnest Wallet.
                </p>
                <div className="w-20 h-1.5 bg-emerald-600 rounded-full mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -z-0"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Your Code</h2>
                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                            <div className="flex-1 bg-gray-50 border-2 border-dashed border-emerald-200 rounded-2xl p-6 flex items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-700 tracking-wider">
                                    {referralCode}
                                </span>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                Copy
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </button>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">Code can be used once per referral</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "Invite Friends", desc: "Share your unique code via WhatsApp or Email.", icon: "📲" },
                        { title: "They Sign Up", desc: "Your friend joins Freshnest and makes their first order.", icon: "🥗" },
                        { title: "Get Rewarded", desc: " ₹100 is credited to your wallet instantly.", icon: "💰" }
                    ].map((step, i) => (
                        <div key={i} className="flex gap-6 items-start group">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all shrink-0">
                                {step.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{step.title}</h3>
                                <p className="text-sm font-medium text-gray-400">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Wallet Integration Section (Mock) */}
            <div className="mt-16 sm:mt-24 bg-slate-900 rounded-[3rem] p-8 sm:p-16 text-white relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-4">Total Referral Earnings</h2>
                        <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-2">Track your impact</p>
                        <div className="text-5xl sm:text-7xl font-black text-emerald-500 tracking-tighter">₹400</div>
                    </div>
                    <div className="flex-1 w-full max-w-sm bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
                        <div className="space-y-4">
                            {[
                                { name: "Rajesh K.", status: "Earned ₹100", date: "Oct 12" },
                                { name: "Ananya S.", status: "Earned ₹100", date: "Oct 10" },
                                { name: "Suresh P.", status: "Processing", date: "Oct 15" }
                            ].map((log, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span>
                                        <p className="font-black">{log.name}</p>
                                        <p className="text-emerald-400 font-bold">{log.status}</p>
                                    </span>
                                    <span className="opacity-40">{log.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referral;
