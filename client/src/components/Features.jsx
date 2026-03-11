import { features } from "../assets/assets";

const Features = () => {
    const colors = [
        { bg: "bg-emerald-50", icon: "bg-emerald-100", border: "border-emerald-100", glow: "rgba(5,150,105,0.12)", text: "text-emerald-600" },
        { bg: "bg-teal-50", icon: "bg-teal-100", border: "border-teal-100", glow: "rgba(13,148,136,0.12)", text: "text-teal-600" },
        { bg: "bg-lime-50", icon: "bg-lime-100", border: "border-lime-100", glow: "rgba(132,204,22,0.12)", text: "text-lime-600" },
        { bg: "bg-green-50", icon: "bg-green-100", border: "border-green-100", glow: "rgba(22,163,74,0.12)", text: "text-green-600" },
    ];

    return (
        <div className="my-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
                const c = colors[index % colors.length];
                return (
                    <div
                        key={index}
                        className={`card-3d group relative flex flex-col items-center text-center p-8 rounded-3xl border ${c.border} ${c.bg} overflow-hidden cursor-default`}
                        style={{ animationDelay: `${index * 120}ms` }}
                    >
                        {/* Glow blob */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)`, top: "-2rem" }}
                        />

                        {/* 3-D icon box */}
                        <div
                            className={`card-3d-float w-20 h-20 flex items-center justify-center ${c.icon} rounded-2xl mb-5 relative`}
                            style={{
                                boxShadow: `0 8px 24px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
                            }}
                        >
                            <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
                            {/* subtle inner shine */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent" />
                        </div>

                        <h3 className={`text-lg font-black text-gray-800 mb-2 group-hover:${c.text} transition-colors`}>
                            {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {feature.description}
                        </p>

                        {/* Bottom accent line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${c.icon} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                    </div>
                );
            })}
        </div>
    );
};

export default Features;
