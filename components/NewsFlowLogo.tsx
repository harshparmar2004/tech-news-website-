"use client";

import React from "react";

interface NewsFlowLogoProps {
  size?: number;
  className?: string;
  showPulse?: boolean;
}

export function NewsFlowLogo({
  size = 32,
  className = "",
  showPulse = false,
}: NewsFlowLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-[24%] overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="nfBeigeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="100%" stopColor="#F4EFE6" />
          </linearGradient>

          <linearGradient id="nfBeigeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EBE4D5" />
            <stop offset="100%" stopColor="#D9CFBC" />
          </linearGradient>

          <linearGradient id="nfOrangeR1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B84A28" />
            <stop offset="35%" stopColor="#C96442" />
            <stop offset="70%" stopColor="#E25828" />
            <stop offset="100%" stopColor="#FF6E38" />
          </linearGradient>

          <linearGradient id="nfOrangeR2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D24F22" />
            <stop offset="40%" stopColor="#EA5E2E" />
            <stop offset="100%" stopColor="#FF824D" />
          </linearGradient>
        </defs>

        {/* Warm Beige Squircle Base */}
        <rect
          x="20"
          y="20"
          width="472"
          height="472"
          rx="124"
          ry="124"
          fill="url(#nfBeigeBg)"
          stroke="url(#nfBeigeBorder)"
          strokeWidth="10"
        />

        {/* Monogram 'N' in Signature Terracotta Orange */}
        <g>
          <path
            d="M148 354 C146 264, 172 198, 228 168 C244 158, 266 170, 258 188 C240 230, 218 274, 188 344 C180 362, 156 368, 148 354 Z"
            fill="url(#nfOrangeR1)"
          />

          <path
            d="M174 256 C216 188, 282 164, 348 244 C360 258, 350 278, 332 278 C272 278, 218 318, 192 360 C182 376, 160 370, 158 352 C154 314, 160 276, 174 256 Z"
            fill="url(#nfOrangeR1)"
          />

          <path
            d="M222 196 C272 150, 328 164, 356 218 C364 232, 378 224, 376 208 C370 166, 340 138, 286 148 C246 156, 212 178, 184 208 C172 220, 184 236, 198 228 C206 222, 216 208, 222 196 Z"
            fill="url(#nfOrangeR2)"
          />

          <path
            d="M296 344 C326 300, 352 254, 372 190 C376 176, 394 178, 394 194 C394 242, 372 292, 338 338 C320 362, 288 358, 296 344 Z"
            fill="url(#nfOrangeR2)"
          />

          <path
            d="M198 222 C234 186, 274 212, 308 246 C314 252, 324 248, 322 240 C306 206, 268 180, 230 196 C216 202, 204 214, 198 222 Z"
            fill="#FFFFFF"
            opacity="0.65"
          />
        </g>
      </svg>

      {/* Subtle pulse ring for live wire feel if enabled */}
      {showPulse && (
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-75 pointer-events-none"
          style={{ width: Math.max(4, size * 0.18), height: Math.max(4, size * 0.18) }}
        />
      )}
    </div>
  );
}
