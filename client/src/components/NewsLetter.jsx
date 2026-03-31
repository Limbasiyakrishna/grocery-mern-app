import toast from "react-hot-toast";

const NewsLetter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully! Check your email soon.");
  };

  return (
    <div className="my-12 sm:my-16 md:my-20 lg:my-24 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col items-center justify-center text-center shadow-2xl card-3d">
      {/* Decorative Background Effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-400/40 rounded-full mix-blend-screen filter blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-300/40 rounded-full mix-blend-screen filter blur-[80px] translate-x-1/2 translate-y-1/2" />

      {/* Radial overlay for texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 card-3d-float max-w-3xl mx-auto w-full">
        {/* Mail Icon */}
        <div className="w-12 sm:w-14 md:w-16 lg:w-18 h-12 sm:h-14 md:h-16 lg:h-18 bg-white/10 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
          <svg className="w-6 sm:w-7 md:w-8 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-9 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-white mb-3 sm:mb-4 drop-shadow-md leading-tight">
          Never Miss a Deal!
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-emerald-50 mb-8 sm:mb-10 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-sm">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts delivered straight to your inbox.
        </p>

        {/* Input Form pill */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto w-full bg-white/10 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl lg:rounded-full border border-white/20 backdrop-blur-md shadow-inner">
          <input
            className="flex-1 bg-transparent border-none outline-none w-full px-3 sm:px-6 py-2.5 sm:py-3 text-white placeholder-emerald-100/70 font-medium text-xs sm:text-sm md:text-base h-full text-center sm:text-left"
            type="email"
            placeholder="Enter your email address..."
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 text-emerald-700 font-black text-xs sm:text-sm md:text-base bg-white hover:bg-emerald-50 rounded-2xl sm:rounded-3xl lg:rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            Subscribe Now
              <svg className="w-4 sm:w-5 h-4 sm:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewsLetter;
