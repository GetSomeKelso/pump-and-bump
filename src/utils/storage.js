const STORAGE_KEY = 'pump-and-bump';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;
    // Validate conceptionDate
    if (data.conceptionDate && (typeof data.conceptionDate !== 'string' || !DATE_RE.test(data.conceptionDate))) {
      data.conceptionDate = null;
    }
    // Validate history entries
    if (data.history && typeof data.history === 'object') {
      for (const [key, val] of Object.entries(data.history)) {
        if (!DATE_RE.test(key) || typeof val?.logged !== 'number' || !Number.isFinite(val.logged) || val.logged < 0) {
          delete data.history[key];
        }
      }
    } else {
      data.history = {};
    }
    return data;
  } catch {
    return null;
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // QuotaExceededError — fail silently
  }
}

export function getConceptionDate() {
  return load()?.conceptionDate ?? null;
}

export function setConceptionDate(date) {
  const data = load() || {};
  data.conceptionDate = date;
  if (!data.history) data.history = {};
  save(data);
}

export function getHistory() {
  return load()?.history ?? {};
}

export function getLoggedToday(todayKey) {
  const history = getHistory();
  return history[todayKey]?.logged ?? 0;
}

export function addReps(todayKey, reps) {
  const data = load() || {};
  if (!data.history) data.history = {};
  if (!data.history[todayKey]) data.history[todayKey] = { logged: 0 };
  const current = data.history[todayKey].logged;
  data.history[todayKey].logged = (Number.isFinite(current) ? current : 0) + reps;
  save(data);
  return data.history[todayKey].logged;
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}
