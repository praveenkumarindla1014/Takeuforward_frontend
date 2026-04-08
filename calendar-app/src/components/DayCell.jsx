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
 * Matches the wall calendar aesthetic: clean numbers, blue weekends,
 * dot indicators for notes, range selection highlighting.
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

  // Determine range states
  const effectiveEnd = selectionMode === 'selecting' && hoverDate ? hoverDate : rangeEnd;
  const inRange = rangeStart && effectiveEnd ? isInRange(date, rangeStart, effectiveEnd) : false;
  const isStart = rangeStart && effectiveEnd ? isRangeStart(date, rangeStart, effectiveEnd) : false;
  const isEnd = rangeStart && effectiveEnd ? isRangeEnd(date, rangeStart, effectiveEnd) : false;
  const isSingleSelect = rangeStart && !rangeEnd && !hoverDate && isSameDay(date, rangeStart);
  const isHoverPreview = selectionMode === 'selecting' && hoverDate && inRange && !isStart;

  // Build CSS classes
  let cellClass = 'day-cell';

  if (!inMonth) {
    cellClass += ' other-month disabled';
  } else {
    if (today && !inRange && !isSingleSelect) {
      cellClass += ' today';
    } else if (isStart && isEnd) {
      cellClass += ' single-select';
    } else if (isStart) {
      cellClass += ' range-start';
    } else if (isEnd) {
      cellClass += ' range-end';
    } else if (isSingleSelect) {
      cellClass += ' single-select';
    } else if (inRange) {
      cellClass += ' in-range';
    }

    if (weekend) {
      cellClass += ' weekend';
    }
  }

  // Tooltip for note preview
  const tooltipClass = hasNote && inMonth ? 'tooltip' : '';

  return (
    <button
      onClick={() => inMonth && onClick(date)}
      onMouseEnter={() => inMonth && onHover(date)}
      onMouseLeave={onHoverEnd}
      className={`${cellClass} ${tooltipClass}`}
      disabled={!inMonth}
      aria-label={inMonth ? `${format(date, 'MMMM d, yyyy')}${hasNote ? ' - has note' : ''}` : undefined}
      id={inMonth ? `day-${key}` : undefined}
      data-tooltip={hasNote ? (noteText.length > 50 ? noteText.substring(0, 50) + '…' : noteText) : undefined}
      style={{
        opacity: isHoverPreview ? 0.7 : 1,
        border: 'none',
        background: undefined,
      }}
    >
      {dayNum}

      {/* Note indicator dot */}
      {hasNote && inMonth && (
        <span
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full note-pulse"
          style={{ background: '#10b981' }}
          aria-hidden="true"
        />
      )}

      {/* Today ring overlay when part of a range */}
      {today && (inRange || isSingleSelect) && (
        <span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(26, 143, 209, 0.5)' }}
          aria-hidden="true"
        />
      )}
    </button>
  );
});

export default DayCell;
