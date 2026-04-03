import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { products, axios, navigate } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/all");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSales = orders.reduce((acc, order) => acc + (order.status !== "Cancelled" ? order.amount : 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.filter(p => p.inStock).length;

  const stats = [
    { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: "💰", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Orders", value: totalOrders, icon: "📦", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Products", value: activeProducts, icon: "🛒", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Orders", value: orders.filter(o => o.status === "Order Placed").length, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back, fresh insights are waiting for you.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                  <th className="pb-4 px-2">Order ID</th>
                  <th className="pb-4 px-2">Customer</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2 text-sm font-bold text-gray-600 font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-2 text-sm font-semibold text-gray-700">
                      {order.address?.firstName} {order.address?.lastName}
                    </td>
                    <td className="py-4 px-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                         order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                         order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="py-4 px-2 text-sm font-black text-gray-900">₹{order.amount}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-400 font-medium italic">No orders found yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Inventory Status */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <h3 className="text-xl font-bold mb-6 relative z-10">Inventory Health</h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                 <span className="text-slate-400 uppercase tracking-widest">In Stock Items</span>
                 <span className="text-emerald-400">{((activeProducts / products.length) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500" style={{ width: `${(activeProducts / products.length) * 100}%` }} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
               <p className="text-sm font-medium text-slate-400 mb-4">You have <span className="text-white font-bold">{products.length - activeProducts}</span> items out of stock.</p>
               <button 
                 onClick={() => navigate("/seller/product-list")}
                 className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition active:scale-95"
               >
                 Restock Now
               </button>
            </div>
          </div>
          
          <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-xs text-slate-400 font-medium">Suggestion: Your strawberries are selling 40% faster this week!</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
