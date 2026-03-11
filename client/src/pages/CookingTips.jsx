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
        <div className="mt-16 mb-24 lg:mb-20">
            <div className="flex flex-col items-center mb-12 text-center">
                <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Smart Shopping AI
                </div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-800 tracking-tight">COOKING INSIGHTS</h1>
                <p className="text-slate-500 mt-4 max-w-xl font-medium">
                    Shop smarter by adding all recipe ingredients with a single click.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group flex flex-col h-full">
                        <div className="relative overflow-hidden h-56">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-700">
                                {blog.date}
                            </div>
                        </div>
                        <div className="p-7 flex flex-col flex-1">
                            <h2 className="text-xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition leading-tight">
                                {blog.title}
                            </h2>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
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
