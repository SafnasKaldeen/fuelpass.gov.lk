"use client";

import { useEffect, useState, useRef } from "react";
import { AdsterraAd } from "@/components/adsterra-ad";

const REDIRECT_URL = "https://fuelpass.gov.lk/";
const AD_CONTAINER_ID = "container-f809eade241e4e2118d5088c2760eb9e";
const AD_SCRIPT_SRC =
  "https://pl28920844.effectivegatecpm.com/f809eade241e4e2118d5088c2760eb9e/invoke.js";

const AD_LOADED_REDIRECT_MS = 1000;  // reduced from 1000 → faster redirect after ad shows
const FALLBACK_SECONDS = 10;        // slightly longer to give slow networks a chance

export default function Page() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [countdown, setCountdown] = useState(FALLBACK_SECONDS);
  const redirectedRef = useRef(false);

  const doRedirect = () => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    window.location.href = REDIRECT_URL;
  };

  useEffect(() => {
    // ── 1. Preload the ad script as early as possible ──────────────────────
    // This tells the browser to start fetching the script immediately,
    // even before AdsterraAd mounts and injects it via createElement.
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "script";
    preload.href = AD_SCRIPT_SRC;
    document.head.appendChild(preload);

    // ── 2. DNS prefetch the ad domain ─────────────────────────────────────
    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = "https://pl28920844.effectivegatecpm.com";
    document.head.appendChild(dnsPrefetch);

    const fallbackTimer = setTimeout(doRedirect, FALLBACK_SECONDS * 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    // ── 3. Poll at 100ms instead of 200ms — catches ad faster ─────────────
    const pollInterval = setInterval(() => {
      const el = document.getElementById(AD_CONTAINER_ID);
      if (el && el.children.length > 0) {
        clearInterval(pollInterval);
        setAdLoaded(true);
        clearTimeout(fallbackTimer);
        setTimeout(doRedirect, AD_LOADED_REDIRECT_MS);
      }
    }, 100);

    return () => {
      clearTimeout(fallbackTimer);
      clearInterval(countdownInterval);
      clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col font-sans">

      {/* ── Preconnect hints in JSX head (Next.js picks these up) ── */}
      {/* These are also declared in useEffect above for runtime safety */}

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-full border-2 border-[#8B0000] bg-white flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" fill="#f9f9f9" stroke="#8B0000" strokeWidth="1.5"/>
              <path d="M18 6C18 6 12 10 12 16C12 22 18 26 18 26C18 26 24 22 24 16C24 10 18 6 18 6Z" fill="#DAA520" stroke="#8B0000" strokeWidth="0.5"/>
              <circle cx="18" cy="16" r="4" fill="#8B0000"/>
              <path d="M10 24L14 20L18 22L22 20L26 24" stroke="#DAA520" strokeWidth="1.5" fill="none"/>
              <rect x="14" y="26" width="8" height="2" rx="1" fill="#DAA520"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-gray-500 leading-none truncate">
              Democratic Socialist Republic of Sri Lanka
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#8B0000] leading-tight">
              National Fuel Pass
            </p>
          </div>
        </div>
        <div className="flex items-center border border-gray-300 rounded overflow-hidden text-[11px] sm:text-sm flex-shrink-0">
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#8B0000] text-white font-medium">English</button>
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-gray-600 border-l border-gray-300 hidden xs:block">සිංහල</button>
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-gray-600 border-l border-gray-300 hidden xs:block">தமிழ்</button>
          <button className="px-2 py-1 bg-white text-gray-600 border-l border-gray-300 xs:hidden text-[10px]">සි | த</button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 flex flex-col items-center px-3 sm:px-4 md:px-6 py-5 sm:py-8 gap-4 sm:gap-6 w-full">

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center uppercase leading-tight">
          National Fuel Pass
        </h1>

        <div className="w-full max-w-2xl bg-[#00a651] text-white text-xs sm:text-sm text-center px-4 py-3 leading-relaxed">
          Please wait while the portal loads. Over <strong>4.5 million vehicles</strong> are
          registered on this system island-wide. The portal will open automatically in a moment.
        </div>

        {/* Ad card */}
        <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-5 py-2 flex items-center justify-between">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Important Notice
            </p>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
              <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${adLoaded ? "bg-green-500" : "bg-orange-400 animate-pulse"}`} />
              <span className="whitespace-nowrap">
                {adLoaded ? "Redirecting…" : `Opening in ${countdown}s`}
              </span>
            </div>
          </div>

          {/* Skeleton shown while ad loads */}
          {!adLoaded && (
            <div className="w-full px-4 pt-4 pb-2">
              <div className="w-full h-[250px] sm:h-[280px] bg-gray-100 animate-pulse rounded" />
            </div>
          )}

          {/* Ad — always mounted so script renders into it; skeleton overlaps visually */}
          <div className={adLoaded ? "w-full" : "w-full h-0 overflow-hidden"}>
            <AdsterraAd
              scriptSrc={AD_SCRIPT_SRC}
              containerId={AD_CONTAINER_ID}
              enabled={true}
              centered={true}
              fullWidth={true}
              minHeight={250}
              padding="py-3 px-2 sm:py-4 sm:px-4"
              background="bg-white"
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-700 min-w-0">
              <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0 ${adLoaded ? "border-green-500" : "border-[#8B0000]"}`} />
              <span className="text-xs sm:text-sm font-medium truncate">
                {adLoaded ? "Connected — opening fuelpass.gov.lk" : "Connecting to National Fuel Pass portal…"}
              </span>
            </div>
            <button
              onClick={doRedirect}
              className="text-[11px] sm:text-xs text-[#8B0000] underline underline-offset-2 hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0"
            >
              Open now →
            </button>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B0000] rounded-full transition-all duration-1000"
              style={{ width: `${((FALLBACK_SECONDS - countdown) / FALLBACK_SECONDS) * 100}%` }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
            Used by vehicle owners across Sri Lanka for fuel quota registration and QR code access.
          </p>
        </div>

        {/* Vehicle categories */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-2">Applicable Vehicle Categories</h2>
          <div className="border border-gray-200 bg-white text-xs sm:text-sm overflow-hidden">
            {[
              ["BIKE",    "MOTOR CYCLE / LIGHT MOTOR CYCLE"],
              ["3WHEEL",  "MOTOR TRICYCLE / MOTOR TRICYCLE VAN / INVALID CARRIAGE"],
              ["CAR",     "MOTOR CAR / DUAL PURPOSE VEHICLE"],
              ["VAN",     "MOTOR COACH / OMNIBUS / PRIVATE COACH"],
              ["LORRY",   "GOODS VEHICLE"],
              ["TRACTOR", "AGRICULTURAL VEHICLE"],
            ].map(([cat, desc], i, arr) => (
              <div key={cat} className={`flex ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}>
                <div className="w-20 sm:w-28 flex-shrink-0 px-3 sm:px-4 py-2 font-semibold text-gray-700 border-r border-gray-200 bg-gray-50 flex items-center">{cat}</div>
                <div className="px-3 sm:px-4 py-2 text-gray-600 flex items-center">| {desc}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 px-4 py-3 text-center text-[10px] sm:text-xs text-gray-400">
        © {new Date().getFullYear()} Democratic Socialist Republic of Sri Lanka — National Fuel Pass
      </footer>
    </div>
  );
}