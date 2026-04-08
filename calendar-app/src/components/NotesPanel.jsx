import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, dateKey } from '../utils/dateUtils';

/**
 * NotesPanel — Shows on the RIGHT SIDE on desktop, bottom sheet on mobile.
 * Notes text is displayed HORIZONTALLY (not vertical).
 * Easy to write — click "Add a note" and type.
 */
export default function NotesPanel({
  selectedDates,
  notes,
  isOpen,
  onClose,
  onAddNote,
  onEditNote,
  onRemoveNote,
  onAddNoteToAll,
}) {
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState('');
  const [newNoteKey, setNewNoteKey] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

  const handleBulkApply = useCallback(() => {
    if (bulkText.trim()) {
      onAddNoteToAll(bulkText.trim());
      setBulkText('');
      setBulkMode(false);
    }
  }, [bulkText, onAddNoteToAll]);

  const startEditing = useCallback((key, currentNote) => {
    setEditingKey(key);
    setEditText(currentNote);
    setNewNoteKey(null);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingKey && editText.trim()) {
      onEditNote(editingKey, editText.trim());
    }
    setEditingKey(null);
    setEditText('');
  }, [editingKey, editText, onEditNote]);

  const startNewNote = useCallback((key) => {
    setNewNoteKey(key);
    setNewNoteText('');
    setEditingKey(null);
  }, []);

  const saveNewNote = useCallback(() => {
    if (newNoteKey && newNoteText.trim()) {
      onAddNote(newNoteKey, newNoteText.trim());
    }
    setNewNoteKey(null);
    setNewNoteText('');
  }, [newNoteKey, newNoteText, onAddNote]);

  const handleKeyDown = useCallback((e, saveFunc) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFunc();
    }
  }, []);

  if (!isOpen || !selectedDates || selectedDates.length === 0) return null;

  // ── Panel Content ──
  const panelContent = (
    <>
      {/* Header */}
      <div className="notes-panel-header">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'rgba(26, 143, 209, 0.1)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a8fd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: '#1e293b', fontFamily: 'var(--font-display)' }}
            >
              Notes
            </h3>
            <p className="text-[10px]" style={{ color: '#94a3b8' }}>
              {selectedDates.length} day{selectedDates.length > 1 ? 's' : ''} · auto-saved
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:bg-gray-100"
          style={{ color: '#94a3b8' }}
          aria-label="Close notes"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Bulk toggle for multi-select */}
      {selectedDates.length > 1 && (
        <div className="px-4 pt-3">
          <div
            className="flex p-0.5 rounded-md"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <button
              onClick={() => setBulkMode(false)}
              className="flex-1 text-[11px] py-1.5 rounded font-medium transition-all"
              style={{
                background: !bulkMode ? '#1a8fd1' : 'transparent',
                color: !bulkMode ? 'white' : '#94a3b8',
              }}
            >
              Per Day
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className="flex-1 text-[11px] py-1.5 rounded font-medium transition-all"
              style={{
                background: bulkMode ? '#1a8fd1' : 'transparent',
                color: bulkMode ? 'white' : '#94a3b8',
              }}
            >
              All Days
            </button>
          </div>
        </div>
      )}

      {/* Bulk input */}
      {bulkMode && (
        <div className="px-4 py-3">
          <textarea
            autoFocus
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleBulkApply)}
            placeholder="Write a note for all days..."
            className="w-full rounded-md px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
            rows={2}
          />
          <button
            onClick={handleBulkApply}
            disabled={!bulkText.trim()}
            className="action-btn mt-2 w-full text-xs py-2 disabled:opacity-30"
          >
            Apply to {selectedDates.length} days
          </button>
        </div>
      )}

      {/* Per-day notes */}
      {!bulkMode && (
        <div className="notes-panel-body">
          {selectedDates.map((date) => {
            const key = dateKey(date);
            const note = notes[key];
            const isEditing = editingKey === key;
            const isAddingNew = newNoteKey === key;

            return (
              <div key={key} className="note-card">
                {/* Date + actions — HORIZONTAL layout */}
                <div className="flex items-center justify-between">
                  <span className="note-date-label">
                    {format(date, 'EEE, MMM d')}
                  </span>
                  {note && !isEditing && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(key, note)}
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ color: '#1a8fd1' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemoveNote(key)}
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-1">
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, saveEdit)}
                      className="w-full rounded-md px-2.5 py-1.5 text-sm focus:outline-none resize-none"
                      style={{ background: 'white', border: '1px solid #1a8fd1', color: '#1e293b' }}
                      rows={2}
                    />
                    <div className="flex gap-2 mt-1.5">
                      <button onClick={saveEdit} className="action-btn text-[11px] py-1">Save</button>
                      <button onClick={() => setEditingKey(null)} className="action-btn secondary text-[11px] py-1">Cancel</button>
                      <span className="ml-auto text-[9px] self-center" style={{ color: '#cbd5e1' }}>Ctrl+Enter</span>
                    </div>
                  </div>
                ) : isAddingNew ? (
                  <div className="mt-1">
                    <textarea
                      autoFocus
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, saveNewNote)}
                      placeholder="Write your note..."
                      className="w-full rounded-md px-2.5 py-1.5 text-sm focus:outline-none resize-none"
                      style={{ background: 'white', border: '1px solid #1a8fd1', color: '#1e293b' }}
                      rows={2}
                    />
                    <div className="flex gap-2 mt-1.5">
                      <button onClick={saveNewNote} disabled={!newNoteText.trim()} className="action-btn text-[11px] py-1 disabled:opacity-30">Save</button>
                      <button onClick={() => setNewNoteKey(null)} className="action-btn secondary text-[11px] py-1">Cancel</button>
                      <span className="ml-auto text-[9px] self-center" style={{ color: '#cbd5e1' }}>Ctrl+Enter</span>
                    </div>
                  </div>
                ) : note ? (
                  <p className="text-sm leading-relaxed break-words mt-1" style={{ color: '#475569' }}>
                    {note}
                  </p>
                ) : (
                  <button
                    onClick={() => startNewNote(key)}
                    className="w-full text-left text-[11px] py-1 flex items-center gap-1.5 mt-1"
                    style={{ color: '#94a3b8' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Add a note...
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ── DESKTOP: side panel (right of calendar) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="hidden lg:block notes-panel"
      >
        {panelContent}
      </motion.div>

      {/* ── MOBILE: bottom sheet ── */}
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.3 }}
        className="lg:hidden mobile-notes-sheet"
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
        </div>
        {panelContent}
      </motion.div>

      {/* ── MOBILE: backdrop ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="lg:hidden mobile-backdrop"
      />
    </>
  );
}
