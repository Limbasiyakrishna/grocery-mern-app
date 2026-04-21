import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const AddBlog = () => {
  const { axios, navigate } = useAppContext();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    category: "Latest News",
    image: "",
    excerpt: "",
    content: "",
    ingredients: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) {
        const blog = data.blog;
        setFormData({
          title: blog.title,
          category: blog.category,
          image: blog.image,
          excerpt: blog.excerpt,
          content: blog.content,
          ingredients: blog.ingredients ? blog.ingredients.join(", ") : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch blog", error);
      toast.error("Error loading blog data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.split(",").map(i => i.trim()).filter(i => i),
      };

      let response;
      if (isEdit) {
        response = await axios.put(`/api/blog/update/${id}`, payload);
      } else {
        response = await axios.post("/api/blog/add", payload);
      }

      if (response.data.success) {
        toast.success(isEdit ? "Blog updated successfully" : "Blog added successfully");
        navigate("/seller/blogs");
      }
    } catch (error) {
      console.error("Error saving blog", error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {isEdit ? "Edit Content" : "Create New Content"}
        </h1>
        <p className="text-gray-500 font-medium">
          Add blogs, cooking tips, or health wellness articles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. 5 Secret Cooking Tips"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold appearance-none"
            >
              <option value="Latest News">Latest News (Blog)</option>
              <option value="Cooking Tips">Cooking Tips</option>
              <option value="Health & Wellness">Health & Wellness</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://images.unsplash.com/..."
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Excerpt (Short Description)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="2"
            placeholder="Brief summary for list view..."
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Main Content (Full Article)</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Write your full article here..."
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold resize-none"
          />
        </div>

        {/* Ingredients (Only for Cooking Tips) */}
        {formData.category === "Cooking Tips" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">Ingredients (Comma separated)</label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g. Pasta, Garlic, Olive Oil"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold"
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">These will be searchable for the "Add all to cart" feature.</p>
          </div>
        )}

        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/seller/blogs")}
            className="px-8 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
