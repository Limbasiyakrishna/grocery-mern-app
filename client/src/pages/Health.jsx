const Health = () => {
    const blogs = [
        {
            id: 3,
            title: "Benefits of Leafy Greens",
            category: "Health & Wellness",
            date: "Jan 12th, 2026",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
            excerpt: "Spinach, Kale and Chard. The powerhouses of nutrition that you MUST add to your diet."
        },
        {
            id: 6,
            title: "How Water Impacts Your Metabolism",
            category: "Health & Wellness",
            date: "Dec 30th, 2025",
            image: "https://images.unsplash.com/photo-1548919973-5cfe5d4fc99a?auto=format&fit=crop&q=80&w=800",
            excerpt: "Staying hydrated is more than just quenching thirst. It's the engine for your body's energy."
        },
        {
            id: 7,
            title: "The Truth About Superfoods",
            category: "Health & Wellness",
            date: "Nov 5th, 2025",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
            excerpt: "Are acai berries and matcha really miracle cures? Let's separate hype from science."
        }
    ];

    return (
        <div className="mt-16 mb-20">
            <div className="flex flex-col items-center mb-12 text-center">
                <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 tracking-tight">Health & Wellness</h1>
                <div className="w-16 h-1 bg-teal-500 mt-2 rounded-full"></div>
                <p className="text-gray-500 mt-4 max-w-xl italic">
                    "Your body is a temple, keep it healthy with our organic produce."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                        <div className="relative overflow-hidden h-48">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="p-6">
                            <span className="text-emerald-500 font-medium text-xs uppercase tracking-wide">{blog.category}</span>
                            <span className="text-gray-400 text-xs ml-3 border-l pl-3">{blog.date}</span>
                            <h2 className="text-xl font-bold text-gray-800 mt-3 mb-3 hover:text-teal-600 cursor-pointer">
                                {blog.title}
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {blog.excerpt}
                            </p>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs text-gray-400">5 min read</span>
                                <button className="text-teal-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    Detail View <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Health;
