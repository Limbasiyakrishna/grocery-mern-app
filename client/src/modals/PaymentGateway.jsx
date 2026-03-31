import { useState, useEffect } from "react";
import axios from "axios";

const PaymentGateway = ({ cartData, onPaymentSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("dummy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [dummySubMethod, setDummySubMethod] = useState("none"); // none, qr, card
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  // Initialize PhonePe - No script needed, handled server-side


  // Handle Dummy Payment (For Testing)
  const handleDummyPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post("/api/payment/dummy/create-order", {
        userId: cartData.userId,
        items: cartData.items,
        addressId: cartData.selectedAddress,
        coupon: cartData.appliedCoupon,
        amount: cartData.totalAmount,
        subtotal: cartData.subtotal,
        taxValue: cartData.taxAmount,
        platformFee: cartData.platformFee,
      });

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Simulate a verification step
      const verifyResponse = await axios.post("/api/payment/dummy/verify", {
        orderId: data.orderId,
      });

      if (verifyResponse.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(data.orderId, "DUMMY");
        }, 1500);
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      setError("Failed to process dummy payment");
      // Silent
    } finally {
      setLoading(false);
    }
  };


  // Handle COD Payment
  const handleCODPayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/payment/cod", {
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
        onPaymentSuccess(data.orderId, "COD");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create COD order");
      // Silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Choose Payment Method</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}


        {/* Payment Method Selection */}
        <div className="p-4 sm:p-6">
          {/* Success Message for Dummy */}
          {showSuccess && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-600">Testing mode: Order processed successfully.</p>
              <div className="animate-pulse text-green-500 font-medium">Redirecting...</div>
            </div>
          )}

          {/* Payment Method Cards */}
          {!showSuccess && (
            <div className="space-y-4">
              <div
                className={`border-2 rounded-2xl p-5 sm:p-6 cursor-pointer transition ${
                  paymentMethod === "dummy"
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => {
                  setPaymentMethod("dummy");
                  setError("");
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "dummy" ? "border-amber-600" : "border-gray-300"
                  }`}>
                    {paymentMethod === "dummy" && <div className="w-3 h-3 bg-amber-600 rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        Test/Dummy Payment
                      </h3>
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Sandbox
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Simulate a successful order without real money.
                    </p>

                    {/* Sub-options for Dummy */}
                    {paymentMethod === "dummy" && (
                      <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDummySubMethod("qr"); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition ${
                              dummySubMethod === "qr" ? "bg-amber-600 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            Scan QR
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDummySubMethod("card"); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition ${
                              dummySubMethod === "card" ? "bg-amber-600 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            Dummy Card
                          </button>
                        </div>

                        {/* Dummy QR View */}
                        {dummySubMethod === "qr" && (
                          <div className="bg-white p-4 rounded-xl border border-amber-200 text-center">
                            <div className="w-40 h-40 mx-auto bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-amber-300 mb-2 overflow-hidden">
                              <img src="/dummy_qr.png" alt="Dummy QR" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[10px] text-amber-800 font-medium">Scan any dummy app to complete</p>
                          </div>
                        )}

                        {/* Dummy Card View */}
                        {dummySubMethod === "card" && (
                          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                            <div>
                                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Card Number</label>
                                <input 
                                  type="text" 
                                  placeholder="4242 4242 4242 4242" 
                                  className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-mono"
                                  value={cardDetails.number}
                                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Expiry</label>
                                    <input 
                                      type="text" 
                                      placeholder="MM/YY" 
                                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">CVV</label>
                                    <input 
                                      type="password" 
                                      placeholder="***" 
                                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COD Option */}
              <div
                onClick={() => {
                  setPaymentMethod("cod");
                  setError("");
                }}
                className={`border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cod" ? "border-green-600" : "border-gray-300"
                  }`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Cash on Delivery
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Pay when you receive your order
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        No Advance Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-6">
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{cartData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>₹{cartData.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee:</span>
                    <span>₹{cartData.platformFee.toFixed(2)}</span>
                  </div>
                  {cartData.appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{cartData.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      ₹{cartData.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (paymentMethod === "cod") {
                      handleCODPayment();
                    } else if (paymentMethod === "dummy") {
                      handleDummyPayment();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition disabled:bg-gray-400 text-sm sm:text-base"
                >
                  {loading ? "Processing..." : "Proceed"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
