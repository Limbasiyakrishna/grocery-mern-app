import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const Category = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 overflow-hidden relative py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 group/cat">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-teal-100/40 rounded-full blur-[100px] animate-float-slow" style={{ animationDirection: 'reverse' }} />

      <div className="max-w-7xl mx-auto flex items-end justify-between mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative z-10 px-2 flex-col md:flex-row gap-4 md:gap-0">
        <div className="animate-reveal w-full md:w-auto">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-2 sm:mb-3 block">Discover Freshness</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tighter leading-none text-center md:text-left">
            Shop by <span className="text-emerald-600">Category</span>
          </h2>
        </div>
        
        <div className="flex md:hidden items-center gap-2 justify-center w-full mb-4 md:mb-0">
           <div className="cat-prev flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer active:scale-90">
             <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
           </div>
           <div className="cat-next flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer active:scale-90">
             <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
           <div className="cat-prev flex items-center justify-center w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer active:scale-90">
             <svg className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
           </div>
           <div className="cat-next flex items-center justify-center w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer active:scale-90">
             <svg className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
           </div>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, FreeMode, Navigation]}
        freeMode={true}
        spaceBetween={24}
        slidesPerView="auto"
        navigation={{
            prevEl: '.cat-prev',
            nextEl: '.cat-next'
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        className="pb-6 sm:pb-8 md:pb-10 lg:pb-12 px-2 sm:px-4 md:px-0 !overflow-visible relative z-10"
      >
        {categories.map((category, index) => (
          <SwiperSlide 
            key={index} 
            className="!w-40 sm:!w-44 md:!w-48 lg:!w-56 xl:!w-64 animate-reveal"
          >
            <div
              className="group cursor-pointer perspective-1000 h-full py-2 sm:py-3 md:py-4 px-1.5 sm:px-2"
              onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                window.scrollTo(0, 0);
              }}
            >
              <div
                className="relative p-4 sm:p-5 md:p-6 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden h-28 sm:h-36 md:h-44 lg:h-52 xl:h-56 border border-white/60 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 active:scale-95"
                style={{ backgroundColor: `${category.bgColor}` }}
              >
                 {/* Glass overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/40 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110 mb-2 sm:mb-3 md:mb-4 h-16 sm:h-20 md:h-24 lg:h-28 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5 w-full">
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-slate-800 text-center leading-tight uppercase tracking-widest px-0.5 sm:px-1">
                    {category.text}
                  </p>
                  <span className="w-4 sm:w-5 md:w-6 h-0.5 sm:h-1 bg-slate-900/10 rounded-full group-hover:w-8 sm:group-hover:w-10 md:group-hover:w-12 group-hover:bg-emerald-600 transition-all"></span>
                </div>

                {/* Badge */}
                {index < 3 && (
                  <div className="absolute top-2 sm:top-2.5 md:top-3 right-2 sm:right-2.5 md:right-3 bg-white/90 text-[7px] sm:text-[8px] md:text-xs font-black text-emerald-700 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-lg shadow-lg z-20 scale-90 group-hover:scale-105 transition-transform border border-emerald-50">
                    NEW
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Category;
