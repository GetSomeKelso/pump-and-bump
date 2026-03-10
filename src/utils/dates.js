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
  return conception.toISOString().split('T')[0];
}

export function getDaysOld(lmpDate, cycleLength) {
  const conceptionStr = getConceptionDate(lmpDate, cycleLength);
  const start = new Date(conceptionStr + 'T00:00:00');
  if (isNaN(start.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
}

export function getDaysOldOn(dateKey, lmpDate, cycleLength) {
  const conceptionStr = getConceptionDate(lmpDate, cycleLength);
  const start = new Date(conceptionStr + 'T00:00:00');
  if (isNaN(start.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  const day = new Date(dateKey + 'T00:00:00');
  day.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((day - start) / (1000 * 60 * 60 * 24)));
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
  const daysUntil = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return {
    dateStr: due.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    daysUntil,
  };
}

export function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
