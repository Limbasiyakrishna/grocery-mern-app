import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const Category = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-20 overflow-hidden relative">
      <div className="flex items-center justify-between mb-10 px-4 md:px-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Browse Categories
          </h2>
          <p className="text-gray-500 mt-2">Find the freshest ingredients for your next meal</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full font-bold text-gray-600 hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm"
        >
          View All Products
          <span>→</span>
        </button>
      </div>

      <Swiper
        modules={[Autoplay, FreeMode]}
        freeMode={true}
        spaceBetween={24}
        slidesPerView="auto"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="pb-10 px-4 md:px-0"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index} className="!w-auto max-w-[150px] sm:max-w-[180px]">
            <div
              className="group cursor-pointer card-3d h-full"
              onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0, 0);
              }}
            >
              <div
                className="relative p-5 sm:p-6 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center gap-3 overflow-hidden h-full"
                style={{ backgroundColor: category.bgColor }}
              >
                <div className="card-3d-float relative z-10 transition-transform duration-500 group-hover:scale-110 mb-2">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                    style={{ filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.15))" }}
                  />
                </div>
                <p className="relative z-10 text-xs sm:text-sm font-black text-gray-800 text-center leading-tight">
                  {category.text}
                </p>

                {/* Special Tag for some categories */}
                {index === 0 && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[8px] font-black text-emerald-600 px-2.5 py-1 rounded-full shadow-sm z-20">
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
