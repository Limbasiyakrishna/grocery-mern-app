import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getImgSrc } from "../utils/imgResolver";
import toast from "react-hot-toast";
import PaymentGateway from "../modals/PaymentGateway";

const Cart = () => {
  const {
    products,
    navigate,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    addToCart,
    axios,
    user,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const getCartData = () => {
    let tempArray = [];
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const product = products.find((product) => product._id === key);
        if (product) {
          tempArray.push({ ...product, quantity: cartItems[key] });
        }
      }
    }
    setCartArray(tempArray);
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddressList(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      }
    } catch (error) {
      // Silently handle auth errors - don't log or show
      if (error.response?.status !== 401) {
        console.error(error);
      }
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      setCouponsLoading(true);
      const { data } = await axios.get("/api/coupon/list");
      if (data.success) {
        setAvailableCoupons(data.coupons);
      }
    } catch (error) {
      // Silently fail for public endpoint
      if (error.response?.status !== 401) {
        console.warn("Coupons not available");
      }
    } finally {
      setCouponsLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`✅ "${code}" copied to clipboard!`);
  };

  useEffect(() => {
    if (user) fetchAddresses();
    fetchAvailableCoupons();
  }, [user]);

  useEffect(() => {
    if (products.length > 0) getCartData();
  }, [products, cartItems]);

  const handlePlaceOrder = async () => {
    if (!user) return setShowUserLogin(true);
    if (!selectedAddress) return toast.error("Please select a delivery address");

    // Show payment gateway for all payment methods
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("🎉 Order Placed Successfully!");
    toast.success("📧 Invoice sent to your email");
    setCartItems({});
    setCouponCode("");
    setAppliedCoupon(null);
    setShowPaymentGateway(false);
    navigate("/my-orders");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const { data } = await axios.post("/api/coupon/validate", {
        code: couponCode,
        orderAmount: subtotal,
      });

      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          discountPercent: data.discountPercent,
        });
        toast.success(`✅ Coupon applied! You saved ₹${data.discountAmount}`);
        setCouponCode(""); // Clear input after successful apply
      } else {
        toast.error(data.message || "Coupon not valid");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to apply coupon";
      toast.error(errorMsg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  // Calculate billing amounts
  const subtotal = totalCartAmount();
  const TAX_RATE = 5; // 5% tax
  const taxAmount = Math.floor((subtotal * TAX_RATE) / 100);
  const platformFee = 5;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalAmount = subtotal + taxAmount + platformFee - discountAmount;

  if (products.length === 0) return <div className="h-screen flex items-center justify-center animate-pulse text-emerald-600 font-black text-sm sm:text-base md:text-lg">Loading Basket...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 page-bottom-padding">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 py-3 md:py-4 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Your <span className="text-emerald-600">Basket</span>
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-bold mt-1">
            {cartArray.length} item{cartArray.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 xl:gap-8 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* LEFT: Items & Address (Full width on mobile) */}
        <div className="flex-1 lg:mt-10 mt-4 sm:mt-6">
          
          {/* Cart Items Section */}
          <div className="mt-6 lg:mt-0">
            <div className="space-y-3 sm:space-y-4">
              {cartArray.length === 0 ? (
                <div className="py-12 sm:py-16 md:py-20 bg-white rounded-xl sm:rounded-2xl md:rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center mx-0 sm:mx-0">
                   <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🛒</div>
                   <h2 className="text-base sm:text-lg md:text-2xl font-black text-gray-900">Your basket is empty</h2>
                   <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mt-2">Add some fresh items to get started</p>
                   <button onClick={() => navigate('/products')} className="mt-4 sm:mt-6 px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 bg-emerald-600 text-white text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl md:rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all active:scale-95">
                     Start Shopping
                   </button>
                </div>
              ) : (
                cartArray.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative flex gap-2 sm:gap-3 md:gap-6 p-3 sm:p-4 md:p-6 bg-white border border-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Product Image */}
                    <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gray-50 rounded-lg md:rounded-2xl p-1.5 sm:p-2 md:p-3 flex items-center justify-center shrink-0 border border-gray-50">
<img src={getImgSrc(item.image[0])} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} loading="lazy" decoding="async" />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                       <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-gray-900 truncate uppercase tracking-tight">{item.name}</h3>
                       <p className="text-[9px] sm:text-xs md:text-sm font-bold text-gray-400 mb-1 sm:mb-2">{item.category}</p>
                       <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-wrap">
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-gray-900">₹{item.offerPrice}</span>
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400 line-through">₹{item.price}</span>
                       </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 bg-gray-50 p-1 md:p-2 rounded-lg md:rounded-xl border border-gray-100 shrink-0">
                       <button 
                         onClick={() => removeFromCart(item._id)} 
                         className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 rounded-lg rounded-md sm:rounded-lg md:rounded-xl shadow-sm transition-all active:scale-90 font-black text-xs sm:text-sm"
                       >
                         −
                       </button>
                       <span className="text-[10px] sm:text-xs md:text-sm font-black w-3 text-center">{item.quantity}</span>
                       <button 
                         onClick={() => addToCart(item._id)} 
                         className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 flex items-center justify-center bg-white text-gray-400 hover:text-emerald-500 rounded-lg md:rounded-xl shadow-sm transition-all active:scale-90 font-black text-xs sm:text-sm"
                       >
                         +
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="mt-6 sm:mt-8 lg:mt-10">
            {user ? (
            <div className="bg-slate-900 rounded-lg sm:rounded-xl md:rounded-3xl p-4 sm:p-5 md:p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-2">
                     <h3 className="text-base sm:text-lg md:text-2xl font-black tracking-tight">Delivery 🏠</h3>
                     <button onClick={() => navigate('/add-address')} className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase text-emerald-400 border border-emerald-400/30 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full hover:bg-emerald-400/10 transition-colors tracking-widest whitespace-nowrap">+ Add</button>
                  </div>

                  {addressList.length > 0 ? (
                    <div className="space-y-2 md:space-y-3 max-h-48 sm:max-h-56 md:max-h-[300px] overflow-y-auto pr-2">
                      {addressList.map((addr, i) => (
                        <div 
                          key={i}
                          onClick={() => setSelectedAddress(addr)}
                          className={`p-2.5 sm:p-3 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress?._id === addr._id ? "bg-emerald-600 border-emerald-400 shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                        >
                           <p className="font-black text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 uppercase tracking-widest">{addr.addressType}</p>
                           <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/60 leading-relaxed line-clamp-2">{addr.houseNo}, {addr.area}, {addr.city}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 sm:py-8 text-center opacity-40">
                       <p className="font-bold text-[10px] sm:text-xs md:text-sm">No addresses found</p>
                    </div>
                  )}
               </div>
            </div>
            ) : (
            <div className="bg-slate-900 rounded-lg sm:rounded-xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-white text-center">
               <h3 className="text-base sm:text-lg md:text-2xl font-black tracking-tight mb-2 sm:mb-3">Add Delivery Address</h3>
               <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mb-3 sm:mb-5">Login to manage your addresses</p>
               <button onClick={() => setShowUserLogin(true)} className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-emerald-600 text-white text-xs sm:text-sm md:text-base rounded-lg md:rounded-xl font-bold hover:bg-emerald-700 transition-all w-full">
                 Login Now
               </button>
            </div>
            )}
          </div>
        </div>

        {/* RIGHT: Price Summary (Bottom on mobile, Sticky on desktop) */}
        <div className="lg:w-96 lg:mt-10">
           <div className="lg:sticky lg:top-32 bg-white border-t-4 lg:border-t-0 border-emerald-100 lg:border-2 lg:border-emerald-50 rounded-t-2xl sm:rounded-t-3xl lg:rounded-3xl p-4 sm:p-5 md:p-8 shadow-2xl shadow-emerald-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 bg-emerald-50 rounded-full blur-2xl -mr-8 sm:-mr-10 md:-mr-10 -mt-8 md:-mt-10"></div>
              
              <div className="relative z-10">
                {/* Mobile: Show total first */}
                <div className="lg:hidden mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-dashed border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Bill Total</span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-600">₹{finalAmount}</span>
                  </div>
                </div>

                <h3 className="hidden lg:block text-base sm:text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase mb-4 sm:mb-6">Order Summary</h3>
                
                {/* Coupon Section */}
                {!appliedCoupon ? (
                  <div className="mb-4 sm:mb-5 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-emerald-50 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-emerald-200">
                    <p className="text-[8px] sm:text-[9px] md:text-xs font-bold text-emerald-700 uppercase mb-1.5 sm:mb-2 md:mb-3 tracking-widest">Coupon Code</p>
                    <div className="flex gap-1.5 sm:gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        maxLength={20}
                        className="flex-1 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2.5 border border-emerald-300 rounded-lg md:rounded-xl outline-none text-xs md:text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 bg-emerald-600 text-white rounded-lg md:rounded-xl font-bold text-[10px] sm:text-xs md:text-sm hover:bg-emerald-700 disabled:bg-gray-300 transition-all whitespace-nowrap active:scale-95"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-3 md:p-4 bg-emerald-100 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-emerald-400 shadow-md">
                    <div className="flex justify-between items-center gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm md:text-base font-black text-emerald-800 flex items-center gap-2 truncate">✅ {appliedCoupon.code}</p>
                        <p className="text-[8px] sm:text-[9px] md:text-xs text-emerald-700 mt-1 font-semibold">You saved ₹{appliedCoupon.discountAmount}!</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold text-[9px] sm:text-[10px] md:text-xs uppercase active:scale-95 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Available Coupons Section */}
                {couponsLoading && (
                  <div className="mb-4 text-[10px] text-blue-600 font-semibold">Loading coupons...</div>
                )}
                {availableCoupons.length > 0 && !appliedCoupon && (
                  <div className="mb-4 sm:mb-6 md:mb-8 p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-yellow-200">
                    <p className="text-[8px] sm:text-[9px] md:text-xs font-black text-yellow-800 uppercase mb-3 sm:mb-4 tracking-widest">🎟️ Available Coupons</p>
                    <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                      {availableCoupons.map((coupon, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 sm:p-3 md:p-4 bg-white rounded-lg md:rounded-xl border-2 border-yellow-300 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 sm:gap-3">
                            {/* Coupon Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2 flex-wrap">
                                <p className="text-[9px] sm:text-xs md:text-sm font-black text-yellow-900 uppercase tracking-wider bg-yellow-100 px-2 py-0.5 sm:px-2.5 md:py-1 rounded-lg">{coupon.code}</p>
                                <span className="text-[7px] sm:text-[8px] md:text-[10px] font-bold bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded-full whitespace-nowrap">{coupon.discountPercent}% OFF</span>
                              </div>
                              <p className="text-[8px] sm:text-[9px] md:text-xs text-yellow-700 font-medium">
                                Min ₹{coupon.minOrderAmount} • Max ₹{coupon.maxDiscount}
                              </p>
                              {coupon.description && (
                                <p className="text-[7px] sm:text-[8px] md:text-xs text-yellow-600 mt-1 italic">{coupon.description}</p>
                              )}
                            </div>
                            
                            {/* Copy Button - LARGER FOR MOBILE */}
                            <button
                              onClick={() => copyToClipboard(coupon.code)}
                              className="shrink-0 flex items-center gap-1 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 rounded-lg transition-all active:scale-95 shadow-md hover:shadow-lg font-bold text-[8px] sm:text-[9px] md:text-xs min-w-max"
                              title="Copy coupon code"
                            >
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="hidden sm:inline text-[8px] md:text-xs">Copy</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick Apply Instructions */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-yellow-300 text-[7px] sm:text-[8px] md:text-xs text-yellow-800 bg-white/50 p-1.5 sm:p-2.5 rounded-lg">
                      💡 Tap <strong>Copy</strong> to copy code, then paste above and click <strong>Apply</strong>
                    </div>
                  </div>
                )}
                
                {/* Billing Details */}
                <div className="hidden lg:block space-y-2.5 sm:space-y-3 md:space-y-4 mb-5 sm:mb-6 md:mb-8">
                   <div className="flex justify-between text-[9px] sm:text-xs md:text-sm font-bold text-gray-400 tracking-tight uppercase">
                      <span>Subtotal</span>
                      <span className="text-gray-900">₹{subtotal}</span>
                   </div>
                   <div className="flex justify-between text-[9px] sm:text-xs md:text-sm font-bold text-gray-400 tracking-tight uppercase">
                      <span>Tax ({TAX_RATE}%)</span>
                      <span className="text-gray-900">₹{taxAmount}</span>
                   </div>
                   <div className="flex justify-between text-[9px] sm:text-xs md:text-sm font-bold text-gray-400 tracking-tight uppercase">
                      <span>Platform Fee</span>
                      <span className="text-gray-900">₹{platformFee}</span>
                   </div>
                   {discountAmount > 0 && (
                     <div className="flex justify-between text-[9px] sm:text-xs md:text-sm font-bold text-emerald-600 tracking-tight uppercase">
                       <span>Discount</span>
                       <span>- ₹{discountAmount}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-[9px] sm:text-xs md:text-sm font-bold text-gray-400 tracking-tight uppercase pb-3 sm:pb-4 border-b border-dashed border-gray-100">
                      <span>Savings</span>
                      <span>- ₹0</span>
                   </div>
                   <div className="flex justify-between items-center pt-3 sm:pt-4">
                      <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-gray-900 tracking-tighter">₹{finalAmount}</span>
                   </div>
                </div>

                {/* Payment Option - Desktop only */}
                <div className="hidden lg:block space-y-4 mb-6 sm:mb-8">
                   <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Payment Methods Available</p>
                   <div className="space-y-2.5 text-xs sm:text-sm">
                     <div className="p-3 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center gap-3">
                       <span className="text-lg">💳</span>
                       <div>
                         <p className="font-black text-gray-900">Online Payment</p>
                         <p className="text-[9px] text-gray-600">Cards, Netbanking, Wallets</p>
                       </div>
                     </div>
                     <div className="p-3 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center gap-3">
                       <span className="text-lg">📱</span>
                       <div>
                         <p className="font-black text-gray-900">UPI Payment</p>
                         <p className="text-[9px] text-gray-600">Google Pay, PhonePe, Paytm</p>
                       </div>
                     </div>
                     <div className="p-3 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center gap-3">
                       <span className="text-lg">💵</span>
                       <div>
                         <p className="font-black text-gray-900">Cash on Delivery</p>
                         <p className="text-[9px] text-gray-600">Pay when you receive</p>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Place Order Button */}
                <button 
                   onClick={handlePlaceOrder}
                   disabled={cartArray.length === 0}
                   className={`w-full py-2.5 sm:py-3 md:py-4 rounded-lg md:rounded-2xl font-black text-xs sm:text-sm md:text-base uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${cartArray.length > 0 ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                   Order Now
                   <svg className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>

                {/* Organic Guarantee - Mobile */}
                <div className="lg:hidden mt-3 sm:mt-4 bg-emerald-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-emerald-100 flex items-center gap-2.5">
                   <div className="text-sm sm:text-base flex-shrink-0">🌱</div>
                   <div className="min-w-0">
                      <p className="text-[8px] sm:text-[9px] font-black text-emerald-800 uppercase tracking-widest">Fresh Promise</p>
                      <p className="text-[7px] sm:text-[8px] font-medium text-emerald-600">Farm to table quality</p>
                   </div>
                </div>
              </div>
           </div>

           {/* Organic Guarantee - Desktop */}
           <div className="hidden lg:block mt-4 sm:mt-6 bg-emerald-50/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-100 flex items-center gap-3 sm:gap-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center text-base sm:text-xl shadow-sm flex-shrink-0">🌱</div>
              <div>
                 <p className="text-[8px] sm:text-xs font-black text-emerald-800 uppercase tracking-widest">Organic Guarantee</p>
                 <p className="text-[7px] sm:text-[10px] font-medium text-emerald-600 mt-0.5">Fresh from the farm to your table</p>
              </div>
           </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <PaymentGateway
          cartData={{
            userId: user?._id,
            items: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
              price: item.offerPrice,
            })),
            selectedAddress: selectedAddress?._id,
            appliedCoupon: appliedCoupon,
            totalAmount: finalAmount,
            subtotal: subtotal,
            taxAmount: taxAmount,
            platformFee: platformFee,
            couponDiscount: discountAmount,
            userEmail: user?.email,
            userPhone: user?.phone,
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentGateway(false)}
        />
      )}
    </div>
  );
};

export default Cart;
