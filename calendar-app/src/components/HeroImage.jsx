import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_IMAGES, MONTH_NAMES, MONTH_ACCENTS } from '../utils/constants';
import tufLogo from '../images/tuf_img.png';

/**
 * HeroImage — Large photo section at top of the wall calendar.
 * Features a geometric badge overlay showing Month + Year (like the reference).
 * Uses Ken Burns effect on loaded images.
 */
export default function HeroImage({ month, year }) {
  const imageData = MONTH_IMAGES[month];
  const accent = MONTH_ACCENTS[month];
  const [loaded, setLoaded] = useState(false);
  const [prevMonth, setPrevMonth] = useState(month);

  if (month !== prevMonth) {
    setPrevMonth(month);
    setLoaded(false);
  }

  return (
    <div className="hero-section">
      {/* Fallback color background */}
      <div
        className="absolute inset-0"
        style={{ background: imageData.color }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={month}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* The actual image */}
          <img
            src={imageData.src}
            alt={imageData.alt}
            loading="eager"
            crossOrigin="anonymous"
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease',
              animation: loaded ? 'kenBurns 30s ease-in-out infinite' : 'none',
            }}
          />

          {/* Subtle bottom gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Branded Logo Overlay (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shadow-xl overflow-hidden">
          <img src={tufLogo} alt="Takeuforward Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Geometric Month Badge — like the reference image */}
      <div className="month-badge">
        <div className="relative">
          {/* Upper triangle accent */}
          <svg
            className="absolute -top-[30px] right-0"
            width="180"
            height="30"
            viewBox="0 0 180 30"
            fill="none"
            style={{ opacity: 0.5 }}
          >
            <polygon points="50,30 180,0 180,30" fill={accent} />
          </svg>
          {/* Main badge */}
          <div
            style={{
              background: accent,
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
              padding: '14px 24px 18px 36px',
              minWidth: '150px',
              textAlign: 'right',
            }}
          >
            <motion.div
              key={`${month}-${year}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <p
                className="text-white/90 text-sm font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {year}
              </p>
              <h2
                className="text-white text-xl font-bold uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {MONTH_NAMES[month]}
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Left geometric accent triangle */}
      <svg
        className="absolute bottom-0 left-0"
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        style={{ opacity: 0.15 }}
      >
        <polygon points="0,40 60,90 0,90" fill={accent} />
      </svg>
    </div>
  );
}
