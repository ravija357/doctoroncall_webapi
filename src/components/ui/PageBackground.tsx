"use client";

/**
 * PageBackground — Pure CSS ambient orbs.
 * Zero WebGL, zero canvas, zero performance cost.
 * Replaces Background3D for all interior pages.
 */
export default function PageBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50/40" />

      {/* Ambient orb — top right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(112,192,250,0.18) 0%, transparent 70%)",
          animation: "pulse-slow 8s ease-in-out infinite",
        }}
      />

      {/* Ambient orb — bottom left */}
      <div
        className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(112,192,250,0.12) 0%, transparent 70%)",
          animation: "pulse-slow 10s ease-in-out infinite reverse",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.4; }
          50% { transform: scale(1.08) translate(-12px, 8px); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
