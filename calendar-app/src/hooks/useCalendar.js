import { useState, useCallback, useEffect } from 'react';
import { loadNotes, saveNotes } from '../utils/storage';
import { getDatesInRange, dateKey } from '../utils/dateUtils';

/**
 * useCalendar — manages all calendar state + localStorage persistence.
 *
 * Selection Flow:
 * 1. Click a date → "selecting" mode (start date set)
 * 2. Click another date → "selected" mode (range complete, notes panel opens)
 * 3. If same date clicked again → single day selected, notes panel opens
 *
 * Notes are auto-saved to localStorage on every change.
 */
export function useCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState(() => loadNotes());
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState('idle');

  // Save to localStorage every time notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // ─── Navigation ─────────────────────────────────────────

  const resetSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoverDate(null);
    setSelectionMode('idle');
    setNotesPanelOpen(false);
  };

  const goToPrevMonth = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    resetSelection();
  };

  const goToNextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    resetSelection();
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    resetSelection();
  };

  // ─── Selection ──────────────────────────────────────────

  const handleDateClick = useCallback((date) => {
    if (selectionMode === 'idle' || selectionMode === 'selected') {
      setRangeStart(date);
      setRangeEnd(null);
      setHoverDate(null);
      setSelectionMode('selecting');
      setNotesPanelOpen(false);
    } else if (selectionMode === 'selecting') {
      setRangeEnd(date);
      setSelectionMode('selected');
      setNotesPanelOpen(true);
    }
  }, [selectionMode]);

  const handleDateHover = useCallback((date) => {
    if (selectionMode === 'selecting') {
      setHoverDate(date);
    }
  }, [selectionMode]);

  const handleDateHoverEnd = useCallback(() => {
    setHoverDate(null);
  }, []);

  // ─── Selected Dates ─────────────────────────────────────

  const selectedDates = getDatesInRange(
    rangeStart,
    selectionMode === 'selected' ? rangeEnd : null
  );

  // ─── Notes CRUD ─────────────────────────────────────────

  const addNote = useCallback((key, text) => {
    if (!text || !text.trim()) return;
    setNotes((prev) => ({ ...prev, [key]: text.trim() }));
  }, []);

  const editNote = useCallback((key, text) => {
    if (!text || !text.trim()) return;
    setNotes((prev) => ({ ...prev, [key]: text.trim() }));
  }, []);

  const removeNote = useCallback((key) => {
    setNotes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const addNoteToAllSelected = useCallback((text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    setNotes((prev) => {
      const updated = { ...prev };
      selectedDates.forEach((d) => {
        updated[dateKey(d)] = trimmed;
      });
      return updated;
    });
  }, [selectedDates]);

  const hasNote = useCallback((key) => {
    return !!notes[key];
  }, [notes]);

  return {
    currentMonth, currentYear,
    rangeStart, rangeEnd, hoverDate,
    notes, notesPanelOpen, selectionMode, selectedDates,
    goToPrevMonth, goToNextMonth, goToToday,
    handleDateClick, handleDateHover, handleDateHoverEnd, resetSelection,
    addNote, editNote, removeNote, addNoteToAllSelected, hasNote,
    setNotesPanelOpen,
  };
}
