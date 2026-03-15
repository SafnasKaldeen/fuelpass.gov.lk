"use client";

import { useEffect, useState, useRef } from "react";
import { AdsterraAd } from "@/components/adsterra-ad";

const REDIRECT_URL = "https://fuelpass.gov.lk/";
const AD_CONTAINER_ID = "container-f809eade241e4e2118d5088c2760eb9e";
const AD_SCRIPT_SRC =
  "https://pl28920844.effectivegatecpm.com/f809eade241e4e2118d5088c2760eb9e/invoke.js";

const AD_LOADED_REDIRECT_MS = 1000;
const FALLBACK_SECONDS = 10;

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
    const fallbackTimer = setTimeout(doRedirect, FALLBACK_SECONDS * 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    // Poll the container — works now because the div is always in the DOM at full size
    const pollInterval = setInterval(() => {
      const el = document.getElementById(AD_CONTAINER_ID);
      if (el && el.children.length > 0) {
        clearInterval(pollInterval);
        setAdLoaded(true);
        clearTimeout(fallbackTimer);
        setTimeout(doRedirect, AD_LOADED_REDIRECT_MS);
      }
    }, 200);

    return () => {
      clearTimeout(fallbackTimer);
      clearInterval(countdownInterval);
      clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,#16C47F22 0%,transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#16C47F1A] border border-[#16C47F40] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 7v2h16V7L10 2z" fill="#16C47F" />
                <rect x="3" y="9" width="2" height="7" rx="1" fill="#16C47F" opacity=".7" />
                <rect x="9" y="9" width="2" height="7" rx="1" fill="#16C47F" opacity=".7" />
                <rect x="15" y="9" width="2" height="7" rx="1" fill="#16C47F" opacity=".7" />
                <rect x="2" y="16" width="16" height="2" rx="1" fill="#16C47F" />
              </svg>
            </div>
            <span className="text-white/80 font-medium tracking-widest text-xs uppercase">
              Sri Lanka Fuel Pass
            </span>
          </div>

          <h1 className="text-[2rem] font-bold text-white leading-tight tracking-tight">
            Redirecting to{" "}
            <span className="text-[#16C47F]">fuelpass.gov.lk</span>
          </h1>
          <p className="text-slate-400 text-sm">
            The official Government Fuel Pass portal will open shortly.
          </p>
        </div>

        {/* Ad card */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium select-none">
              Advertisement
            </span>
            <span
              className={`text-[11px] flex items-center gap-1.5 transition-colors duration-300 ${
                adLoaded ? "text-[#16C47F]" : "text-slate-500"
              }`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  adLoaded ? "bg-[#16C47F]" : "bg-slate-500 animate-pulse"
                }`}
              />
              {adLoaded ? "Redirecting…" : "Loading ad…"}
            </span>
          </div>

          {/* 
            FIX: The ad div must always be in the DOM at its real size so the
            Adsterra script can write into it and the poll can find children.
            We show a skeleton on top while waiting, then fade it out — we never
            use h-0/overflow-hidden which would starve the ad of layout space.
          */}
          <div className="relative">

            {/* Skeleton — overlays the ad slot, fades out once ad loads */}
            <div
              className={`absolute inset-0 px-6 pt-6 pb-2 transition-opacity duration-500 pointer-events-none z-10 ${
                adLoaded ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-full h-[260px] rounded-xl bg-white/5 animate-pulse" />
            </div>

            {/* Ad slot — always mounted & always visible in the DOM */}
            <AdsterraAd
              scriptSrc={AD_SCRIPT_SRC}
              containerId={AD_CONTAINER_ID}
              enabled={true}
              centered={true}
              fullWidth={true}
              minHeight={300}
              padding="py-4"
              background="bg-white/[0.02]"
            />
          </div>
        </div>

        {/* Countdown + skip */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ffffff0f" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#16C47F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(countdown / FALLBACK_SECONDS) * 88} 88`}
                  style={{ transition: "stroke-dasharray 1s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-semibold">
                {countdown}
              </span>
            </div>
            <span className="text-slate-400 text-sm">
              {adLoaded
                ? "Ad loaded — redirecting now"
                : `Auto-redirect in ${countdown}s`}
            </span>
          </div>

          <button
            onClick={doRedirect}
            className="text-[#16C47F] text-sm hover:underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            Skip and go now →
          </button>
        </div>

        <p className="text-[11px] text-slate-700 text-center">
          Independent redirect page. Official portal maintained by the Government of Sri Lanka.
        </p>
      </div>
    </main>
  );
}