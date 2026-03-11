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
    <div className="container mx-auto px-4 md:px-8 mt-12 mb-20 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 font-medium mb-10 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-emerald-600 transition">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-emerald-600 transition capitalize">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-emerald-600 font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        {/* ⭐ Image Gallery (Left Side) */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 md:gap-6 items-start">

          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 w-full md:w-24 overflow-x-auto md:overflow-y-auto no-scrollbar scroll-smooth">
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setThumbnail(image)}
                className={`flex-shrink-0 w-20 md:w-full aspect-square rounded-2xl border-2 transition-all p-1 bg-white
                  ${thumbnail === image ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-emerald-300"}
                `}
              >
                <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
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
          <div className="w-full card-3d rounded-[2.5rem] border border-gray-100 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center aspect-square p-8 relative overflow-hidden flex-1">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-1" />

            {discount > 0 && (
              <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg depth-layer block">
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
        <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 gap-1">
              {Array(5).fill("").map((_, i) => (
                <img
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  key={i}
                  className="w-4 h-4"
                />
              ))}
              <span className="text-xs font-bold text-yellow-700 ml-1">4.0</span>
            </div>
            <span className="text-sm font-medium text-gray-400">|</span>
            <span className="text-sm font-semibold text-gray-500 underline cursor-pointer hover:text-emerald-600">
              124 Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-4xl md:text-5xl font-black text-emerald-600">
                ₹{product.offerPrice}
              </span>
              <div className="flex flex-col pb-1">
                <span className="text-sm font-bold text-gray-400 line-through">
                  MRP: ₹{product.price}
                </span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Inclusive of all taxes
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Description Details */}
          <div className="mb-10">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              About Product
            </h3>
            <ul className="space-y-3">
              {product.description?.map((desc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed font-medium">
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={() => addToCart(product._id)}
              className="group flex-1 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
                scrollTo(0, 0);
              }}
              className="group flex-1 btn-primary py-4 text-base shadow-xl flex items-center justify-center gap-2"
            >
              Buy Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Delivery perk tags */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">🛵</span>
              Fast 30 Min Delivery
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-lg">🛡️</span>
              100% Secure Payment
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg">🌿</span>
              Farm Fresh Guarantee
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
              Explore More
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Related Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition shadow-sm"
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
