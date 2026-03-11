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
        <div className="mt-16 mb-20">
            <div className="flex flex-col items-center mb-12 text-center">
                <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800">Our Blog</h1>
                <div className="w-16 h-1 bg-green-500 mt-2 rounded-full"></div>
                <p className="text-gray-500 mt-4 max-w-xl">
                    Insights, recipes and news from our grocery experts to help you live a healthier life.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                        <div className="relative overflow-hidden h-48">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" />
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-emerald-600 rounded-full">
                                {blog.category}
                            </span>
                        </div>
                        <div className="p-6">
                            <span className="text-gray-400 text-xs">{blog.date}</span>
                            <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-emerald-600 transition">
                                {blog.title}
                            </h2>
                            <p className="text-gray-500 text-sm line-clamp-2">
                                {blog.excerpt}
                            </p>
                            <button className="mt-4 text-emerald-600 font-semibold text-sm hover:underline">
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
