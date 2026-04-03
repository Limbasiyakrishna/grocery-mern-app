const Blog = () => {
    const blogs = [
        {
            id: 1,
            title: "5 Tips for Fresh Groceries",
            category: "Latest News",
            date: "March 1st, 2026",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
            excerpt: "Keeping your vegetables and fruits fresh for longer is an art. Here's a quick guide."
        },
        {
            id: 2,
            title: "How to Cook the Perfect Pasta",
            category: "Cooking Tips",
            date: "Feb 23rd, 2026",
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
            excerpt: "Pasta should be al dente, but what does that really mean? Let's dive into Italian cooking."
        },
        {
            id: 3,
            title: "Benefits of Leafy Greens",
            category: "Health & Wellness",
            date: "Jan 12th, 2026",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
            excerpt: "Spinach, Kale and Chard. The powerhouses of nutrition that you MUST add to your diet."
        }
    ];

    return (
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-20 sm:mb-24 md:mb-28 px-3 sm:px-4 md:px-6">
            <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 tracking-tight">Our Blog</h1>
                <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-emerald-600 mt-3 sm:mt-4 rounded-full"></div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mt-4 sm:mt-6 max-w-2xl">
                    Insights, recipes and news from our grocery experts to help you live a healthier life.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col h-full">
                        <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" />
                            <span className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[8px] sm:text-xs md:text-xs font-semibold text-emerald-600 rounded-full">
                                {blog.category}
                            </span>
                        </div>
                        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                            <span className="text-gray-400 text-[8px] sm:text-xs md:text-xs">{blog.date}</span>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-2 sm:mt-2.5 md:mt-3 mb-2 sm:mb-2.5 md:mb-3 group-hover:text-emerald-600 transition line-clamp-2">
                                {blog.title}
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm md:text-sm line-clamp-2 mb-4 sm:mb-6">
                                {blog.excerpt}
                            </p>
                            <button className="mt-auto text-emerald-600 font-semibold text-xs sm:text-sm hover:underline">
                                Read More →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
