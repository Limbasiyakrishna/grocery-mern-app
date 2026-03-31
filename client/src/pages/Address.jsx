import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Address = () => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    addressType: "Home"
  });
  
  const { axios, user, navigate } = useContext(AppContext);
  
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success("🏠 Address saved successfully!");
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user]);

  return (
    <div className="mt-8 sm:mt-10 md:mt-12 min-h-[80vh] flex items-center justify-center py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl md:rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Illustration & Info */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
                <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block text-center md:text-left">Secure Checkout</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-center md:text-left">
                    Where should we <span className="text-emerald-400 font-serif italic">Deliver?</span>
                </h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10 text-center md:text-left">
                    Your fresh groceries are just one step away. Provide your address details for a seamless farm-to-table experience.
                </p>
                
                <div className="hidden md:block">
                    <img
                        src={assets.add_address_iamge}
                        alt="Address"
                        className="w-full max-w-xs mx-auto mix-blend-screen opacity-80 animate-float"
                    />
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-14 bg-white relative">
          <form onSubmit={submitHandler} className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={address.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={address.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={address.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street / House No.</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                className="input-field"
                placeholder="123 Green Street, Apt 4B"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="San Francisco"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="California"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                <input
                  type="number"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10001"
                  required
                />
              </div>

              <div className="space-y-1.5 col-span-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="number"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Save & Continue to Payment
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Address;
