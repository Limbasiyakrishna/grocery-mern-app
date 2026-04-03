import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Payment Gateway Modal Component
 * Handles dummy payment processing for testing purposes
 * Supports both dummy online payment and Cash on Delivery options
 */
const PaymentGateway = ({ cartData, onPaymentSuccess, onClose }) => {
  // State for payment method selection
  const [paymentMethod, setPaymentMethod] = useState("dummy");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Success state for showing confirmation
  const [showSuccess, setShowSuccess] = useState(false);

  // Sub-method for dummy payment (QR, card, UPI simulation)
  const [dummySubMethod, setDummySubMethod] = useState("none");

  // Dummy card details (for UI simulation only)
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });

  // UPI ID for UPI payments
  const [upiId, setUpiId] = useState("");

  // Generate QR code data URL
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Generate QR code when QR method is selected
  useEffect(() => {
    if (dummySubMethod === "qr") {
      // Generate a QR code for a dummy UPI payment URL
      const upiUrl = `upi://pay?pa=dummy@freshnest&pn=FreshNest&am=${cartData.totalAmount}&cu=INR&tn=Order Payment`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
      setQrCodeUrl(qrApiUrl);
    }
  }, [dummySubMethod, cartData.totalAmount]);

  /**
   * Formats card number with spaces
   */
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  /**
   * Formats expiry date
   */
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  /**
   * Handles dummy payment processing
   * Creates order and verifies payment through backend APIs
   */
  const handleDummyPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate basic cart/order fields
      if (!cartData?.userId || !cartData?.items?.length || !cartData?.selectedAddress) {
        setError("Missing required fields: user, items or delivery address.");
        setLoading(false);
        return;
      }

      // Validate dummy details when using dummy payment method
      if (paymentMethod === "dummy") {
        if (dummySubMethod === "upi") {
          if (!upiId || !upiId.includes("@")) {
            setError("Please enter a valid UPI ID (e.g., user@bank).");
            setLoading(false);
            return;
          }
        }

        if (dummySubMethod === "card") {
          const cardNumberClean = cardDetails.number.replace(/\s+/g, "");
          if (
            cardNumberClean.length < 16 ||
            !cardDetails.name ||
            cardDetails.expiry.length !== 5 ||
            cardDetails.cvv.length < 3
          ) {
            setError("Please fill in all card details correctly (number, name, expiry, cvv).");
            setLoading(false);
            return;
          }
        }

        if (dummySubMethod === "none") {
          setError("Please select a dummy payment submethod: UPI QR, UPI ID, or Card.");
          setLoading(false);
          return;
        }
      }

      // Determine payment type based on selection
      const paymentType = paymentMethod === "cod" ? "COD" : "DUMMY";

      // Create order through backend API
      const { data } = await axios.post("/api/payment/dummy/create-order", {
        userId: cartData.userId,
        items: cartData.items,
        addressId: cartData.selectedAddress,
        coupon: cartData.appliedCoupon,
        amount: cartData.totalAmount,
        subtotal: cartData.subtotal,
        taxValue: cartData.taxAmount,
        platformFee: cartData.platformFee,
        paymentType,
      });

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Verify payment through backend API
      const verifyResponse = await axios.post("/api/payment/dummy/verify", {
        orderId: data.orderId,
      });

      if (verifyResponse.data.success) {
        // Show success message and redirect after delay
        setShowSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(data.orderId, paymentType);
        }, 1500);
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      setError("Failed to process payment");
      console.error("Payment error:", err);
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
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDummySubMethod("qr"); }}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                              dummySubMethod === "qr" ? "bg-amber-600 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            📱 UPI QR
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDummySubMethod("upi"); }}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                              dummySubMethod === "upi" ? "bg-amber-600 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            💳 UPI ID
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDummySubMethod("card"); }}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                              dummySubMethod === "card" ? "bg-amber-600 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            💳 Card
                          </button>
                        </div>

                        {/* UPI QR View */}
                        {dummySubMethod === "qr" && (
                          <div className="bg-white p-4 rounded-xl border border-amber-200 text-center">
                            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 mb-3 overflow-hidden shadow-lg">
                              {qrCodeUrl ? (
                                <img
                                  src={qrCodeUrl}
                                  alt="UPI QR Code"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5VUEgUVIgQ29kZTwvdGV4dD4KPC9zdmc+";
                                  }}
                                />
                              ) : (
                                <div className="text-gray-400 text-sm">Generating QR...</div>
                              )}
                            </div>
                            <p className="text-xs text-amber-800 font-medium mb-2">Scan with any UPI app to pay</p>
                            <div className="text-[10px] text-gray-500 bg-gray-50 p-2 rounded">
                              Amount: ₹{cartData.totalAmount.toFixed(2)}<br/>
                              UPI ID: dummy@freshnest
                            </div>
                          </div>
                        )}

                        {/* UPI ID View */}
                        {dummySubMethod === "upi" && (
                          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-2">Enter UPI ID</label>
                              <input
                                type="text"
                                placeholder="user@upi"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                              <p className="text-[10px] text-gray-500 mt-1">Example: user@paytm, user@ybl, user@oksbi</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                              <p className="text-xs text-amber-800 font-medium">
                                💰 Amount: ₹{cartData.totalAmount.toFixed(2)}
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                Payment will be processed instantly
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Enhanced Card View */}
                        {dummySubMethod === "card" && (
                          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-4">
                            {/* Card Preview */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                              <div className="flex justify-between items-start mb-8">
                                <div className="text-xs opacity-80">Dummy Card</div>
                                <div className="text-lg font-bold">💳</div>
                              </div>
                              <div className="mb-4">
                                <div className="text-lg font-mono tracking-wider">
                                  {cardDetails.number || "•••• •••• •••• ••••"}
                                </div>
                              </div>
                              <div className="flex justify-between items-end">
                                <div>
                                  <div className="text-xs opacity-80 mb-1">CARDHOLDER NAME</div>
                                  <div className="text-sm font-medium">
                                    {cardDetails.name || "JOHN DOE"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs opacity-80 mb-1">VALID THRU</div>
                                  <div className="text-sm font-medium">
                                    {cardDetails.expiry || "MM/YY"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Form */}
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Card Number</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                  value={cardDetails.number}
                                  onChange={(e) => setCardDetails({
                                    ...cardDetails,
                                    number: formatCardNumber(e.target.value)
                                  })}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Cardholder Name</label>
                                <input
                                  type="text"
                                  placeholder="JOHN DOE"
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm uppercase focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                  value={cardDetails.name}
                                  onChange={(e) => setCardDetails({
                                    ...cardDetails,
                                    name: e.target.value.toUpperCase()
                                  })}
                                />
                              </div>
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-xs font-semibold text-gray-700 block mb-1">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({
                                      ...cardDetails,
                                      expiry: formatExpiry(e.target.value)
                                    })}
                                  />
                                </div>
                                <div className="w-24">
                                  <label className="text-xs font-semibold text-gray-700 block mb-1">CVV</label>
                                  <input
                                    type="password"
                                    placeholder="123"
                                    maxLength="4"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({
                                      ...cardDetails,
                                      cvv: e.target.value.replace(/[^0-9]/g, '')
                                    })}
                                  />
                                </div>
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
                  onClick={handleDummyPayment}
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
