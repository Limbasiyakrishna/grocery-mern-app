import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CookingTips = () => {
    const { addToCart, products } = useAppContext();

    const blogs = [
        {
            id: 2,
            title: "How to Cook the Perfect Pasta",
            category: "Cooking Tips",
            date: "Feb 23rd, 2026",
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
            excerpt: "Pasta should be al dente, but what does that really mean? Let's dive into Italian cooking.",
            ingredients: ["Pasta", "Tomato Sauce", "Olive Oil", "Garlic"]
        },
        {
            id: 4,
            title: "Fresh Fruit Salad Guide",
            category: "Cooking Tips",
            date: "Jan 18th, 2026",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
            excerpt: "Spices can change a dish completely. Here's a quick reference on how to use them.",
            ingredients: ["Apple", "Banana", "Grapes", "Orange"]
        },
        {
            id: 5,
            title: "Quick 10 Minute Salads",
            category: "Cooking Tips",
            date: "Jan 5th, 2026",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
            excerpt: "Quick and healthy salads that you can make in under 10 minutes with minimum ingredients.",
            ingredients: ["Tomato", "Cucumber", "Onion"]
        }
    ];

    const handleAddAll = (ingredients) => {
        let count = 0;
        ingredients.forEach(ing => {
            const product = products.find(p => p.name.toLowerCase().includes(ing.toLowerCase()));
            if (product) {
                addToCart(product._id);
                count++;
            }
        });
        if (count > 0) {
            toast.success(`Smart AI: Added ${count} ingredients to your cart!`);
        } else {
            toast.error("Smart AI: Sorry, ingredients currently out of stock.");
        }
    };

    return (
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-20 sm:mb-24 md:mb-28 lg:mb-24 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
                <div className="bg-emerald-100 text-emerald-700 px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4 md:mb-6">
                    Smart Shopping AI
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-slate-800 tracking-tight">COOKING INSIGHTS</h1>
                <p className="text-slate-500 mt-4 sm:mt-6 max-w-xl font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                    Shop smarter by adding all recipe ingredients with a single click.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group flex flex-col h-full">
                        <div className="relative overflow-hidden h-44 sm:h-52 md:h-56 lg:h-64">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-md px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-xs md:text-xs font-bold text-slate-700">
                                {blog.date}
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 md:p-7 flex flex-col flex-1">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 mb-2 sm:mb-2.5 md:mb-3 group-hover:text-emerald-600 transition leading-tight line-clamp-2">
                                {blog.title}
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm md:text-sm line-clamp-2 mb-4 sm:mb-6 font-medium">
                                {blog.excerpt}
                            </p>

                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Shop Ingredients</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {blog.ingredients.map((ing, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAddAll(blog.ingredients)}
                                    className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                                >
                                    Add All To Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CookingTips;
