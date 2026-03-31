import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { getImgSrc } from "../utils/imgResolver";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user, navigate } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
        // Option to redirect to home if not logged in
    }
  }, [user]);

  return (
    <div className="mt-8 sm:mt-12 md:mt-16 pb-16 sm:pb-20 max-w-6xl mx-auto px-3 sm:px-4 md:px-0">
      <div className="flex flex-col mb-8 sm:mb-12">
        <span className="text-emerald-600 font-black text-[9px] sm:text-xs uppercase tracking-[0.3em] mb-1.5 sm:mb-3">Order History</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
            Your <span className="text-emerald-600">Basket</span> Timeline
        </h2>
        <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-emerald-600 rounded-full mt-3 sm:mt-4"></div>
      </div>

      {myOrders.length === 0 ? (
        <div className="py-16 sm:py-20 md:py-24 bg-white rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">📦</div>
             <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-1.5 sm:mb-2">No orders found yet</h3>
             <p className="text-gray-400 font-bold text-xs sm:text-sm mb-6 sm:mb-8 px-2">Start filling your basket with fresh groceries!</p>
             <button onClick={() => navigate('/products')} className="px-6 sm:px-10 py-2.5 sm:py-4 bg-emerald-600 text-white rounded-lg sm:rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Go Shopping</button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {myOrders.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className="bg-white rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Order Header */}
              <div className="bg-slate-900 p-4 sm:p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                <div className="space-y-0.5 sm:space-y-1">
                   <p className="text-[8px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Order Identifier</p>
                   <p className="text-xs sm:text-sm font-mono font-bold opacity-80">#{order._id.slice(-12).toUpperCase()}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 w-full md:w-auto">
                    <div className="text-center md:text-right">
                       <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Status</p>
                       <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-tighter border border-emerald-400/20 inline-block">
                          {order.status}
                       </span>
                    </div>
                    <div className="text-center md:text-right">
                       <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Payment</p>
                       <p className="text-[10px] sm:text-xs font-black uppercase">{order.paymentType}</p>
                    </div>
                    <div className="text-center md:text-right">
                       <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Amount Paid</p>
                       <p className="text-lg sm:text-xl font-black text-emerald-400 tracking-tighter">₹{order.amount}</p>
                    </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-start sm:items-center gap-3 sm:gap-6 ${itemIndex !== order.items.length - 1 ? "pb-4 sm:pb-6 border-b border-gray-50" : ""}`}
                  >
                    <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-gray-50 rounded-lg sm:rounded-2xl p-1.5 sm:p-2 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform flex-shrink-0">
                       <img 
                         src={getImgSrc(item.product.image[0])} 
                         className="w-full h-full object-contain mix-blend-multiply" 
                         alt={item.product.name}
                       />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h4 className="text-xs sm:text-sm md:text-lg font-black text-gray-900 truncate uppercase tracking-tight">{item.product.name}</h4>
                       <p className="text-[9px] sm:text-xs font-bold text-gray-400">{item.product.category}</p>
                    </div>

                    <div className="text-right flex-shrink-0 hidden sm:block">
                       <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</p>
                       <p className="text-xs sm:text-sm font-black text-gray-900">x{item.quantity || "1"}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                       <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                       <p className="text-xs sm:text-sm font-black text-gray-900">₹{item.product.offerPrice * (item.quantity || 1)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                 <p className="text-[9px] sm:text-xs font-bold text-gray-400 whitespace-nowrap">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                 <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <button className="text-[8px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-widest hover:underline underline-offset-4 whitespace-nowrap">Get Invoice</button>
                    <button 
                        onClick={() => navigate(`/product/${order.items[0].product.category}/${order.items[0].product._id}`)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm flex-1 sm:flex-none text-center"
                    >
                        Re-order
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
