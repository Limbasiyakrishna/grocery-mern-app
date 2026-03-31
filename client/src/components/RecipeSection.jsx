import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { getImgSrc } from '../utils/imgResolver';

const recipes = [
    {
        id: 'r1',
        title: 'Summer Fruit Salad',
        description: 'A refreshing mix of seasonal organic fruits.',
        image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=800&auto=format&fit=crop',
        ingredientNames: ['Apple', 'Banana', 'Mango', 'Grapes'],
        prepTime: '10 min',
        calories: '150 kcal',
        serves: '2 People'
    },
    {
        id: 'r2',
        title: 'Healthy Palak Paneer',
        description: 'Protein-rich spinach and fresh paneer curry.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
        ingredientNames: ['Paneer', 'Tomato', 'Onion', 'Spinach'],
        prepTime: '25 min',
        calories: '320 kcal',
        serves: '3 People'
    }
];

const RecipeSection = () => {
    const { addToCart, products } = useAppContext();
    const [activeRecipe, setActiveRecipe] = useState(null);

    const handleBuyAll = (ingredientNames) => {
        let addedCount = 0;
        ingredientNames.forEach(name => {
            const product = products.find(p => p.name === name);
            if (product) {
                addToCart(product._id);
                addedCount++;
            }
        });
        if (addedCount > 0) {
            toast.success(`🛒 ${addedCount} ingredients added to basket!`);
        } else {
            toast.error("Ingredients not found in store.");
        }
    };

    return (
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-28 py-8 sm:py-10 md:py-12 lg:py-14 relative">
             <div className="flex flex-col items-center text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                <span className="text-emerald-600 font-black text-[8px] sm:text-[9px] md:text-xs lg:text-sm uppercase tracking-[0.3em] mb-2 sm:mb-3">Meal Planning Made Easy</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-slate-900 tracking-tighter">
                    Shop by <span className="text-emerald-600">Recipes</span>
                </h2>
                <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-emerald-600 rounded-full mt-3 sm:mt-4"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-3 sm:px-4 md:px-6">
                {recipes.map((recipe) => (
                    <div 
                        key={recipe.id}
                        className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col sm:flex-row animate-reveal"
                    >
                        {/* Recipe Image (Left Side) */}
                        <div className="w-full sm:w-1/3 lg:w-2/5 h-48 sm:h-56 md:h-64 lg:h-auto overflow-hidden relative bg-slate-100 shrink-0">
                            <img 
                                src={recipe.image} 
                                alt={recipe.title}
                                className="w-full h-full object-cover text-transparent transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Glass Accent Tag */}
                            <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] md:text-xs font-black text-emerald-700 uppercase tracking-widest shadow-sm border border-white/50">
                                Fresh Pick
                            </div>
                        </div> 
 
                        {/* Recipe Content (Right Side) */}
                        <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2 sm:mb-3 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors break-words">
                                    {recipe.title}
                                </h3>
                                
                                <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium mb-4 sm:mb-6 leading-relaxed line-clamp-2">
                                    {recipe.description}
                                </p>

                                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <div className="flex flex-col justify-center items-center px-2.5 sm:px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 grow sm:grow-0">
                                         <span className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5 sm:mb-1">Time</span>
                                         <span className="text-[8px] sm:text-xs md:text-sm font-black text-slate-700">{recipe.prepTime}</span>
                                    </div>
                                    <div className="flex flex-col justify-center items-center px-2.5 sm:px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 grow sm:grow-0">
                                         <span className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5 sm:mb-1">Cals</span>
                                         <span className="text-[8px] sm:text-xs md:text-sm font-black text-slate-700">{recipe.calories}</span>
                                    </div>
                                    <div className="flex flex-col justify-center items-center px-2.5 sm:px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 grow sm:grow-0">
                                         <span className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5 sm:mb-1">Serves</span>
                                         <span className="text-[8px] sm:text-xs md:text-sm font-black text-slate-700">{recipe.serves}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-50 mt-auto">
                                <button 
                                    onClick={() => handleBuyAll(recipe.ingredientNames)}
                                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-[1.25rem] font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn grow sm:grow-0"
                                >
                                    Get Ingredients
                                    <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                                
                                {/* Micro Ingredients Display */}
                                <div className="flex items-center shrink-0 -space-x-2 bg-white px-1">
                                    {recipe.ingredientNames.slice(0, 3).map((name, i) => {
                                        const prod = products.find(p => p.name === name);
                                        return prod ? (
                                            <div key={i} className="relative z-10 w-7 sm:w-8 md:w-9 h-7 sm:h-8 md:h-9 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:-translate-y-1 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                                <img src={getImgSrc(prod.image?.[0])} className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 object-contain drop-shadow-sm" />
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeSection;
