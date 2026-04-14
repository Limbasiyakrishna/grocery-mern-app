import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";

const Products = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let tempProducts = [...products];

    // Search filter
    if (searchQuery.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== "All") {
        tempProducts = tempProducts.filter((product) => 
            product.category.toLowerCase() === activeCategory.toLowerCase()
        );
    }

    setFilteredProducts(tempProducts.filter(p => p.inStock));
  }, [products, searchQuery, activeCategory]);

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 min-h-screen px-2 sm:px-4 md:px-0 page-bottom-padding">
       {/* Breadcrumbs / Title */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 md:gap-0 mb-8 sm:mb-10 md:px-0">
          <div className="flex-1">
            <span className="text-emerald-600 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-0.5 sm:mb-1 block">Explorer</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                {activeCategory === "All" ? "Fresh" : activeCategory} <span className="text-emerald-600">Goods</span>
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-[10px] sm:text-xs md:text-sm tracking-tight">
             {filteredProducts.length} items found matching your needs
          </p>
       </div>

       <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-10">
          {/* Mobile Filter Button */}
          <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="lg:hidden flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg font-bold text-sm text-emerald-700 hover:bg-emerald-100 transition-all"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
             </svg>
             Filters
          </button>

          {/* Sidebar Categories */}
          <div className={`lg:w-72 shrink-0 ${sidebarOpen ? "block" : "hidden lg:block"} transition-all`}>
             <div className="sticky top-24 sm:top-28 bg-white border border-gray-100 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] p-4 sm:p-6 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
                <h3 className="text-[9px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 px-2">Categories</h3>
                <div className="space-y-1.5 sm:space-y-2">
                    <button 
                       onClick={() => { setActiveCategory("All"); setSidebarOpen(false); }}
                       className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-black text-xs sm:text-sm transition-all ${activeCategory === "All" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"}`}
                    >
                       All Products
                    </button>
                    {categories.map((cat, i) => (
                        <button 
                           key={i}
                           onClick={() => { setActiveCategory(cat.path); setSidebarOpen(false); }}
                           className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-black text-xs sm:text-sm transition-all ${activeCategory === cat.path ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"}`}
                        >
                           {cat.text}
                        </button>
                    ))}
                </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={index} className="scroll-reveal h-full">
                           <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🔍</div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1.5 sm:mb-2">No matching products</h2>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm px-2">Try searching for something else or change the category.</p>
                        <button 
                           onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                           className="mt-4 sm:mt-6 text-emerald-600 font-black underline decoration-2 underline-offset-4 text-xs sm:text-sm"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Products;
