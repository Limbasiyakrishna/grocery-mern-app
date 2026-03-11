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
        <div className="mt-16">
            <div className="flex flex-col items-center mb-10">
                <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800">New Arrivals</h1>
                <div className="w-20 h-1 bg-emerald-500 mt-2 rounded-full"></div>
                <p className="text-gray-500 mt-4 text-center max-w-lg">
                    Check out our latest additions to the store. Freshly picked and ready for your kitchen!
                </p>
            </div>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {newArrivals.length > 0 ? (
                    newArrivals.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-gray-400 text-lg italic">No new arrivals at the moment. Stay tuned!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
