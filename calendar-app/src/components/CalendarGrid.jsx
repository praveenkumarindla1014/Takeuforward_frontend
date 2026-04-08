import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalendarDays, dateKey } from '../utils/dateUtils';
import { DAY_LABELS } from '../utils/constants';
import DayCell from './DayCell';
import MonthNavigator from './MonthNavigator';

/**
 * CalendarGrid — the lower half of the wall calendar.
 * Layout matches the reference: Notes on the left, 7-column grid on the right.
 * Day headers with weekends highlighted in blue.
 */
export default function CalendarGrid({
  currentMonth,
  currentYear,
  rangeStart,
  rangeEnd,
  hoverDate,
  selectionMode,
  notes,
  onDateClick,
  onDateHover,
  onDateHoverEnd,
  onPrevMonth,
  onNextMonth,
  onToday,
  onResetSelection,
  selectedDates,
}) {
  const days = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Count notes for the current month
  const monthNoteCount = useMemo(() => {
    return days.filter(d => {
      const k = dateKey(d);
      return !!notes[k];
    }).length;
  }, [days, notes]);

  // Build rows of 7 days for the grid lines
  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <div className="calendar-body" id="calendar-grid">
      {/* Navigation */}
      <MonthNavigator
        month={currentMonth}
        year={currentYear}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
        onToday={onToday}
      />

      {/* Selection info bar */}
      <AnimatePresence>
        {selectionMode !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden no-print"
          >
            <div
              className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(26, 143, 209, 0.08)',
                border: '1px solid rgba(26, 143, 209, 0.15)',
              }}
            >
              <span className="text-xs" style={{ color: '#1a8fd1' }}>
                {selectionMode === 'selecting'
                  ? '🎯 Click another date to complete range'
                  : `✅ ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} selected`}
              </span>
              <button
                onClick={onResetSelection}
                className="text-xs px-2 py-0.5 rounded transition-colors"
                style={{ color: '#64748b' }}
                id="btn-clear-selection"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-column layout: Notes on left, Calendar grid on right */}
      <div className="flex gap-0">
        {/* ─── Left: Notes Section ─── */}
        <div className="hidden md:block notes-section" style={{ width: '140px', flexShrink: 0 }}>
          <p
            className="text-xs font-semibold tracking-wider uppercase mb-2"
            style={{ color: '#94a3b8', fontFamily: 'var(--font-display)' }}
          >
            Notes
          </p>
          {/* Ruled lines for notes */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="notes-line">
              {/* Show saved notes count on first line */}
              {i === 0 && monthNoteCount > 0 && (
                <span className="text-[10px]" style={{ color: '#94a3b8' }}>
                  {monthNoteCount} note{monthNoteCount > 1 ? 's' : ''} this month
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ─── Right: Calendar Grid ─── */}
        <div className="flex-1 min-w-0">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7">
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={`day-header ${i >= 5 ? 'weekend' : ''}`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Separator line under headers */}
          <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '2px' }} />

          {/* Days grid with animated transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentMonth}-${currentYear}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-7 grid-line-h">
                  {row.map((date) => (
                    <DayCell
                      key={date.toISOString()}
                      date={date}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      rangeStart={rangeStart}
                      rangeEnd={rangeEnd}
                      hoverDate={hoverDate}
                      selectionMode={selectionMode}
                      notes={notes}
                      onClick={onDateClick}
                      onHover={onDateHover}
                      onHoverEnd={onDateHoverEnd}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative geometric accent (bottom left) */}
      <div className="geo-accent" />
    </div>
  );
}
