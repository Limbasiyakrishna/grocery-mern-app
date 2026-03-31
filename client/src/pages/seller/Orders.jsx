import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { getImgSrc } from "../../utils/imgResolver";
import toast from "react-hot-toast";

const statusConfig = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-400", label: "Pending" },
  processing: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400", label: "Processing" },
  shipped: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-400", label: "Ready" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400", label: "Completed" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-400", label: "Cancelled" },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  const cfg = statusConfig[key] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const Orders = () => {
  const { axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => (o.status || "pending").toLowerCase() === filter);

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const paidCount = orders.filter(o => o.isPaid).length;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Customer Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage all orders from your store.</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-sm self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: "🛒", color: "emerald" },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "green" },
          { label: "Paid Orders", value: paidCount, icon: "✅", color: "teal" },
          { label: "Pending Payment", value: orders.length - paidCount, icon: "⏳", color: "amber" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { v: "all", l: "All" },
          { v: "pending", l: "Pending" },
          { v: "processing", l: "Processing" },
          { v: "shipped", l: "Ready" },
          { v: "delivered", l: "Completed" },
          { v: "cancelled", l: "Cancelled" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${filter === f.v
                ? "bg-emerald-600 text-white border-emerald-600 shadow"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
          >
            {f.v === "all" ? `All (${orders.length})` : f.l}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="w-10 h-10 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Order header */}
              <div
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Order ID</p>
                    <p className="font-mono text-xs text-gray-700 font-semibold">#{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Date</p>
                    <p className="text-xs font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Amount</p>
                    <p className="font-black text-emerald-600">₹{order.amount?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={order.status} />
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border ${order.isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
                <div className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order._id && (
                <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50/30">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items?.map((item, j) => (
                        <div key={j} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                            <img
                              src={getImgSrc(item.product?.image?.[0])}
                              alt={item.product?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.product?.offerPrice}</p>
                          </div>
                          <p className="font-black text-gray-900 text-sm">₹{(item.product?.offerPrice * item.quantity)?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-black text-blue-800 uppercase tracking-wider mb-2">📍 Customer Address</p>
                    <p className="font-semibold text-gray-900 text-sm">{order.address?.firstName} {order.address?.lastName}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.zipcode}</p>
                    <p className="text-xs text-gray-600">{order.address?.country}</p>
                    {order.address?.phone && <p className="text-xs text-gray-600 mt-0.5">📞 {order.address.phone}</p>}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-gray-500">Payment: <span className="font-semibold text-gray-700">{order.paymentType || "COD"}</span></p>
                    <p className="text-xs text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-bold text-gray-700 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Orders will appear here as customers place them.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
