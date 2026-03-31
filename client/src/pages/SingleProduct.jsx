import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { getImgSrc } from "../utils/imgResolver";

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const product = products.find((product) => product._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const productsCopy = products.filter(
        (p) => p.category === product.category && p._id !== product._id && p.inStock
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  const discount = product ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-8 mt-12 mb-20">
        <div className="animate-pulse flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 aspect-square bg-emerald-50 rounded-[2.5rem]"></div>
          <div className="w-full lg:w-1/2 space-y-6 pt-8">
            <div className="h-4 w-24 bg-emerald-100 rounded"></div>
            <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/4 bg-emerald-100 rounded"></div>
            <div className="h-24 w-full bg-gray-100 rounded"></div>
            <div className="flex gap-4">
              <div className="h-14 flex-1 bg-gray-200 rounded-2xl"></div>
              <div className="h-14 flex-1 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-8 mt-6 sm:mt-8 md:mt-12 mb-16 sm:mb-20 md:mb-24 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex text-[11px] sm:text-xs md:text-sm text-gray-500 font-medium mb-6 sm:mb-8 md:mb-10 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <span className="mx-1.5 sm:mx-2">/</span>
        <Link to="/products" className="hover:text-emerald-600 transition">Products</Link>
        <span className="mx-1.5 sm:mx-2">/</span>
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-emerald-600 transition capitalize">
          {product.category}
        </Link>
        <span className="mx-1.5 sm:mx-2">/</span>
        <span className="text-emerald-600 font-bold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 xl:gap-20">
        {/* ⭐ Image Gallery (Left Side) */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-2 sm:gap-3 md:gap-6 items-start">

          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 sm:gap-3 w-full md:w-20 lg:w-24 overflow-x-auto md:overflow-y-auto no-scrollbar scroll-smooth">
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setThumbnail(image)}
                className={`flex-shrink-0 w-14 sm:w-16 md:w-full aspect-square rounded-xl sm:rounded-2xl border-2 transition-all p-1 bg-white
                  ${thumbnail === image ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-emerald-300"}
                `}
              >
                <div className="w-full h-full rounded-lg sm:rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={getImgSrc(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full card-3d rounded-2xl sm:rounded-[2.5rem] border border-gray-100 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center aspect-square p-4 sm:p-6 md:p-8 relative overflow-hidden flex-1">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 hover:opacity-100 transition-opacity duration-500 z-[-1]" />

            {discount > 0 && (
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-10 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] sm:text-xs font-black uppercase tracking-widest rounded-full shadow-lg depth-layer block">
                {discount}% OFF
              </div>
            )}

            <img
              src={getImgSrc(thumbnail)}
              alt={product.name}
              className="card-3d-float w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* ⭐ Product Details (Right Side) */}
        <div className="w-full lg:w-1/2 flex flex-col pt-2 sm:pt-4 lg:pt-8">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5 sm:mb-2">
            {product.category}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
            <div className="flex bg-yellow-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-yellow-100 gap-1">
              {Array(5).fill("").map((_, i) => (
                <img
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  key={i}
                  className="w-3 sm:w-4 h-3 sm:h-4"
                />
              ))}
              <span className="text-[10px] sm:text-xs font-bold text-yellow-700 ml-1">4.0</span>
            </div>
            <span className="text-[11px] sm:text-sm font-medium text-gray-400">|</span>
            <span className="text-[11px] sm:text-sm font-semibold text-gray-500 underline cursor-pointer hover:text-emerald-600">
              124 Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-end gap-2 sm:gap-3 mb-1 flex-wrap">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-600">
                ₹{product.offerPrice}
              </span>
              <div className="flex flex-col pb-1">
                <span className="text-[10px] sm:text-sm font-bold text-gray-400 line-through">
                  MRP: ₹{product.price}
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Inclusive of all taxes
                </span>
              </div>
            </div>
          </div>

           {/* Action Buttons (Moved up like Blinkit) */}
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <button
               onClick={() => addToCart(product._id)}
               className="group flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 active:scale-95 transition-all animate-pulse-glow"
            >
              Add to Basket
              <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 bg-emerald-50/40 rounded-2xl sm:rounded-[2.5rem] border border-emerald-100/50 mb-8 sm:mb-10">
            <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
               <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-base sm:text-lg">🔒</div>
               <p className="text-[8px] sm:text-[10px] font-black text-gray-900 leading-tight">Secure Payments</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
               <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-base sm:text-lg">🛡️</div>
               <p className="text-[8px] sm:text-[10px] font-black text-gray-900 leading-tight">Quality Assured</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
               <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-base sm:text-lg">🥬</div>
               <p className="text-[8px] sm:text-[10px] font-black text-gray-900 leading-tight">100% Organic</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
               <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-base sm:text-lg">💰</div>
               <p className="text-[8px] sm:text-[10px] font-black text-gray-900 leading-tight">Best Prices</p>
            </div>
          </div>

          <hr className="border-gray-100 mb-6 sm:mb-8" />

          {/* ⭐ Product Details Section */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-[10px] sm:text-xs font-black text-gray-900 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1 sm:w-1.5 h-5 sm:h-6 bg-emerald-500 rounded-full" />
              Product Details
            </h3>
            
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100">
              <h4 className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">Description</h4>
              <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6 font-medium">
                {product.description?.[0] || "No description available."}
              </p>

              <h4 className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-wider mb-2.5 sm:mb-3">Key Features</h4>
              <ul className="space-y-2 sm:space-y-3">
                {product.description?.slice(1).map((desc, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400 mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span className="text-[10px] sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ⭐ The Freshness Timeline (Simplified) */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm">
             <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <h3 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Quality Assurance</h3>
             </div>
             
             <div className="flex justify-between items-start gap-2 sm:gap-4">
                {[
                  { icon: "🌿", title: "Harvested", subtitle: "Local Farm" },
                  { icon: "🛡️", title: "Verified", subtitle: "Grade A+" },
                  { icon: "📦", title: "Ready", subtitle: "For Pickup" }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-1.5 sm:gap-2 flex-1">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg shadow-inner">
                      {step.icon}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] sm:text-[10px] font-black text-gray-900 uppercase">{step.title}</p>
                      <p className="text-[7px] sm:text-[9px] text-gray-400 font-bold">{step.subtitle}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Safe Checkout Badge */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 py-3 sm:py-4 bg-gray-50/50 rounded-xl sm:rounded-2xl border border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <span className="text-base sm:text-xl">🛡️</span>
              <span className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-tighter">100% Secure</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <span className="text-base sm:text-xl">🌿</span>
              <span className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-tighter">Farm Fresh</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <span className="text-base sm:text-xl">↩️</span>
              <span className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-tighter">Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 md:mt-32">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5 sm:mb-2">
              Explore More
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Related Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition shadow-sm"
            >
              View More Products →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
