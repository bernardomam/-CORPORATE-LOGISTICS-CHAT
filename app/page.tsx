import Link from "next/link";

export default function SplashPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a1a6e] via-[#0d2090] to-[#1530b8] flex justify-center">
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#1d3fd8]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[55%] h-[480px] w-[480px] rounded-full bg-[#2a4df0]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-[-120px] h-[380px] w-[520px] rounded-[50%] bg-[#0a1a6e]/70 blur-2xl" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#2f5bff]/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-6 pt-32 pb-10 flex flex-col items-center text-center min-h-screen">
        <div className="animar-crescer">
          <div className="w-24 h-24 shrink-0 rounded-[26px] bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.6L5 21l4.2-2c.9.2 1.8.3 2.8.3 5 0 9-3.6 9-8.3S17 3 12 3z"
                fill="white"
              />
              <path
                d="M8.5 11.3l2.4 2.4 4.6-4.6"
                stroke="#4338ca"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-4 text-5xl tracking-tight">
          <span className="font-semibold text-white">call</span>
          <span className="font-extrabold text-[#5b6cff]">ZUP</span>
        </h1>

        <p className="mt-5 text-sm text-blue-100/80">
          Comunicação simples,
          <br />
          segura e eficiente.
        </p>

        <div className="flex-1" />

        <Link
          href="/login"
          className="w-full rounded-2xl bg-gradient-to-r from-[#3d4ff0] to-[#4f5cf5] py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition duration-150 active:scale-90"
        >
          Começar
        </Link>
      </div>
    </main>
  );
}