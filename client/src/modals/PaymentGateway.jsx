import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * Payment Gateway Modal Component
 * Handles Razorpay payment processing and Cash on Delivery
 */
const PaymentGateway = ({ cartData, onPaymentSuccess, onClose }) => {
  // State for payment method selection
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Success state for showing confirmation
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Loads Razorpay script dynamically
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Handles payment processing
   */
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate basic cart/order fields
      if (!cartData?.userId || !cartData?.items?.length || !cartData?.selectedAddress) {
        setError("Missing required fields: user, items or delivery address.");
        setLoading(false);
        return;
      }

      if (paymentMethod === "cod") {
        // Handle Cash on Delivery
        const { data } = await axios.post("/api/payment/cod/create-order", {
          userId: cartData.userId,
          items: cartData.items,
          addressId: cartData.selectedAddress,
          coupon: cartData.appliedCoupon,
          amount: cartData.totalAmount,
          subtotal: cartData.subtotal,
          taxValue: cartData.taxAmount,
          platformFee: cartData.platformFee,
        });

        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => {
            onPaymentSuccess(data.orderId, "COD");
          }, 1500);
        } else {
          setError(data.message || "Failed to place COD order");
        }
      } else {
        // Handle Razorpay Online Payment
        const res = await loadRazorpayScript();

        if (!res) {
          setError("Razorpay SDK failed to load. Are you online?");
          setLoading(false);
          return;
        }

        // Create order in backend
        const { data: orderData } = await axios.post("/api/payment/razorpay/create-order", {
          userId: cartData.userId,
          items: cartData.items,
          addressId: cartData.selectedAddress,
          coupon: cartData.appliedCoupon,
          amount: cartData.totalAmount,
          subtotal: cartData.subtotal,
          taxValue: cartData.taxAmount,
          platformFee: cartData.platformFee,
          paymentType: "RAZORPAY",
        });

        if (!orderData.success) {
          setError(orderData.message || "Failed to create Razorpay order");
          setLoading(false);
          return;
        }

        // Open Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "FreshNest Grocery",
          description: "Order Payment",
          order_id: orderData.razorpayOrderId,
          handler: async (response) => {
            try {
              setLoading(true);
              const { data: verifyData } = await axios.post("/api/payment/razorpay/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              });

              if (verifyData.success) {
                setShowSuccess(true);
                setTimeout(() => {
                  onPaymentSuccess(orderData.orderId, "RAZORPAY");
                }, 1500);
              } else {
                setError(verifyData.message || "Payment verification failed");
              }
            } catch (err) {
              setError("Verification failed");
              console.error(err);
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: "", // You can fill this if you have user info in cartData
            email: "",
            contact: "",
          },
          notes: {
            address: "FreshNest Official",
          },
          theme: {
            color: "#10b981", // Emerald 500
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (err) {
      setError("Failed to process payment");
      console.error("Payment error:", err);
    } finally {
      if (paymentMethod === "cod") {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold">Secure Checkout</h2>
            <p className="text-emerald-100 text-sm opacity-90">Complete your purchase securely</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in scale-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-600 text-lg">Your order has been placed and confirmed.</p>
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold pt-4">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></div>
                <span>Redirecting you...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select Payment Method</label>
                
                {/* Razorpay Option */}
                <div
                  className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    paymentMethod === "online"
                      ? "border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-50"
                      : "border-gray-100 bg-gray-50 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("online")}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online" ? "border-emerald-600" : "border-gray-300"
                    }`}>
                      {paymentMethod === "online" && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">Online Payment</span>
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Secure</span>
                      </div>
                      <p className="text-gray-500 text-sm">Pay via UPI, Cards, NetBanking or Wallets</p>
                    </div>
                    <div className="flex gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 opacity-70" />
                    </div>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    paymentMethod === "cod"
                      ? "border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-50"
                      : "border-gray-100 bg-gray-50 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-emerald-600" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-bold text-gray-800">Cash on Delivery</span>
                      <p className="text-gray-500 text-sm">Pay in cash when your order is delivered</p>
                    </div>
                    <div className="text-2xl">💵</div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax & Fees</span>
                    <span>₹{(cartData.taxAmount + cartData.platformFee).toFixed(2)}</span>
                  </div>
                  {cartData.appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{cartData.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-2">
                    <span className="text-base font-bold text-gray-800">Total Payable</span>
                    <span className="text-2xl font-black text-emerald-600">₹{cartData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay ₹{cartData.totalAmount.toFixed(2)}</span>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">100% SECURE & ENCRYPTED PAYMENTS</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
