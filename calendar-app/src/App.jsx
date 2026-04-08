import { useCalendar } from './hooks/useCalendar';
import HeroImage from './components/HeroImage';
import CalendarGrid from './components/CalendarGrid';
import NotesPanel from './components/NotesPanel';
import { AnimatePresence } from 'framer-motion';
import './App.css';

/**
 * App — Wall Calendar with side-by-side layout.
 * Desktop: Calendar on LEFT, Notes on RIGHT.
 * Mobile: Calendar full width, Notes as bottom sheet.
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

  const spiralRings = Array.from({ length: 15 });

  return (
    <div className="app-layout">
      {/* ─── LEFT: The Wall Calendar ─── */}
      <div className="calendar-col">
        <div className="wall-calendar" id="wall-calendar">
          {/* Hanging Hook */}
          <div className="hanging-hook">
            <svg width="36" height="24" viewBox="0 0 40 28" fill="none">
              <path
                d="M15 28 C15 28, 15 8, 20 4 C25 0, 30 4, 30 8 C30 12, 25 14, 20 12"
                stroke="#888"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Spiral Binding */}
          <div className="spiral-binding">
            {spiralRings.map((_, i) => (
              <div key={i} className="spiral-ring" />
            ))}
          </div>

          {/* Hero Image */}
          <HeroImage month={currentMonth} year={currentYear} />

          {/* Calendar Grid */}
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

        {/* Footer tip */}
        <p
          className="text-[11px] text-center mt-3 no-print"
          style={{ color: '#94a3b8' }}
        >
          Click a date to add notes · Click two dates to select a range
        </p>
      </div>

      {/* ─── RIGHT: Notes Panel (desktop = side, mobile = bottom sheet) ─── */}
      <AnimatePresence>
        {notesPanelOpen && (
          <div className="notes-col">
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
    </div>
  );
}
