export default function CouponTicket({
  title = "Foodmandu Voucher",
  brand = "foodmandu", // daraz | worldlink | himalayan_java | foodmandu
  tier = 2, // novice | bronze | silver | gold | platinum | diamond
  discount = "20% OFF",
  expiry = "30 Mar 2026",
  code = "",
}) {
  // Background Color Map by partner brand
  const brandColors = {
    daraz: "#f97316", // orange
    worldlink: "#2563eb", // blue
    himalayan_java: "#c4a484", // light brown
    foodmandu: "#eab308", // yellow
  };

  const backgroundColor = brandColors[brand] ?? brandColors.foodmandu;

  // Border Color Map by tier
  const tierBorders = {
    1: backgroundColor,
    2: "#cd7f32",
    3: "#c0c0c0",
    4: "#facc15",
    5: "#67e8f9",
    6: "#7c3aed",
  };

  const borderColor = tierBorders[tier];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <div
        className="rounded-3xl p-7 text-white border-5"
        style={{ borderColor, background: backgroundColor }}
      >
        {/* Flowing animated shine */}
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.75),transparent)] animate-[flow_5s_linear_infinite] " />

        {/* ===== LEFT CUTOUT ===== */}
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#020617] rounded-full" />

        <div
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-5"
          style={{ borderColor }}
        />

        {/* ===== RIGHT CUTOUT ===== */}
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#020617] rounded-full" />
        <div
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-5"
          style={{ borderColor }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold tracking-wide truncate max-w-[70%]">
              {title}
            </h2>
            <span className="uppercase text-lg tracking-widest opacity-80">
              Tier {tier}
            </span>
          </div>

          <div className="text-4xl font-semibold tracking-wider">
            {discount}
          </div>
          <div className="flex justify-between mt-6">
            <div className="flex justify-between text-sm opacity-90 mt-1 gap-2">
              <span>Valid until</span>
              <span className="font-semibold">{expiry}</span>
            </div>
            <div className="text-center flex gap-2 items-center">
              <span className="font-semibold">Code:</span>
              <div className="bg-white/20 flex items-center justify-center rounded-lg text-lg px-2">
                <p>{code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flow {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
}
