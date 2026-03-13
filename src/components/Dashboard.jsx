import { useState } from 'react';
import { getDaysOld, getDaysOldOn, getDueDate, getTodayKey, formatDate } from '../utils/dates.js';
import { getLoggedToday, addReps, setReps, getHistory, clearAll } from '../utils/storage.js';
import { getMilestone } from '../data/milestones.js';
import ProgressRing from './ProgressRing.jsx';
import LogInput from './LogInput.jsx';
import CalendarView from './CalendarView.jsx';

export default function Dashboard({ lmpDate, cycleLength, onReset, user, onLogout }) {
  const todayKey = getTodayKey();
  const [logged, setLogged] = useState(() => getLoggedToday(todayKey));
  const [history, setHistory] = useState(() => getHistory());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const dueDate = getDueDate(lmpDate, cycleLength);
  const font = "Georgia, 'Times New Roman', serif";

  /* ── Lifetime total reps ── */
  const totalReps = Object.values(history).reduce((sum, h) => sum + (h?.logged ?? 0), 0)
    + (history[todayKey] ? 0 : logged); // add today if not yet in history
  const babyIsHere = dueDate && dueDate.daysUntil <= 0;

  /* ── Derive display values from selected date or today ── */
  const viewingDate = selectedDate || todayKey;
  const isViewingToday = viewingDate === todayKey;

  const daysOld = isViewingToday
    ? getDaysOld(lmpDate, cycleLength)
    : getDaysOldOn(viewingDate, lmpDate, cycleLength);

  const target = daysOld;
  const viewLogged = isViewingToday ? logged : (history[viewingDate]?.logged ?? 0);
  const isComplete = viewLogged >= target && target > 0;
  const isDayZero = target === 0;

  /* ── Handlers ── */
  function handleLog(reps) {
    addReps(viewingDate, reps);
    if (isViewingToday) {
      setLogged(getLoggedToday(todayKey));
    }
    setHistory(getHistory());
  }

  function handleEditStart() {
    setEditValue(String(viewLogged));
    setEditing(true);
  }

  function handleEditSave() {
    const val = parseInt(editValue, 10);
    if (!Number.isFinite(val) || val < 0) return;
    setReps(viewingDate, val);
    if (isViewingToday) {
      setLogged(val);
    }
    setHistory(getHistory());
    setEditing(false);
  }

  function handleEditCancel() {
    setEditing(false);
  }

  function handleSelectDate(dateKey) {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }

  function handleBackToToday() {
    setSelectedDate(null);
  }

  function handleReset() {
    if (window.confirm('Reset all data?')) {
      clearAll();
      onReset();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #f0f0e8, #dddcca)' }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold" style={{ color: '#2a2e1f', fontFamily: font }}>
          💪 Pump & Bump
        </h1>
        {user && (
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs" style={{ color: '#7d8068', fontFamily: font }}>
              {user.email}
            </span>
            <button
              onClick={onLogout}
              className="text-xs cursor-pointer bg-transparent border-none underline"
              style={{ color: '#7d8068', fontFamily: font }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center"
        style={{ border: '1px solid #c2c1a5' }}
      >
        {/* Viewing past date banner */}
        {!isViewingToday && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: '#556b2f', fontFamily: font }}>
              {formatDate(viewingDate)}
            </span>
            <button
              onClick={handleBackToToday}
              className="text-xs font-bold rounded-lg px-3 py-1 cursor-pointer border-none"
              style={{ background: '#f7f7f2', color: '#556b2f', fontFamily: font }}
            >
              ← Today
            </button>
          </div>
        )}

        {/* Days Old Badge */}
        <div className="mb-1">
          <span
            className="block font-bold"
            style={{ fontSize: '56px', color: '#2a2e1f', fontFamily: font, lineHeight: 1.1 }}
          >
            {daysOld}
          </span>
          <span className="text-sm" style={{ color: '#6b6e5a', fontFamily: font }}>
            {isViewingToday ? 'days old' : 'days old then'}
          </span>
        </div>

        {/* Milestone */}
        <p className="italic text-sm mb-1" style={{ color: '#7d8068', fontFamily: font }}>
          {getMilestone(daysOld)}
        </p>

        {/* Due Date — only show when viewing today */}
        {isViewingToday && dueDate && (
          <p className="text-xs mb-4" style={{ color: '#6b6e5a', fontFamily: font }}>
            {dueDate.daysUntil > 0
              ? `📅 Due ${dueDate.dateStr} — ${dueDate.daysUntil} days to go`
              : dueDate.daysUntil === 0
                ? `📅 Due today!`
                : `📅 Due date was ${dueDate.dateStr}`}
          </p>
        )}

        {/* Spacer when due date is hidden */}
        {!isViewingToday && <div className="mb-4" />}

        {/* Baby is here celebration */}
        {isViewingToday && babyIsHere && (
          <div
            className="rounded-xl px-4 py-5 mb-4"
            style={{ background: 'linear-gradient(135deg, #fef9c3, #fde68a)', border: '1px solid #f59e0b' }}
          >
            <p className="text-2xl mb-1" style={{ fontFamily: font }}>👶</p>
            <p className="text-lg font-bold mb-1" style={{ color: '#92400e', fontFamily: font }}>
              Your baby is here!
            </p>
            <p className="text-sm" style={{ color: '#92400e', fontFamily: font }}>
              You crushed <strong>{totalReps.toLocaleString()}</strong> pushups on this journey.
            </p>
            <p className="text-xs mt-1" style={{ color: '#b45309', fontFamily: font }}>
              That's one dedicated dad.
            </p>
          </div>
        )}

        {isDayZero ? (
          <div
            className="rounded-xl px-4 py-6 mb-4"
            style={{ background: '#f7f7f2', border: '1px solid #c2c1a5' }}
          >
            <p className="text-lg font-bold" style={{ color: '#556b2f', fontFamily: font }}>
              Rest day — {isViewingToday ? "it's day zero!" : 'day zero'}
            </p>
          </div>
        ) : (
          <>
            {/* Progress Ring */}
            <ProgressRing target={target} logged={viewLogged} />

            {/* Stats Row */}
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="text-center">
                <span className="block font-bold" style={{ fontSize: '30px', color: '#2a2e1f', fontFamily: font }}>
                  {target}
                </span>
                <span className="text-xs" style={{ color: '#6b6e5a', fontFamily: font }}>
                  {isViewingToday ? "Today's Goal" : 'Goal'}
                </span>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#c2c1a5' }} />
              <div className="text-center">
                {editing ? (
                  <div className="flex items-center gap-1 justify-center">
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      autoFocus
                      className="rounded-lg px-2 py-1 text-center outline-none"
                      style={{
                        width: '70px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        background: '#f7f7f2',
                        border: '1px solid #556b2f',
                        color: '#2a2e1f',
                        fontFamily: font,
                      }}
                    />
                    <button
                      onClick={handleEditSave}
                      className="cursor-pointer border-none bg-transparent text-lg"
                      title="Save"
                    >✓</button>
                    <button
                      onClick={handleEditCancel}
                      className="cursor-pointer border-none bg-transparent text-lg"
                      title="Cancel"
                    >✕</button>
                  </div>
                ) : (
                  <span
                    className="block font-bold cursor-pointer"
                    style={{ fontSize: '30px', color: '#2a2e1f', fontFamily: font }}
                    onClick={handleEditStart}
                    title="Click to edit"
                  >
                    {viewLogged} <span style={{ fontSize: '14px', color: '#7d8068' }}>✎</span>
                  </span>
                )}
                <span className="text-xs" style={{ color: '#6b6e5a', fontFamily: font }}>
                  Completed
                </span>
              </div>
            </div>

            {/* Log Input or Completion Banner */}
            {isComplete ? (
              <div
                className="rounded-xl px-4 py-4 mb-2"
                style={{ background: '#e8efe0', border: '1px solid #6b8f3c' }}
              >
                <p className="text-base font-bold" style={{ color: '#3d5a1e', fontFamily: font }}>
                  {isViewingToday
                    ? `🎉 Crushed it, Dad. That's ${viewLogged} reps for your little one.`
                    : `✓ ${viewLogged}/${target} reps completed`}
                </p>
                <button
                  onClick={handleEditStart}
                  className="mt-2 text-xs cursor-pointer bg-transparent border-none underline"
                  style={{ color: '#3d5a1e', fontFamily: font }}
                >
                  Edit count
                </button>
              </div>
            ) : (
              <LogInput onLog={handleLog} />
            )}
          </>
        )}
      </div>

      {/* Lifetime Total */}
      {totalReps > 0 && (
        <div className="mt-4 text-center">
          <span className="font-bold text-lg" style={{ color: '#2a2e1f', fontFamily: font }}>
            {totalReps.toLocaleString()}
          </span>
          <span className="text-xs ml-1" style={{ color: '#6b6e5a', fontFamily: font }}>
            total reps
          </span>
        </div>
      )}

      {/* Calendar */}
      <CalendarView
        history={history}
        lmpDate={lmpDate}
        cycleLength={cycleLength}
        todayKey={todayKey}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="mt-8 text-xs cursor-pointer bg-transparent border-none"
        style={{ color: '#7d8068', fontFamily: font, opacity: 0.6 }}
      >
        Reset all data
      </button>
    </div>
  );
}
