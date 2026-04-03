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
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-20 sm:mb-24 md:mb-28 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 tracking-tight">Health & Wellness</h1>
                <div className="w-12 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-teal-500 mt-3 sm:mt-4 rounded-full"></div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mt-4 sm:mt-6 max-w-2xl italic">
                    "Your body is a temple, keep it healthy with our organic produce."
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col h-full">
                        <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                            <span className="text-emerald-500 font-medium text-[8px] sm:text-xs md:text-xs uppercase tracking-wide">{blog.category}</span>
                            <span className="text-gray-400 text-[8px] sm:text-xs md:text-xs ml-2 sm:ml-3 border-l pl-2 sm:pl-3">{blog.date}</span>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-2 sm:mt-2.5 md:mt-3 mb-2 sm:mb-2.5 md:mb-3 hover:text-teal-600 cursor-pointer line-clamp-2">
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-sm leading-relaxed mb-4 sm:mb-6">
                                {blog.excerpt}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-[8px] sm:text-xs md:text-xs text-gray-400">5 min read</span>
                                <button className="text-teal-600 font-bold text-xs sm:text-sm flex items-center gap-1 hover:gap-2 transition-all">
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
