import { assets } from "../assets/assets";

const BottomBanner = () => {
    return (
        <div className="my-24 relative overflow-hidden rounded-[2.5rem] min-h-[16rem] md:min-h-[22rem] flex items-center group shadow-2xl card-3d">
            {/* Background Images */}
            <img
                src={assets.bottom_banner_image}
                alt="Promo Banner"
                className="absolute inset-0 w-full h-full object-cover object-[center_left] md:object-center hidden md:block group-hover:scale-105 transition-transform duration-1000"
            />
            <img
                src={assets.bottom_banner_image_sm}
                alt="Promo Banner"
                className="absolute inset-0 w-full h-full object-cover object-[80%_center] md:hidden group-hover:scale-105 transition-transform duration-1000"
            />

            {/* Gradient Overlay directed towards the right side where text will live */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Content Container aligned to right */}
            <div className="relative z-10 w-full md:w-[55%] ml-auto px-6 md:px-12 py-10 flex flex-col items-center md:items-start text-center md:text-left card-3d-float mt-auto md:mt-0">
                <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-lg shadow-orange-500/30">
                    Special Offer
                </span>

                <h2 className="text-3xl md:text-5xl font-black mb-3 text-white drop-shadow-xl leading-tight">
                    Get <span className="text-orange-400">20% OFF!</span>
                </h2>

                <p className="text-sm md:text-lg mb-6 text-gray-200 font-medium">
                    On your first order. Use code: <br className="md:hidden" />
                    <span className="inline-block mt-2 md:mt-0 font-black bg-white/10 border border-white/20 px-3 py-1 rounded-xl backdrop-blur-md ml-1 text-orange-400 shadow-inner">
                        FIRSTGROCERY
                    </span>
                </p>

                <button className="bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-black hover:bg-orange-50 hover:text-orange-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 drop-shadow-lg flex items-center gap-2">
                    Claim Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </div>
    );
};

export default BottomBanner;
