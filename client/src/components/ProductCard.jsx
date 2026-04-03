import { useAppContext } from "../context/AppContext";
import { getImgSrc } from "../utils/imgResolver";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/product/${product.category.toLowerCase()}/${product?._id}`);
          scrollTo(0, 0);
        }}
        className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-2 sm:p-2.5 transition-all hover:shadow-md cursor-pointer flex flex-col h-full"
      >
        {/* Image Section */}
        <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 mb-2 sm:mb-3 flex items-center justify-center p-1.5 sm:p-2">
           {product.offerPrice < product.price && (
            <div className="absolute top-0 left-0 z-10 bg-blue-600 text-white text-[7px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg uppercase">
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </div>
          )}
          <img
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            src={getImgSrc(product.image?.[0])}
            alt={product.name}
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col flex-1">
          <h3 className="text-gray-900 font-bold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <p className="text-[9px] sm:text-[11px] text-gray-500 mb-1.5 sm:mb-2 line-clamp-1 italic">
            {product.description?.[0]}
          </p>

          <div className="mt-auto flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-gray-900">
                ₹{product.offerPrice}
              </span>
              {product.offerPrice < product.price && (
                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

    <div onClick={(e) => e.stopPropagation()}>
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="bg-white text-emerald-600 border border-emerald-600 px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-tight hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 whitespace-nowrap"
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center justify-between bg-emerald-600 text-white px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md sm:rounded-[0.625rem] shadow-xl shadow-emerald-900/10 min-w-[70px] sm:min-w-[84px] animate-scale-up-fade">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors font-black text-xs sm:text-sm"
                  >
                    −
                  </button>
                  <span className="text-[9px] sm:text-xs font-black mx-1 sm:mx-1.5 drop-shadow-sm">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors font-black text-xs sm:text-sm"
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
