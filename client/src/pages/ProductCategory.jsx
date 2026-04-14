import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const navigate = useNavigate();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
  );

  if (products.length === 0) {
    return (
      <div className="mt-16 animate-pulse px-4 md:px-0">
        <div className="h-64 w-full bg-emerald-50 rounded-[3rem] mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 pb-16 sm:pb-20 md:pb-24 px-2 sm:px-4 md:px-6 lg:px-8 page-bottom-padding">
      {/* Category Hero Section */}
      {searchCategory && (
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3rem] bg-slate-900 mb-12 sm:mb-16 md:mb-20 lg:mb-24 p-6 sm:p-10 md:p-14 lg:p-16 text-white border border-white/10 shadow-2xl group">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                <div className="text-center lg:text-left flex-1">
                   <span className="text-emerald-400 font-black text-[8px] sm:text-[9px] md:text-xs lg:text-xs uppercase tracking-[0.4em] mb-3 sm:mb-4 block">Store Collections</span>
                   <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tighter mb-4 sm:mb-6 uppercase">
                      {searchCategory.text}
                   </h1>
                   <p className="text-gray-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg max-w-lg mb-6 sm:mb-8">
                      Freshest {searchCategory.text.toLowerCase()} delivered directly from verified organic farms to your doorstep.
                   </p>
                   <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-500/20">
                         <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
                         <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">{filteredProducts.length} Items Found</span>
                      </div>
                      <button onClick={() => navigate('/products')} className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-emerald-400 transition-colors">← Back to store</button>
                   </div>
                </div>
                
                <div className="w-40 sm:w-52 md:w-64 lg:w-72 xl:w-80 h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80 relative">
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-125"></div>
                   <img 
                      src={searchCategory.image} 
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-float relative z-10" 
                      alt={searchCategory.text}
                   />
                </div>
             </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
           <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight whitespace-nowrap">Available Products</h2>
              <div className="flex-1 h-px bg-gray-100"></div>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6 opacity-40">🥬</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Out of Stock</h2>
          <p className="text-gray-400 font-bold mb-8">We are presently restocking this category. Please check back soon!</p>
          <button onClick={() => navigate('/products')} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black">Browse other categories</button>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
