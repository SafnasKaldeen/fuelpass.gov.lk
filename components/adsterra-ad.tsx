"use client";

import { useEffect, useRef } from "react";

interface AdsterraAdProps {
  scriptSrc: string;
  containerId: string;
  enabled?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
  minHeight?: number;
  padding?: string;
  className?: string;
  showLabel?: boolean;
  labelText?: string;
  labelPosition?: "top" | "bottom";
  showBorder?: boolean;
  borderColor?: string;
  background?: string;
}

export function AdsterraAd({
  scriptSrc,
  containerId,
  enabled,
  centered = true,
  fullWidth = true,
  minHeight = 0,
  padding = "py-6",
  className = "",
  showBorder = false,
  borderColor = "border-slate-700/40",
  background = "bg-transparent",
}: AdsterraAdProps) {
  const isEnabled =
    enabled !== undefined
      ? enabled
      : process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  const lastContainerId = useRef<string | null>(null);

  useEffect(() => {
    if (!isEnabled) return;
    if (lastContainerId.current === containerId) return;
    lastContainerId.current = containerId;

    const existing = document.querySelector(
      `script[data-adsterra-container="${containerId}"]`
    );
    if (existing) existing.remove();

    const s = document.createElement("script");
    s.src = scriptSrc;
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.setAttribute("data-adsterra-container", containerId);
    document.body.appendChild(s);

    return () => {
      const el = document.querySelector(
        `script[data-adsterra-container="${containerId}"]`
      );
      if (el) el.remove();
      lastContainerId.current = null;
    };
  }, [isEnabled, scriptSrc, containerId]);

  if (!isEnabled) return null;

  return (
    <div
      className={[
        "flex flex-col",
        centered ? "items-center" : "",
        padding,
        background,
        showBorder ? `border-y ${borderColor}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        id={containerId}
        style={{ minHeight: minHeight > 0 ? `${minHeight}px` : undefined }}
        className={fullWidth ? "w-full" : ""}
      />
    </div>
  );
}