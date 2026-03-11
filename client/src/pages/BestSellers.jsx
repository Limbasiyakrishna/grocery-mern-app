import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSellers = () => {
    const { products } = useAppContext();
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        // For now, let's just pick a few popular categories or 
        // simply take a few products as "best sellers" 
        // In a real app, this would be based on sales data.
        setBestSellers(products.filter(p => p.price > 80).slice(0, 10));
    }, [products]);

    return (
        <div className="mt-16">
            <div className="flex flex-col items-center mb-10 text-center">
                <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800">Best Sellers</h1>
                <div className="w-20 h-1 bg-yellow-400 mt-2 rounded-full"></div>
                <p className="text-gray-500 mt-4 max-w-lg">
                    Our most loved items! From premium dairy to exotic fruits, see what's trending now.
                </p>
            </div>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {bestSellers.length > 0 ? (
                    bestSellers.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-gray-400 text-lg italic">Our best sellers are flying off the shelves. We'll have more for you soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BestSellers;
