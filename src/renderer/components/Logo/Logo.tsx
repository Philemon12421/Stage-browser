import React from 'react'

interface LogoProps {
  size?: number
  showText?: boolean
}

export default function Logo({ size = 28, showText = false }: LogoProps) {
  const id = `lg-${size}` // unique gradient id per size to avoid SVG conflicts
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Stage Browser logo"
      >
        <defs>
          <linearGradient id={`${id}-a`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="55%" stopColor="#7c6af7" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id={`${id}-b`} x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0d7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx="16" cy="16" r="14.5"
          stroke={`url(#${id}-a)`}
          strokeWidth="1.8"
          fill="none"
          filter={`url(#${id}-glow)`}
        />

        {/* Inner ring (depth) */}
        <circle
          cx="16" cy="16" r="11"
          stroke={`url(#${id}-b)`}
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="3 2.5"
        />

        {/* "S" letterform — two arcs forming an S */}
        {/* Top arc of S */}
        <path
          d="M20 10.5 C20 8.5 18 7 16 7 C13 7 11 8.8 11 11 C11 13.2 13 14.5 16 15.5"
          stroke={`url(#${id}-a)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom arc of S */}
        <path
          d="M12 15.5 C12 15.5 11 16.5 11 18.5 C11 21 13 23 16 23 C19 23 21 21.2 21 19 C21 16.8 19 15.5 16 14.5"
          stroke={`url(#${id}-a)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.03em',
          background: 'linear-gradient(135deg, #c4b5fd 0%, #7c6af7 60%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          whiteSpace: 'nowrap',
        }}>
          Stage Browser
        </span>
      )}
    </span>
  )
}

