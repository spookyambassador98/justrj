"use client";

/** Quiet luxury atmosphere — site palette, almost still. */
export default function LivingBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 15%, transparent 72%)",
        }}
      />

      <div className="absolute -left-[18%] top-[-12%] h-[48vw] w-[48vw] rounded-full bg-white/[0.035] blur-[120px]" />
      <div className="absolute -right-[12%] bottom-[-18%] h-[42vw] w-[42vw] rounded-full bg-blue-500/[0.04] blur-[130px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.88)_72%)]" />
    </div>
  );
}
