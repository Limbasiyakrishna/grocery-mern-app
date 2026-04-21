import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Blog = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get("/api/blog/all");
                if (data.success) {
                    // Filter for "Latest News" or just show all if preferred. 
                    // User said "new blogs can be add from admin page", let's show all latest ones here.
                    setBlogs(data.blogs);
                }
            } catch (error) {
                console.error("Error fetching blogs", error);
                toast.error("Failed to load blogs");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

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
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-gray-100" />
                    ))
                ) : blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog._id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col h-full">
                            <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <span className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[8px] sm:text-xs md:text-xs font-semibold text-emerald-600 rounded-full">
                                    {blog.category}
                                </span>
                            </div>
                            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                                <span className="text-gray-400 text-[8px] sm:text-xs md:text-xs">
                                    {new Date(blog.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-2 sm:mt-2.5 md:mt-3 mb-2 sm:mb-2.5 md:mb-3 group-hover:text-emerald-600 transition line-clamp-2">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-500 text-xs sm:text-sm md:text-sm line-clamp-2 mb-4 sm:mb-6">
                                    {blog.excerpt}
                                </p>
                                <button 
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                    className="mt-auto text-emerald-600 font-semibold text-xs sm:text-sm hover:underline flex items-center gap-1"
                                >
                                    Read More <span>→</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-400 font-medium">No blogs published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
