import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-20">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
          Our Best Sellers
        </h2>
        <div className="w-20 h-1.5 bg-emerald-600 rounded-full mb-4"></div>
        <p className="text-gray-500 max-w-lg">
          Our most loved products curated just for you. Quality guaranteed with every pick.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
