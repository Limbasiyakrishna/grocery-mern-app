import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getImgSrc } from '../utils/imgResolver';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, products, removeFromCart, updateCartItem, totalCartAmount, navigate, addToCart } = useAppContext();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div 
                className={`absolute top-0 right-0 w-full max-w-sm sm:max-w-md md:max-w-lg h-full bg-white shadow-2xl pointer-events-auto transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-4 sm:p-5 md:p-6 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/30">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Your Basket 🧺</h3>
                        <p className="text-[8px] sm:text-xs text-emerald-600 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">
                           {Object.keys(cartItems).length} Items Selected
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm flex-shrink-0"
                    >
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                    {Object.keys(cartItems).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce">🛒</div>
                            <p className="text-gray-900 font-black text-base sm:text-lg">Your basket is empty!</p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-[200px]">Add some fresh favorites to get started.</p>
                            <button 
                                onClick={() => { onClose(); navigate('/products'); }}
                                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-100 transition-all active:scale-95"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        Object.keys(cartItems).map((itemId) => {
                            const product = products.find(p => p._id === itemId);
                            if (!product) return null;
                            return (
                                <div key={itemId} className="flex gap-4 group animate-fade-in relative">
                                    <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden transform group-hover:scale-105 transition-transform">
                                        <img src={getImgSrc(product.image?.[0])} className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 object-contain drop-shadow-md" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{product.name}</h4>
                                        <p className="text-[8px] sm:text-xs text-gray-400 font-medium mb-2">{product.category}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs sm:text-sm font-black text-gray-900">₹{product.price}</p>
                                            
                                            <div className="flex items-center gap-2.5 sm:gap-3 bg-gray-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200">
                                                <button 
                                                    onClick={() => updateCartItem(itemId, cartItems[itemId] - 1)}
                                                    className="w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center text-gray-400 hover:text-emerald-600 font-black"
                                                >
                                                    -
                                                </button>
                                                <span className="text-[8px] sm:text-xs font-black w-4 text-center">{cartItems[itemId]}</span>
                                                <button 
                                                    onClick={() => addToCart(itemId)}
                                                    className="w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center text-gray-400 hover:text-emerald-600 font-black"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(itemId)}
                                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100"
                                    >
                                        <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer / Total */}
                {Object.keys(cartItems).length > 0 && (
                    <div className="p-4 sm:p-5 md:p-6 border-t border-emerald-50 bg-emerald-50/30">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px] sm:text-xs">Total Amount</span>
                            <span className="text-xl sm:text-2xl font-black text-gray-900">₹{totalCartAmount()}</span>
                        </div>
                        <button 
                            onClick={() => { onClose(); navigate('/cart'); }}
                            className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-[1.25rem] font-black text-xs sm:text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98]"
                        >
                            Checkout Now
                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
