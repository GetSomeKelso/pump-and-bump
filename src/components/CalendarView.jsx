import { useState } from 'react';
import {
  getDaysOldOn,
  getConceptionDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  buildDateKey,
} from '../utils/dates.js';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarView({ history, lmpDate, cycleLength, todayKey, selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const conceptionDate = getConceptionDate(lmpDate, cycleLength);
  const conceptionYear = parseInt(conceptionDate.slice(0, 4), 10);
  const conceptionMonth = parseInt(conceptionDate.slice(5, 7), 10) - 1;

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const font = "Georgia, 'Times New Roman', serif";

  /* ── Month navigation ── */
  const canGoPrev = viewYear > conceptionYear || (viewYear === conceptionYear && viewMonth > conceptionMonth);
  const canGoNext = viewYear < currentYear || (viewYear === currentYear && viewMonth < currentMonth);

  function prevMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  /* ── Grid computation ── */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  /* ── Build cells ── */
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < firstDay || i >= firstDay + daysInMonth) {
      cells.push(null);
    } else {
      const dayNum = i - firstDay + 1;
      const dateKey = buildDateKey(viewYear, viewMonth, dayNum);
      const isBeforeConception = dateKey < conceptionDate;
      const isFuture = dateKey > todayKey;
      const isDisabled = isBeforeConception || isFuture;
      const isToday = dateKey === todayKey;
      const isSelected = dateKey === selectedDate;

      const goal = isDisabled ? 0 : getDaysOldOn(dateKey, lmpDate, cycleLength);
      const logged = history[dateKey]?.logged ?? 0;
      const complete = goal > 0 && logged >= goal;
      const partial = goal > 0 && logged > 0 && logged < goal;

      cells.push({ dayNum, dateKey, isDisabled, isToday, isSelected, goal, logged, complete, partial });
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-6">
      <h3
        className="text-sm font-bold mb-3"
        style={{ color: '#2a2e1f', fontFamily: font }}
      >
        Calendar
      </h3>

      <div
        className="rounded-xl p-4"
        style={{ background: '#fff', border: '1px solid #c2c1a5' }}
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none"
            style={{
              background: canGoPrev ? '#f7f7f2' : 'transparent',
              color: canGoPrev ? '#556b2f' : '#c2c1a5',
              fontFamily: font,
              fontSize: '18px',
              fontWeight: 'bold',
            }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span
            className="text-sm font-bold"
            style={{ color: '#2a2e1f', fontFamily: font }}
          >
            {monthLabel}
          </span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none"
            style={{
              background: canGoNext ? '#f7f7f2' : 'transparent',
              color: canGoNext ? '#556b2f' : '#c2c1a5',
              fontFamily: font,
              fontSize: '18px',
              fontWeight: 'bold',
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Weekday header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-xs py-1"
              style={{ color: '#6b6e5a', fontFamily: font }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {cells.map((cell, i) => {
            if (!cell) {
              return <div key={i} />;
            }

            const { dayNum, dateKey, isDisabled, isToday, isSelected, complete, partial } = cell;

            let bg = '#f7f7f2';
            let color = '#2a2e1f';
            let dotColor = null;

            if (isSelected) {
              bg = '#556b2f';
              color = '#ffffff';
              dotColor = complete ? '#a3d977' : partial ? '#d4c87a' : null;
            } else if (isDisabled) {
              bg = 'transparent';
              color = '#c2c1a5';
            } else if (complete) {
              bg = '#e8efe0';
              color = '#3d5a1e';
              dotColor = '#6b8f3c';
            } else if (partial) {
              bg = '#f5f0dc';
              color = '#8a7a3c';
              dotColor = '#8a7a3c';
            }

            return (
              <button
                key={i}
                onClick={() => !isDisabled && onSelectDate(dateKey)}
                disabled={isDisabled}
                aria-selected={isSelected}
                className="flex flex-col items-center justify-center border-none cursor-pointer"
                style={{
                  background: bg,
                  color,
                  fontFamily: font,
                  fontSize: '13px',
                  fontWeight: isToday || isSelected ? 'bold' : 'normal',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  outline: isToday && !isSelected ? '2px solid #556b2f' : 'none',
                  outlineOffset: '-2px',
                  cursor: isDisabled ? 'default' : 'pointer',
                  position: 'relative',
                }}
              >
                {dayNum}
                {dotColor && (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: dotColor,
                      position: 'absolute',
                      bottom: '4px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
