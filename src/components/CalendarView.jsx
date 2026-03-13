import { useState } from 'react';
import {
  getDaysOldOn,
  getConceptionDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  buildDateKey,
  getPregnancyMarkers,
} from '../utils/dates.js';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarView({ history, lmpDate, cycleLength, todayKey, selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const conceptionDate = getConceptionDate(lmpDate, cycleLength);
  const conceptionYear = parseInt(conceptionDate.slice(0, 4), 10);
  const conceptionMonth = parseInt(conceptionDate.slice(5, 7), 10) - 1;

  const markers = getPregnancyMarkers(lmpDate, cycleLength);

  // Allow navigating up to the due-date month so future milestones are visible
  const lastMarkerKey = Object.keys(markers).sort().pop() || todayKey;
  const lastMarkerYear = parseInt(lastMarkerKey.slice(0, 4), 10);
  const lastMarkerMonth = parseInt(lastMarkerKey.slice(5, 7), 10) - 1;

  const font = "Georgia, 'Times New Roman', serif";

  /* ── Month navigation ── */
  const canGoPrev = viewYear > conceptionYear || (viewYear === conceptionYear && viewMonth > conceptionMonth);
  const canGoNext = viewYear < lastMarkerYear || (viewYear === lastMarkerYear && viewMonth < lastMarkerMonth);

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
      const isBeforeLmp = dateKey < lmpDate;
      const isFuture = dateKey > todayKey;
      const isToday = dateKey === todayKey;
      const isSelected = dateKey === selectedDate;

      const goal = isBeforeLmp ? 0 : getDaysOldOn(dateKey, lmpDate, cycleLength);
      const logged = history[dateKey]?.logged ?? 0;
      const complete = !isFuture && goal > 0 && logged >= goal;
      const partial = !isFuture && goal > 0 && logged > 0 && logged < goal;

      const marker = markers[dateKey] || null;
      cells.push({ dayNum, dateKey, isBeforeLmp, isFuture, isToday, isSelected, goal, logged, complete, partial, marker });
    }
  }

  /* ── Milestones list sorted by date ── */
  const milestoneList = Object.entries(markers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, m]) => {
      const d = new Date(dateKey + 'T00:00:00');
      const isPast = dateKey <= todayKey;
      return {
        dateKey,
        label: m.label,
        icon: m.icon,
        color: m.color,
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isPast,
      };
    });

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

            const { dayNum, dateKey, isBeforeLmp, isFuture, isToday, isSelected, complete, partial, marker } = cell;

            let bg = '#f7f7f2';
            let color = '#2a2e1f';
            let dotColor = null;

            if (isSelected) {
              bg = '#556b2f';
              color = '#ffffff';
              dotColor = complete ? '#a3d977' : partial ? '#d4c87a' : null;
            } else if (isBeforeLmp) {
              bg = 'transparent';
              color = '#c2c1a5';
            } else if (marker && isFuture) {
              bg = marker.color + '20';
              color = marker.color;
            } else if (isFuture) {
              bg = '#fafaf6';
              color = '#a0a08e';
            } else if (marker) {
              bg = marker.color + '25';
              color = '#2a2e1f';
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
                onClick={() => !isBeforeLmp && !isFuture && onSelectDate(dateKey)}
                disabled={isBeforeLmp}
                aria-selected={isSelected}
                title={marker ? marker.label : undefined}
                className="flex flex-col items-center justify-center border-none cursor-pointer"
                style={{
                  background: bg,
                  color,
                  fontFamily: font,
                  fontSize: '13px',
                  fontWeight: isToday || isSelected || marker ? 'bold' : 'normal',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  outline: isToday && !isSelected
                    ? '2px solid #556b2f'
                    : marker && !isSelected
                      ? `2px solid ${marker.color}`
                      : 'none',
                  outlineOffset: '-2px',
                  cursor: isBeforeLmp || isFuture ? 'default' : 'pointer',
                  position: 'relative',
                }}
              >
                {marker && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: '2px',
                      fontSize: '10px',
                      lineHeight: 1,
                      color: isSelected ? '#ffffff' : marker.color,
                    }}
                  >
                    {marker.icon}
                  </span>
                )}
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

        {/* Milestone legend */}
        <div
          className="mt-3 pt-3 flex flex-wrap gap-x-3 gap-y-1"
          style={{ borderTop: '1px solid #e8e7d9' }}
        >
          {[
            { icon: '✦', label: 'Conception', color: '#8b5cf6' },
            { icon: '▸', label: '2nd Tri', color: '#d97706' },
            { icon: '▸', label: '3rd Tri', color: '#dc2626' },
            { icon: '★', label: 'Full Term', color: '#16a34a' },
            { icon: '♥', label: 'Due Date', color: '#e11d48' },
          ].map((m) => (
            <span
              key={m.label}
              className="flex items-center gap-1"
              style={{ fontSize: '10px', color: '#6b6e5a', fontFamily: font }}
            >
              <span style={{ color: m.color, fontSize: '10px' }}>{m.icon}</span>
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Upcoming milestones list */}
      <div
        className="rounded-xl p-4 mt-3"
        style={{ background: '#fff', border: '1px solid #c2c1a5' }}
      >
        <h4
          className="text-sm font-bold mb-2"
          style={{ color: '#2a2e1f', fontFamily: font }}
        >
          Milestones
        </h4>
        <div className="flex flex-col gap-2">
          {milestoneList.map((m) => (
            <div
              key={m.dateKey}
              className="flex items-center gap-3"
              style={{ opacity: m.isPast ? 0.5 : 1 }}
            >
              <span
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: '32px',
                  height: '32px',
                  background: m.color + '20',
                  color: m.color,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                {m.icon}
              </span>
              <div className="flex-1">
                <span
                  className="block text-sm font-bold"
                  style={{ color: '#2a2e1f', fontFamily: font }}
                >
                  {m.label}
                </span>
                <span
                  className="block text-xs"
                  style={{ color: '#6b6e5a', fontFamily: font }}
                >
                  {m.dateStr}
                  {m.isPast ? ' — reached' : ''}
                </span>
              </div>
              {m.isPast && (
                <span style={{ color: '#6b8f3c', fontSize: '14px' }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
