import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-12 sm:mt-20 px-4 sm:px-0">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
          Our Best Sellers
        </h2>
        <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-emerald-600 rounded-full mb-3 sm:mb-4"></div>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg px-2">
          Our most loved products curated just for you. Quality guaranteed with every pick.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {products
          .filter((product) => product.inStock)
          .slice(0, 6)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
