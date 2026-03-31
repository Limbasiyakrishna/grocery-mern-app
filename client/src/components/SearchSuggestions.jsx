import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/assets';
import { getImgSrc } from '../utils/imgResolver';

const SearchSuggestions = ({ query, isVisible, onClose }) => {
    const navigate = useNavigate();

    if (!isVisible || !query) return null;

    const filteredCategories = categories.filter(c => 
        c.text.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    return (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border border-emerald-100/60 shadow-2xl rounded-xl sm:rounded-2xl mt-2 sm:mt-3 p-4 sm:p-5 md:p-6 z-[100] animate-scale-up max-h-[60vh] overflow-y-auto">
            <div className="mb-4 sm:mb-6">
                <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 sm:mb-4 px-2">Matching Categories</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {filteredCategories.map((cat, i) => (
                        <div 
                            key={i}
                            onClick={() => {
                                navigate(`/products/${cat.path.toLowerCase()}`);
                                onClose();
                            }}
                            className="flex flex-col items-center gap-2 sm:gap-2.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/50 transition-all cursor-pointer group"
                        >
                            <img src={getImgSrc(cat.image)} className="w-8 sm:w-10 h-8 sm:h-10 object-contain group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] sm:text-[9px] md:text-xs font-black text-gray-700 text-center line-clamp-2">{cat.text}</span>
                        </div>
                    ))}
                    {filteredCategories.length === 0 && (
                        <p className="col-span-2 sm:col-span-3 text-[9px] sm:text-xs text-gray-400 italic px-2 text-center">No matching categories</p>
                    )}
                </div>
            </div>

            <div>
                <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 px-2">Quick Actions</h4>
                <div className="space-y-0.5 sm:space-y-1">
                    <div 
                        onClick={() => { navigate('/best-sellers'); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                         <span className="text-lg">🔥</span>
                         <div>
                            <p className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">Best Sellers</p>
                            <p className="text-[10px] text-gray-400 font-bold">Most popular right now</p>
                         </div>
                    </div>
                    <div 
                        onClick={() => { navigate('/new-arrivals'); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                         <span className="text-lg">🆕</span>
                         <div>
                            <p className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">New Arrivals</p>
                            <p className="text-[10px] text-gray-400 font-bold">Fresh from the farm</p>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-emerald-50 text-center">
                 <button 
                    onClick={() => { navigate('/products'); onClose(); }}
                    className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                 >
                    View All Groceries
                 </button>
            </div>
        </div>
    );
};

export default SearchSuggestions;
