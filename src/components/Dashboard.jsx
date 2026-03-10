import { useState } from 'react';
import { getDaysOld, getTodayKey } from '../utils/dates.js';
import { getLoggedToday, addReps, getHistory, clearAll } from '../utils/storage.js';
import { getMilestone } from '../data/milestones.js';
import ProgressRing from './ProgressRing.jsx';
import LogInput from './LogInput.jsx';
import HistoryList from './HistoryList.jsx';

export default function Dashboard({ conceptionDate, onReset }) {
  const todayKey = getTodayKey();
  const daysOld = getDaysOld(conceptionDate);
  const target = daysOld;
  const [logged, setLogged] = useState(() => getLoggedToday(todayKey));
  const [history, setHistory] = useState(() => getHistory());
  const remaining = Math.max(target - logged, 0);
  const isComplete = logged >= target && target > 0;
  const isDayZero = target === 0;

  function handleLog(reps) {
    const newTotal = addReps(todayKey, reps);
    setLogged(newTotal);
    setHistory(getHistory());
  }

  function handleReset() {
    if (window.confirm('Reset all data?')) {
      clearAll();
      onReset();
    }
  }

  const font = "Georgia, 'Times New Roman', serif";

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
        {/* Days Old Badge */}
        <div className="mb-1">
          <span
            className="block font-bold"
            style={{ fontSize: '56px', color: '#2a2e1f', fontFamily: font, lineHeight: 1.1 }}
          >
            {daysOld}
          </span>
          <span className="text-sm" style={{ color: '#6b6e5a', fontFamily: font }}>
            days old
          </span>
        </div>

        {/* Milestone */}
        <p className="italic text-sm mb-4" style={{ color: '#7d8068', fontFamily: font }}>
          {getMilestone(daysOld)}
        </p>

        {isDayZero ? (
          /* Day Zero */
          <div
            className="rounded-xl px-4 py-6 mb-4"
            style={{ background: '#f7f7f2', border: '1px solid #c2c1a5' }}
          >
            <p className="text-lg font-bold" style={{ color: '#556b2f', fontFamily: font }}>
              Rest day — it's day zero!
            </p>
          </div>
        ) : (
          <>
            {/* Progress Ring */}
            <ProgressRing target={target} logged={logged} />

            {/* Stats Row */}
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="text-center">
                <span className="block font-bold" style={{ fontSize: '30px', color: '#2a2e1f', fontFamily: font }}>
                  {target}
                </span>
                <span className="text-xs" style={{ color: '#6b6e5a', fontFamily: font }}>
                  Today's Goal
                </span>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#c2c1a5' }} />
              <div className="text-center">
                <span className="block font-bold" style={{ fontSize: '30px', color: '#2a2e1f', fontFamily: font }}>
                  {logged}
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
                  🎉 Crushed it, Dad. That's {logged} reps for your little one.
                </p>
              </div>
            ) : (
              <LogInput onLog={handleLog} />
            )}
          </>
        )}
      </div>

      {/* History */}
      <HistoryList history={history} conceptionDate={conceptionDate} todayKey={todayKey} />

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
