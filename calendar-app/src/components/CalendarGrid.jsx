import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalendarDays } from '../utils/dateUtils';
import { DAY_LABELS } from '../utils/constants';
import DayCell from './DayCell';
import MonthNavigator from './MonthNavigator';

/**
 * CalendarGrid — the lower half of the wall calendar.
 * Clean 7-column grid, no inline notes (notes go to the side panel).
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

  // Build rows of 7
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
            <div className="selection-bar">
              <span style={{ color: '#1a8fd1' }}>
                {selectionMode === 'selecting'
                  ? '🎯 Click another date to complete range'
                  : `✅ ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} selected`}
              </span>
              <button
                onClick={onResetSelection}
                className="action-btn secondary"
                style={{ fontSize: '10px', padding: '2px 8px' }}
                id="btn-clear-selection"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Separator line */}
      <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '2px' }} />

      {/* Days grid */}
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

      <div className="geo-accent" />
    </div>
  );
}
