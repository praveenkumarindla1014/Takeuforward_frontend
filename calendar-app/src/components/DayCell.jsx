import { memo } from 'react';
import {
  isSameMonth,
  isToday,
  isSameDay,
  isWeekend,
  format,
  isInRange,
  isRangeStart,
  isRangeEnd,
  dateKey,
} from '../utils/dateUtils';

/**
 * DayCell — individual cell in the calendar grid.
 * Tooltip uses a real <span> element (not CSS ::after) to prevent vertical text.
 */
const DayCell = memo(function DayCell({
  date,
  currentMonth,
  currentYear,
  rangeStart,
  rangeEnd,
  hoverDate,
  selectionMode,
  notes,
  onClick,
  onHover,
  onHoverEnd,
}) {
  const inMonth = isSameMonth(date, new Date(currentYear, currentMonth, 1));
  const today = isToday(date);
  const weekend = isWeekend(date);
  const key = dateKey(date);
  const hasNote = !!notes[key];
  const noteText = notes[key] || '';
  const dayNum = format(date, 'd');

  // Range states
  const effectiveEnd = selectionMode === 'selecting' && hoverDate ? hoverDate : rangeEnd;
  const inRange = rangeStart && effectiveEnd ? isInRange(date, rangeStart, effectiveEnd) : false;
  const isStart = rangeStart && effectiveEnd ? isRangeStart(date, rangeStart, effectiveEnd) : false;
  const isEnd = rangeStart && effectiveEnd ? isRangeEnd(date, rangeStart, effectiveEnd) : false;
  const isSingleSelect = rangeStart && !rangeEnd && !hoverDate && isSameDay(date, rangeStart);

  // Build CSS classes
  let cellClass = 'day-cell';
  if (!inMonth) {
    cellClass += ' other-month disabled';
  } else {
    if (today && !inRange && !isSingleSelect) {
      cellClass += ' today';
    } else if ((isStart && isEnd) || isSingleSelect) {
      cellClass += ' single-select';
    } else if (isStart) {
      cellClass += ' range-start';
    } else if (isEnd) {
      cellClass += ' range-end';
    } else if (inRange) {
      cellClass += ' in-range';
    }
    if (weekend) cellClass += ' weekend';
  }

  return (
    <div
      className={`${cellClass} ${hasNote && inMonth ? 'tooltip-wrap' : ''}`}
      onClick={() => inMonth && onClick(date)}
      onMouseEnter={() => inMonth && onHover(date)}
      onMouseLeave={onHoverEnd}
      role="button"
      tabIndex={inMonth ? 0 : -1}
      aria-label={inMonth ? `${format(date, 'MMMM d, yyyy')}${hasNote ? ' - has note' : ''}` : undefined}
      id={inMonth ? `day-${key}` : undefined}
    >
      {dayNum}

      {/* Note indicator dot */}
      {hasNote && inMonth && (
        <span
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full note-pulse"
          style={{ background: '#10b981' }}
        />
      )}

      {/* Tooltip — real element, text always horizontal */}
      {hasNote && inMonth && (
        <span className="tooltip-text">
          {noteText.length > 40 ? noteText.substring(0, 40) + '…' : noteText}
        </span>
      )}

      {/* Today ring when in range */}
      {today && (inRange || isSingleSelect) && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(26, 143, 209, 0.5)' }}
        />
      )}
    </div>
  );
});

export default DayCell;
