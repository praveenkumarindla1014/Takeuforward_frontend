import { useCalendar } from './hooks/useCalendar';
import HeroImage from './components/HeroImage';
import CalendarGrid from './components/CalendarGrid';
import NotesPanel from './components/NotesPanel';
import { AnimatePresence } from 'framer-motion';
import './App.css';

/**
 * App — renders the complete Wall Calendar.
 * Structure mimics a real physical wall calendar:
 * 1. Hanging hook at the top
 * 2. Spiral binding
 * 3. Large hero image with month/year badge
 * 4. Calendar body with Notes + Grid
 * 5. Notes panel (when dates are selected)
 */
export default function App() {
  const {
    currentMonth,
    currentYear,
    rangeStart,
    rangeEnd,
    hoverDate,
    notes,
    notesPanelOpen,
    selectionMode,
    selectedDates,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    handleDateClick,
    handleDateHover,
    handleDateHoverEnd,
    resetSelection,
    addNote,
    editNote,
    removeNote,
    addNoteToAllSelected,
    setNotesPanelOpen,
  } = useCalendar();

  // Generate spiral rings
  const spiralRings = Array.from({ length: 15 });

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* ─── The Wall Calendar ─── */}
      <div className="wall-calendar" id="wall-calendar">
        {/* Hanging Hook */}
        <div className="hanging-hook">
          <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
            {/* Wire hook */}
            <path
              d="M15 28 C15 28, 15 8, 20 4 C25 0, 30 4, 30 8 C30 12, 25 14, 20 12"
              stroke="#888"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Shadow */}
            <ellipse cx="20" cy="27" rx="6" ry="1.5" fill="rgba(0,0,0,0.08)" />
          </svg>
        </div>

        {/* Spiral Binding */}
        <div className="spiral-binding">
          {spiralRings.map((_, i) => (
            <div key={i} className="spiral-ring" />
          ))}
        </div>

        {/* Hero Image Section */}
        <HeroImage month={currentMonth} year={currentYear} />

        {/* Calendar Grid Body */}
        <CalendarGrid
          currentMonth={currentMonth}
          currentYear={currentYear}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          hoverDate={hoverDate}
          selectionMode={selectionMode}
          notes={notes}
          onDateClick={handleDateClick}
          onDateHover={handleDateHover}
          onDateHoverEnd={handleDateHoverEnd}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          onResetSelection={resetSelection}
          selectedDates={selectedDates}
        />
      </div>

      {/* ─── Notes Panel (outside the calendar card) ─── */}
      <AnimatePresence>
        {notesPanelOpen && (
          <div className="w-full" style={{ maxWidth: '640px' }}>
            <NotesPanel
              selectedDates={selectedDates}
              notes={notes}
              isOpen={notesPanelOpen}
              onClose={() => setNotesPanelOpen(false)}
              onAddNote={addNote}
              onEditNote={editNote}
              onRemoveNote={removeNote}
              onAddNoteToAll={addNoteToAllSelected}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <p
        className="text-xs text-center pb-4 no-print"
        style={{ color: '#94a3b8' }}
      >
        Click a date to add notes · Drag to select a range · Data saved to localStorage
      </p>
    </div>
  );
}
