import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getImgSrc } from "../utils/imgResolver";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
    setShowUserLogin,
  } = useAppContext();

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      // place order with cod
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Online payment is currently unavailable. Please use COD.");
      }

    } catch (error) {
      toast.error(error.message);
    }
  };
  if (products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center animate-pulse">
        <div className="w-20 h-20 bg-emerald-100 rounded-full mb-6"></div>
        <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return cartItems ? (

    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-emerald-500">{cartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/product/${product.category}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded cusror-pointer"
              >
                <img
                  className="max-w-full h-full object-contain mix-blend-multiply"
                  src={getImgSrc(product.image[0])}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      value={cartItems[product._id]}
                      className="outline-none"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              ₹{product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#FF532E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-emerald-500 font-medium"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>

        {/* Collaborative Cart / Share Section */}
        <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👥</span>
            <h3 className="font-bold text-slate-800">Collaborative Shopping</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-medium">
            Sharing is caring! Copy your cart link to let family or friends add their favorite groceries.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={`freshnest.app/cart/share/${user?._id || 'guest'}`}
              className="bg-white border border-emerald-200 text-xs px-4 py-3 rounded-xl flex-1 outline-none text-slate-500 font-medium"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`freshnest.app/cart/share/${user?._id || 'guest'}`);
                toast.success("Cart link copied to clipboard!");
              }}
              className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-md shadow-emerald-200"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[360px] w-full bg-white p-7 max-md:mt-16 rounded-3xl border border-gray-100 shadow-xl self-start">
        <h2 className="text-xl md:text-2xl font-black text-gray-900">Order Summary</h2>
        <hr className="border-gray-100 my-5" />
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No Address Found"}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  setShowUserLogin(true);
                } else {
                  setShowAddress(!showAddress);
                }
              }}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-xs cursor-pointer ml-2 bg-emerald-50 px-2 py-1 rounded-lg z-20"
            >
              {user ? "Change" : "Login"}
            </button>
            {showAddress && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-2xl rounded-2xl text-sm w-72 z-[100] overflow-hidden">
                {address.length > 0 ? (
                  address.map((addr, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="text-gray-600 font-medium p-4 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer border-b border-gray-50 transition-colors"
                    >
                      {addr.street}, {addr.city}, {addr.state}, {addr.country}
                    </p>
                  ))
                ) : (
                  <p className="p-4 text-gray-400 italic text-center">No addresses saved</p>
                )}
                <p
                  onClick={() => {
                    navigate("/add-address");
                    setShowAddress(false);
                  }}
                  className="text-emerald-600 font-bold text-center cursor-pointer p-4 hover:bg-emerald-50 bg-gray-50/50"
                >
                  + Add New Address
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-6 mb-2">Payment Method</p>

          <div className="relative">
            <select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full bg-gray-50 font-semibold text-gray-700 border border-gray-200 rounded-2xl px-4 py-3 outline-none appearance-none cursor-pointer hover:border-emerald-300 transition-all z-10"
            >
              <option value="COD">Cash On Delivery (COD)</option>
              <option value="Online">Online Payment</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 my-5" />

        <div className="text-gray-500 mt-4 space-y-3 font-medium text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-gray-900 font-bold">₹{totalCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-emerald-600 font-bold">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span className="text-gray-900 font-bold">₹{((totalCartAmount() * 2) / 100).toFixed(2)}</span>
          </p>
          <hr className="border-gray-100 my-3" />
          <p className="flex justify-between text-xl font-black text-gray-900 pt-2">
            <span>Total</span>
            <span className="text-emerald-600">₹{(totalCartAmount() + (totalCartAmount() * 2) / 100).toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="btn-primary w-full mt-8 shadow-xl hover:shadow-2xl"
        >
          {paymentOption === "COD" ? "Place Order (COD)" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};
export default Cart;
