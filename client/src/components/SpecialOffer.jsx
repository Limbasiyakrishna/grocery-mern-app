import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialOffer = () => {
    return (
        <div className="my-12 sm:my-16 md:my-20 lg:my-24 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Card 1: Summer Fresh */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-xl card-3d animate-tilt-in">
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-300/30 rounded-full mix-blend-multiply filter blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-400/40 transition-colors duration-1000" />

                <div className="relative z-10 card-3d-float">
                    <span className="bg-amber-500 text-white text-[9px] sm:text-xs md:text-xs lg:text-sm font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 sm:mb-6 inline-block shadow-lg shadow-amber-500/30">
                        Limited Time
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-[1.1]">
                        Summer Fresh <br />
                        <span className="text-amber-500 drop-shadow-sm">Organic Fruits</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-8 max-w-[250px] font-medium leading-relaxed">
                        Experience the taste of pure nature with our hand-picked exotic fruits collection.
                    </p>
                    <Link
                        to="/products/fruits"
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-black hover:gap-4 hover:shadow-xl hover:text-amber-600 transition-all shadow-md"
                    >
                        Explore <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </div>

                <img
                    src={assets.fresh_fruits_image}
                    alt="Fruits"
                    className="absolute bottom-2 sm:bottom-4 -right-2 sm:-right-4 w-40 sm:w-52 md:w-60 lg:w-64 xl:w-72 h-40 sm:h-52 md:h-60 lg:h-64 xl:h-72 object-contain group-hover:-translate-y-6 group-hover:-translate-x-6 transition-transform duration-1000 rotate-12 drop-shadow-2xl"
                />
            </div>

            {/* Card 2: Veggie Box */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-xl card-3d animate-tilt-in sm:[animation-delay:200ms]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/40 transition-colors duration-1000" />

                <div className="relative z-10 card-3d-float">
                    <span className="bg-emerald-500 text-white text-[9px] sm:text-xs md:text-xs lg:text-sm font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 sm:mb-6 inline-block shadow-lg shadow-emerald-500/30">
                        Best Value
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-3 sm:mb-4 leading-[1.1]">
                        Daily Green <br />
                        <span className="text-emerald-600 drop-shadow-sm">Veggie Box</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-8 max-w-[250px] font-medium leading-relaxed">
                        Everything you need for a healthy week, packed with nutrients and love.
                    </p>
                    <Link
                        to="/products/vegetables"
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-black hover:gap-4 hover:shadow-xl hover:text-emerald-600 transition-all shadow-md"
                    >
                        Shop Now <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </div>

                <img
                    src={assets.organic_vegitable_image}
                    alt="Vegetables"
                    className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 w-44 sm:w-60 md:w-68 lg:w-72 xl:w-80 h-44 sm:h-60 md:h-68 lg:h-72 xl:h-80 object-contain group-hover:-translate-y-6 group-hover:-translate-x-6 transition-transform duration-1000 -rotate-12 drop-shadow-2xl"
                />
            </div>
        </div>
    );
};

export default SpecialOffer;
