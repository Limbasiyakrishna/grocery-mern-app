import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ManageBlogs = () => {
  const { axios, navigate } = useAppContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      toast.error("Error loading articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const { data } = await axios.delete(`/api/blog/delete/${id}`);
      if (data.success) {
        toast.success("Article deleted successfully");
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error("Error deleting blog", error);
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Content Management</h1>
          <p className="text-gray-500 font-medium">Manage your blogs, cooking tips, and health articles.</p>
        </div>
        <Link
          to="/seller/add-blog"
          className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-gray-100" />
           ))
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="relative h-40 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {blog.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{blog.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium">{blog.excerpt}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/seller/edit-blog/${blog._id}`)}
                    className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="px-4 bg-red-50 text-red-600 py-2.5 rounded-xl text-xs hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900">No Content Yet</h3>
            <p className="text-gray-500 mt-2">Start by creating your first article or blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
