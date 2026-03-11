import { useState } from 'react';
import { getDaysOld, getDaysOldOn, getDueDate, getTodayKey, formatDate } from '../utils/dates.js';
import { getLoggedToday, addReps, getHistory, clearAll } from '../utils/storage.js';
import { getMilestone } from '../data/milestones.js';
import ProgressRing from './ProgressRing.jsx';
import LogInput from './LogInput.jsx';
import CalendarView from './CalendarView.jsx';

export default function Dashboard({ lmpDate, cycleLength, onReset }) {
  const todayKey = getTodayKey();
  const [logged, setLogged] = useState(() => getLoggedToday(todayKey));
  const [history, setHistory] = useState(() => getHistory());
  const [selectedDate, setSelectedDate] = useState(null);

  const dueDate = getDueDate(lmpDate, cycleLength);
  const font = "Georgia, 'Times New Roman', serif";

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
                <span className="block font-bold" style={{ fontSize: '30px', color: '#2a2e1f', fontFamily: font }}>
                  {viewLogged}
                </span>
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
              </div>
            ) : (
              <LogInput onLog={handleLog} />
            )}
          </>
        )}
      </div>

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
