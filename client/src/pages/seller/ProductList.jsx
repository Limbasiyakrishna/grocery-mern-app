import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { getImgSrc } from "../../utils/imgResolver";
import { useState } from "react";

const ProductList = () => {
  const { products, fetchProducts, axios } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [updating, setUpdating] = useState(null);

  const toggleStock = async (id, inStock) => {
    setUpdating(id);
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        await fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inStockCount = products.filter((p) => p.inStock).length;
  const outStockCount = products.length - inStockCount;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-black text-gray-900">Product Inventory</h1>
        <p className="text-gray-500 mt-1">Manage stock status of all your listed products.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Products", value: products.length, color: "emerald", icon: "📦" },
          { label: "In Stock", value: inStockCount, color: "green", icon: "✅" },
          { label: "Out of Stock", value: outStockCount, color: "red", icon: "⚠️" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-${s.color}-100 flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${filterCat === c
                  ? "bg-emerald-600 text-white border-emerald-600 shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider">#</th>
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Discount</th>
                  <th className="px-4 py-3.5 text-left font-black text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-emerald-50/40 transition-colors group"
                  >
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50">
                          <img
                            src={getImgSrc(product.image[0])}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">{product._id.slice(-8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-xl text-xs font-semibold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="font-bold text-gray-900">₹{product.offerPrice}</p>
                      <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-xl text-xs font-bold">
                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleStock(product._id, !product.inStock)}
                        disabled={updating === product._id}
                        className={`relative inline-flex items-center h-7 w-13 rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 ${product.inStock ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        style={{ width: "3.25rem" }}
                      >
                        <span
                          className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ml-1 ${product.inStock ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                      </button>
                      <p className={`text-[10px] font-bold mt-0.5 ${product.inStock ? "text-emerald-600" : "text-red-400"}`}>
                        {updating === product._id ? "Saving…" : product.inStock ? "In Stock" : "Out"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-bold text-gray-700 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter, or add new products.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
