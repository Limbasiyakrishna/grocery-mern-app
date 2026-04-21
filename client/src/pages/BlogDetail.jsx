import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const BlogDetail = () => {
    const { id } = useParams();
    const { axios, addToCart, products } = useAppContext();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/blog/${id}`);
                if (data.success) {
                    setBlog(data.blog);
                }
            } catch (error) {
                console.error("Error fetching blog detail", error);
                toast.error("Failed to load article");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Article not found</h2>
            <Link to="/blog" className="text-emerald-600 font-bold hover:underline">Back to Blogs</Link>
        </div>
    );

    return (
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-20 sm:mb-24 md:mb-28 max-w-5xl mx-auto px-3 sm:px-4 md:px-6">
            <Link to={`/blog${blog.category === 'Cooking Tips' ? '/cooking-tips' : blog.category === 'Health & Wellness' ? '/health' : ''}`} className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:-translate-x-2 transition-transform">
                <span>←</span> Back to {blog.category}
            </Link>

            <header className="mb-12">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
                    {blog.category}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                    {blog.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                    <span>{new Date(blog.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                    <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
            </header>

            <div className="rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 relative">
                <img src={blog.image} alt={blog.title} className="w-full aspect-[16/9] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="text-lg sm:text-xl font-bold text-gray-600 italic border-l-4 border-emerald-500 pl-6 py-2 leading-relaxed">
                        {blog.excerpt}
                    </div>
                    <div className="prose prose-emerald prose-lg max-w-none text-gray-700 font-medium leading-loose whitespace-pre-line">
                        {blog.content}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        {/* Ingredients Card - Specific for Cooking Tips */}
                        {blog.category === "Cooking Tips" && blog.ingredients && blog.ingredients.length > 0 && (
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-800">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-emerald-400">🥗</span> Ingredients
                                </h3>
                                <div className="space-y-3 mb-8">
                                    {blog.ingredients.map((ing, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm font-medium text-slate-300">{ing}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAddAll(blog.ingredients)}
                                    className="w-full bg-emerald-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
                                >
                                    Add All To Cart
                                </button>
                            </div>
                        )}

                        {/* Health Tips Card - Specific for Health */}
                        {blog.category === "Health & Wellness" && (
                            <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                    <span className="text-emerald-600">🌿</span> Wellness Tip
                                </h3>
                                <p className="text-emerald-800/80 font-medium text-sm leading-relaxed mb-6">
                                    Organic vegetables are rich in antioxidants. Incorporating these into your daily diet can improve immunity and energy levels.
                                </p>
                                <Link to="/products" className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">Shop Organic →</Link>
                            </div>
                        )}

                        {/* Share Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Share Article</h3>
                            <div className="flex gap-4">
                                {['Facebook', 'Twitter', 'WhatsApp'].map(platform => (
                                    <button key={platform} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                        {platform[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
