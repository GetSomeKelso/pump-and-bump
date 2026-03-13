/**
 * Estimate conception date from LMP and cycle length.
 * Ovulation typically occurs ~14 days before the next period,
 * so conception ≈ LMP + (cycleLength - 14) days.
 */
export function getConceptionDate(lmpDate, cycleLength) {
  const lmp = new Date(lmpDate + 'T00:00:00');
  if (isNaN(lmp.getTime())) return lmpDate;
  const conception = new Date(lmp);
  conception.setDate(conception.getDate() + (cycleLength - 14));
  return buildDateKey(conception.getFullYear(), conception.getMonth(), conception.getDate());
}

export function getDaysOld(lmpDate, cycleLength) {
  const start = new Date(lmpDate + 'T00:00:00');
  if (isNaN(start.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today - start) / (1000 * 60 * 60 * 24)));
}

export function getDaysOldOn(dateKey, lmpDate, cycleLength) {
  const start = new Date(lmpDate + 'T00:00:00');
  if (isNaN(start.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  const day = new Date(dateKey + 'T00:00:00');
  day.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((day - start) / (1000 * 60 * 60 * 24)));
}

/**
 * Estimated due date = conception + 266 days.
 * Returns { dateStr, daysUntil }.
 */
export function getDueDate(lmpDate, cycleLength) {
  const conceptionStr = getConceptionDate(lmpDate, cycleLength);
  const conception = new Date(conceptionStr + 'T00:00:00');
  if (isNaN(conception.getTime())) return null;
  const due = new Date(conception);
  due.setDate(due.getDate() + 266);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const daysUntil = Math.round((due - today) / (1000 * 60 * 60 * 24));
  return {
    dateStr: due.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    daysUntil,
  };
}

export function getTodayKey() {
  const today = new Date();
  return buildDateKey(today.getFullYear(), today.getMonth(), today.getDate());
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function buildDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/**
 * Returns a map of dateKey → { label, color, icon } for pregnancy milestones.
 */
export function getPregnancyMarkers(lmpDate, cycleLength) {
  const conceptionStr = getConceptionDate(lmpDate, cycleLength);
  const conception = new Date(conceptionStr + 'T00:00:00');
  if (isNaN(conception.getTime())) return {};

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function toKey(date) {
    return buildDateKey(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const markers = {};

  // Conception
  markers[conceptionStr] = { label: 'Conception', color: '#8b5cf6', icon: '✦' };

  // End of 1st trimester (12 weeks)
  const tri1 = addDays(conception, 84);
  markers[toKey(tri1)] = { label: '2nd Trimester', color: '#d97706', icon: '▸' };

  // End of 2nd trimester / start of 3rd (27 weeks)
  const tri2 = addDays(conception, 189);
  markers[toKey(tri2)] = { label: '3rd Trimester', color: '#dc2626', icon: '▸' };

  // Full term (37 weeks)
  const fullTerm = addDays(conception, 259);
  markers[toKey(fullTerm)] = { label: 'Full Term', color: '#16a34a', icon: '★' };

  // Due date (38 weeks / 266 days)
  const due = addDays(conception, 266);
  markers[toKey(due)] = { label: 'Due Date', color: '#e11d48', icon: '♥' };

  return markers;
}
