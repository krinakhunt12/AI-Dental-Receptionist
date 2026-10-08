import React from 'react';

interface LogoProps {
  variant?: 'icon' | 'full' | 'compact' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  className?: string;
  subtitle?: string;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  animated = true,
  className = '',
  subtitle,
}: LogoProps) {
  // Size mappings for logo icon box
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  // Icon SVG dimension mappings
  const svgSizes = {
    sm: 18,
    md: 24,
    lg: 28,
    xl: 36,
    '2xl': 48,
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
    '2xl': 'text-sm',
  };

  const currentSvgSize = svgSizes[size] || 24;

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Dental AI Vector Emblem Icon */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-600 p-[1px] shadow-lg shadow-teal-500/20 transition-all duration-300 group-hover:shadow-teal-400/30 group-hover:scale-105 shrink-0 ${
          sizeClasses[size]
        }`}
      >
        {/* Glow Ring Behind Icon */}
        <div
          className={`absolute inset-0 rounded-2xl bg-teal-400/30 blur-md transition-opacity duration-300 ${
            animated ? 'group-hover:opacity-100 opacity-60 animate-pulse' : 'opacity-40'
          }`}
        />

        {/* Inner Glass Emblem Container */}
        <div className="relative w-full h-full rounded-[15px] bg-[#090e1a]/90 backdrop-blur-md flex items-center justify-center overflow-hidden border border-teal-400/30">
          {/* Background Micro Gradient Grid */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-cyan-400/10 opacity-70" />

          {/* High-Precision SVG Dental AI Tooth Emblem */}
          <svg
            width={currentSvgSize}
            height={currentSvgSize}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="dentalGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="sparkleGrad" x1="20" y1="10" x2="38" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main Sculpted Tooth Contour */}
            <path
              d="M24 6C17.5 6 12 9.5 12 17C12 23 13.5 28 15 34C16.2 38.8 19.5 42 21.5 42C23.2 42 23.8 39.5 24 37C24.2 39.5 24.8 42 26.5 42C28.5 42 31.8 38.8 33 34C34.5 28 36 23 36 17C36 9.5 30.5 6 24 6Z"
              fill="url(#dentalGrad)"
              fillOpacity="0.2"
              stroke="url(#dentalGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Inner Precision Arc Lines (Smooth Dental Crown Curves) */}
            <path
              d="M17 17C17 14 20 11.5 24 11.5C28 11.5 31 14 31 17"
              stroke="#2dd4bf"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M24 11.5V31"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* AI Sparkle Star (Top Right Accent) */}
            <path
              d="M34 8L35.2 11.8L39 13L35.2 14.2L34 18L32.8 14.2L29 13L32.8 11.8L34 8Z"
              fill="url(#sparkleGrad)"
              className={animated ? 'animate-pulse' : ''}
            />

            {/* Medical Shield Cross Node Center */}
            <circle cx="24" cy="23" r="3" fill="#ffffff" />
            <circle cx="24" cy="23" r="1.5" fill="#0d9488" />
          </svg>
        </div>
      </div>

      {/* Brand Text Typography */}
      {variant !== 'icon' && (
        <div className={`flex flex-col ${variant === 'vertical' ? 'items-center text-center' : ''}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight font-heading gradient-text-teal ${
                titleSizes[size]
              }`}
            >
              SmileCare
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30">
              AI
            </span>
          </div>

          {(variant === 'full' || subtitle) && (
            <span
              className={`font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1 mt-1 ${
                subtitleSizes[size]
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{subtitle ?? 'Dental Suite & Receptionist'}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
