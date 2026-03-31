import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const NewArrivals = () => {
    const { products } = useAppContext();
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        // Sort by createdAt descending and take top 10
        const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNewArrivals(sorted.slice(0, 10));
    }, [products]);

    return (
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
            <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 tracking-tight text-center">New Arrivals</h1>
                <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-emerald-600 mt-3 sm:mt-4 rounded-full shadow-lg shadow-emerald-200"></div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mt-4 sm:mt-6 max-w-xl font-medium leading-relaxed">
                    Check out our latest additions to the store. Freshly picked and ready for your kitchen!
                </p>
            </div>

            <div className="my-8 sm:my-12 md:my-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {newArrivals.length > 0 ? (
                    newArrivals.map((product, index) => (
                        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                             <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 sm:py-28 md:py-32 lg:py-40 bg-white rounded-[3rem] border border-gray-100 shadow-xl">
                        <div className="w-16 sm:w-18 md:w-20 lg:w-24 h-16 sm:h-18 md:h-20 lg:h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 animate-pulse">
                            🆕
                        </div>
                        <p className="text-gray-900 text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3">Something new is coming!</p>
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium italic">No new arrivals at the moment. Stay tuned!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
