import React from "react";

export function TrackWiseLogo({
  variant = "full",
  size = "md",
  showTagline = false,
  className = "",
}) {
  // Dimensions map for crisp display
  const sizeMap = {
    xs: { h: "h-6", text: "text-xs", tag: "text-[9px]" },
    sm: { h: "h-8", text: "text-sm", tag: "text-[10px]" },
    md: { h: "h-9 sm:h-10", text: "text-base", tag: "text-[11px]" },
    lg: { h: "h-12 sm:h-14", text: "text-xl", tag: "text-xs" },
    xl: { h: "h-16 sm:h-20", text: "text-2xl", tag: "text-sm" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (variant === "mark") {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/trackwise-mark.png"
          alt="TrackWise Logo Mark"
          className={`${currentSize.h} w-auto object-contain drop-shadow-sm select-none`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        <img
          src="/trackwise-logo-dark.png"
          alt="TrackWise"
          className={`${currentSize.h} w-auto object-contain max-w-full drop-shadow-sm`}
          loading="eager"
          onError={(e) => {
            // Graceful fallback to standard logo if dark version unavailable
            e.currentTarget.src = "/trackwise-logo.png";
          }}
        />
      </div>
      {showTagline && (
        <span className={`font-mono text-[#A855F7] tracking-tight leading-tight mt-1 ${currentSize.tag}`}>
          AI-powered research & competitor tracking.
        </span>
      )}
    </div>
  );
}

export default TrackWiseLogo;
