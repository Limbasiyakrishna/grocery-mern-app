import { assets, categories } from "../../assets/assets";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, fetchProducts } = useAppContext();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const resetForm = () => {
    setName(""); setDescription(""); setCategory("");
    setPrice(""); setOfferPrice(""); setFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Product name is required");
    if (!description.trim()) return toast.error("Product description is required");
    if (!category) return toast.error("Category is required");
    if (!price || price <= 0) return toast.error("Valid original price is required");
    if (!offerPrice || offerPrice <= 0) return toast.error("Valid offer price is required");
    if (Number(offerPrice) > Number(price)) return toast.error("Offer price must be ≤ original price");
    const validFiles = files.filter(Boolean);
    if (validFiles.length === 0) return toast.error("At least one image is required");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      // Description stored as JSON array on backend
      formData.append("description", JSON.stringify(
        description.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
      ));
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      validFiles.forEach(f => formData.append("image", f));

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success("Product added successfully!");
        resetForm();
        fetchProducts();          // refresh website product list immediately
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const discount = price && offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

  return (
    <div className="p-6 md:p-10">
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-black text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to list a new product on the store.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Main form ── */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Image upload */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-base font-black text-gray-800 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">1</span>
                Product Images
              </h2>
              <p className="text-xs text-gray-400 mb-4 ml-8">Upload up to 4 images. First image is the thumbnail.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array(4).fill("").map((_, i) => (
                  <div key={i} className="relative group">
                    <label
                      htmlFor={`image${i}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(null);
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          const updated = [...files];
                          updated[i] = file;
                          setFiles(updated);
                        }
                      }}
                      className={`flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${dragOver === i ? "border-emerald-500 bg-emerald-50" :
                          files[i] ? "border-emerald-300 bg-emerald-50/30" : "border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50"
                        }`}
                    >
                      <input
                        id={`image${i}`}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const updated = [...files];
                          updated[i] = e.target.files[0];
                          setFiles(updated);
                        }}
                      />
                      {files[i] ? (
                        <img
                          src={URL.createObjectURL(files[i])}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-2xl mb-1">{i === 0 ? "📷" : "+"}</div>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {i === 0 ? "Main" : `Image ${i + 1}`}
                          </p>
                        </div>
                      )}
                    </label>
                    {files[i] && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...files];
                          updated[i] = null;
                          setFiles(updated);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow transition"
                      >×</button>
                    )}
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h2 className="text-base font-black text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">2</span>
                Product Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="p-name">Product Name</label>
                <input
                  id="p-name" type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Tomatoes 1kg"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="p-desc">
                  Description
                  <span className="text-xs text-gray-400 font-normal ml-2">(separate points with comma or new line)</span>
                </label>
                <textarea
                  id="p-desc" rows={4} value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh and organic, Rich in Vitamin C, Farm fresh quality"
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="p-cat">Category</label>
                <select
                  id="p-cat" value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a category…</option>
                  {categories.map((cat) => (
                    <option key={cat.path} value={cat.path}>{cat.text}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">3</span>
                Pricing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="p-price">Original Price (₹)</label>
                  <input
                    id="p-price" type="number" value={price} min="0"
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="p-offer">Offer Price (₹)</label>
                  <input
                    id="p-offer" type="number" value={offerPrice} min="0"
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
              </div>

              {discount > 0 && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">{discount}%</div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Customer savings</p>
                    <p className="text-xs text-emerald-600">₹{(Number(price) - Number(offerPrice)).toFixed(2)} off per unit</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Adding…</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>Add Product</>
                )}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-[0.875rem] hover:bg-gray-200 transition text-sm">
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* ── Live preview sidebar ── */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm sticky top-24">
            <h3 className="font-black text-gray-800 mb-4 text-sm">Live Preview</h3>
            <div className="card-3d rounded-2xl border border-gray-100 p-3 bg-gray-50 overflow-hidden">
              {/* Preview image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 flex items-center justify-center">
                {files.filter(Boolean)[0] ? (
                  <img src={URL.createObjectURL(files.filter(Boolean)[0])} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-4xl opacity-30">📦</div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{category || "Category"}</p>
              <p className="font-bold text-gray-900 text-sm truncate">{name || "Product name"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-emerald-600 font-black">₹{offerPrice || "0"}</span>
                {price && <span className="text-gray-400 line-through text-xs">₹{price}</span>}
                {discount > 0 && <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">{discount}% OFF</span>}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              {[
                { label: "Name", value: name },
                { label: "Category", value: category },
                { label: "Images", value: files.filter(Boolean).length + " uploaded" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-600">
                  <span className="font-semibold">{label}</span>
                  <span className={value ? "text-emerald-600 font-medium" : "text-gray-300"}>{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
