import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { getImgSrc } from "../utils/imgResolver";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Cycle through images on hover
  useEffect(() => {
    let interval;
    if (isHovered && product.image.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % product.image.length);
      }, 1000);
    } else {
      setCurrentImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, product.image.length]);

  return (
    product && (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          navigate(
            `/product/${product.category.toLowerCase()}/${product?._id}`
          );
          scrollTo(0, 0);
        }}
        className="card-3d group relative bg-white rounded-3xl border border-gray-100 p-3 transition-all duration-400 overflow-hidden hover:border-emerald-200 cursor-pointer"
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 depth-layer">
          {product.offerPrice < product.price && (
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              SALE
            </span>
          )}
        </div>

        {/* Image Section */}
        <div className="card-3d-float relative aspect-square rounded-2xl overflow-hidden bg-gray-50/50 mb-4 p-2">
          <img
            className={`w-full h-full object-contain transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            src={getImgSrc(product.image[currentImgIndex])}
            alt={product.name}
          />

          {/* Image Dots */}
          {product.image.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.image.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${currentImgIndex === i ? "bg-emerald-600 w-3" : "bg-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="px-2 pb-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="text-gray-900 font-semibold text-sm truncate mb-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="rating"
                    className="w-3"
                  />
                ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">(4.0)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-emerald-600">
                ₹{product.offerPrice}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 group/btn"
                >
                  <svg className="w-5 h-5 group-hover/btn:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="w-7 h-7 flex items-center justify-center text-emerald-600 hover:bg-white rounded-lg transition-all hover:shadow-md font-bold"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-emerald-600 min-w-6 text-center">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="w-7 h-7 flex items-center justify-center text-emerald-600 hover:bg-white rounded-lg transition-all hover:shadow-md font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
