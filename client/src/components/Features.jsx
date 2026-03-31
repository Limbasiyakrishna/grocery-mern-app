import { features } from "../assets/assets";

const Features = () => {
    const colors = [
        { bg: "bg-emerald-50", icon: "bg-emerald-100", border: "border-emerald-100", glow: "rgba(5,150,105,0.12)", text: "text-emerald-600" },
        { bg: "bg-teal-50", icon: "bg-teal-100", border: "border-teal-100", glow: "rgba(13,148,136,0.12)", text: "text-teal-600" },
        { bg: "bg-lime-50", icon: "bg-lime-100", border: "border-lime-100", glow: "rgba(132,204,22,0.12)", text: "text-lime-600" },
        { bg: "bg-green-50", icon: "bg-green-100", border: "border-green-100", glow: "rgba(22,163,74,0.12)", text: "text-green-600" },
    ];

    return (
        <div className="my-12 sm:my-16 md:my-20 max-w-7xl mx-auto px-3 sm:px-4 md:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {features.map((feature, index) => {
                const c = colors[index % colors.length];
                return (
                    <div
                        key={index}
                        className={`card-3d group relative flex flex-col items-center text-center p-5 sm:p-7 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border ${c.border} ${c.bg} overflow-hidden cursor-default animate-reveal`}
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        {/* Glow blob */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)`, top: "-1.5rem" }}
                        />

                        {/* 3-D icon box */}
                        <div
                            className={`card-3d-float w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 flex items-center justify-center ${c.icon} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 relative flex-shrink-0`}
                            style={{
                                boxShadow: `0 12px 30px ${c.glow}, inset 0 2px 0 rgba(255,255,255,0.9)`,
                            }}
                        >
                            <img src={feature.icon} alt={feature.title} className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
                            {/* subtle inner shine */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/70 to-transparent" />
                        </div>

                        <h3 className={`text-base sm:text-lg md:text-xl font-black text-slate-800 mb-2 sm:mb-3 md:mb-4 group-hover:${c.text} transition-colors uppercase tracking-widest`}>
                            {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed px-1 sm:px-2">
                            {feature.description}
                        </p>

                        {/* Bottom accent line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 ${c.icon} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />
                    </div>
                );
            })}
            </div>
        </div>
    );
};

export default Features;
