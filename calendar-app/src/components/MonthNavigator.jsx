import { motion } from 'framer-motion';
import { MONTH_NAMES } from '../utils/constants';

/**
 * MonthNavigator — Prev/Next arrows + Today button.
 * Styled to look like a clean, printed-on-paper navigation.
 */
export default function MonthNavigator({
  month,
  year,
  onPrev,
  onNext,
  onToday,
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Month & Year Display */}
      <div className="flex items-center gap-3">
        <motion.h2
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-lg font-bold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: '#1e293b',
          }}
        >
          {MONTH_NAMES[month]} {year}
        </motion.h2>

        <button
          onClick={onToday}
          className="print-btn no-print"
          id="btn-today"
          aria-label="Go to today"
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          Today
        </button>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-2 no-print">
        <button
          onClick={onPrev}
          className="nav-btn"
          id="btn-prev-month"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={onNext}
          className="nav-btn"
          id="btn-next-month"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
