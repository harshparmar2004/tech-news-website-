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
  showPulse = true,
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
          <linearGradient id="nfBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1E1C" />
            <stop offset="100%" stopColor="#0E0E0D" />
          </linearGradient>

          <linearGradient id="nfBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A3833" />
            <stop offset="100%" stopColor="#1A1917" />
          </linearGradient>

          <linearGradient id="nfR1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B84A28" />
            <stop offset="45%" stopColor="#D9643B" />
            <stop offset="100%" stopColor="#FF7547" />
          </linearGradient>

          <linearGradient id="nfR2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2552D" />
            <stop offset="50%" stopColor="#FF7A4D" />
            <stop offset="100%" stopColor="#FFB347" />
          </linearGradient>

          <filter id="nfGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Squircle Base */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="124"
          ry="124"
          fill="url(#nfBg)"
          stroke="url(#nfBorder)"
          strokeWidth="6"
        />

        {/* Monogram 'N' Ribbon Waves */}
        <g>
          <path
            d="M142 350 C142 270, 168 210, 222 176 C238 166, 260 178, 252 196 C234 238, 214 278, 184 340 C176 356, 154 362, 142 350 Z"
            fill="url(#nfR1)"
          />

          <path
            d="M168 252 C210 186, 276 160, 344 240 C356 254, 346 274, 328 274 C268 274, 214 314, 188 356 C178 372, 156 366, 154 348 C150 310, 156 272, 168 252 Z"
            fill="url(#nfR1)"
          />

          <path
            d="M214 194 C264 148, 320 162, 350 216 C358 230, 372 222, 370 206 C364 164, 334 136, 280 146 C240 154, 206 176, 178 206 C166 218, 178 234, 192 226 C200 220, 208 206, 214 194 Z"
            fill="url(#nfR2)"
          />

          <path
            d="M288 340 C318 296, 346 250, 366 186 C370 172, 388 174, 388 190 C388 238, 366 288, 332 334 C314 358, 280 354, 288 340 Z"
            fill="url(#nfR2)"
          />
        </g>

        {/* Live Telemetry Emerald Beacon */}
        <circle cx="396" cy="116" r="24" fill="#10B981" filter="url(#nfGlow)" />
        <circle cx="396" cy="116" r="14" fill="#34D399" />
      </svg>

      {/* Subtle pulse ring for live wire feel */}
      {showPulse && (
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75 pointer-events-none"
          style={{ width: Math.max(4, size * 0.18), height: Math.max(4, size * 0.18) }}
        />
      )}
    </div>
  );
}
