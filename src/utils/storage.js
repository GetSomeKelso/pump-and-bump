import { setupApi, progressApi } from './api.js';
export { progressApi };

const STORAGE_KEY = 'pump-and-bump';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let _authed = false;

export function setAuthed(val) {
  _authed = !!val;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;

    // Migrate legacy conceptionDate → lmpDate (treat as LMP with 28-day cycle)
    if (data.conceptionDate && !data.lmpDate) {
      data.lmpDate = data.conceptionDate;
      data.cycleLength = 28;
      delete data.conceptionDate;
    }

    // Validate lmpDate
    if (data.lmpDate && (typeof data.lmpDate !== 'string' || !DATE_RE.test(data.lmpDate))) {
      data.lmpDate = null;
    }
    // Validate cycleLength
    if (typeof data.cycleLength !== 'number' || !Number.isFinite(data.cycleLength) || data.cycleLength < 20 || data.cycleLength > 45) {
      data.cycleLength = 28;
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

export function getSetup() {
  const data = load();
  if (!data?.lmpDate) return null;
  return { lmpDate: data.lmpDate, cycleLength: data.cycleLength ?? 28 };
}

export function saveSetup(lmpDate, cycleLength) {
  const data = load() || {};
  data.lmpDate = lmpDate;
  data.cycleLength = cycleLength;
  if (!data.history) data.history = {};
  save(data);

  if (_authed) {
    setupApi.save(lmpDate, cycleLength).catch(() => {});
  }
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

  if (_authed) {
    progressApi.addReps(todayKey, reps).catch(() => {});
  }

  return data.history[todayKey].logged;
}

export function setReps(dateKey, logged) {
  const data = load() || {};
  if (!data.history) data.history = {};
  if (logged <= 0) {
    delete data.history[dateKey];
  } else {
    data.history[dateKey] = { logged };
  }
  save(data);

  if (_authed) {
    progressApi.setReps(dateKey, logged).catch(() => {});
  }

  return logged;
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Sync server data into localStorage. Called after login.
 * Merges server history with local, keeping the higher value for each date.
 */
export async function syncFromServer(serverSetup, serverHistory) {
  const data = load() || {};

  // If server has setup data, use it
  if (serverSetup?.lmpDate) {
    data.lmpDate = serverSetup.lmpDate;
    data.cycleLength = serverSetup.cycleLength ?? 28;
  }

  if (!data.history) data.history = {};

  // Merge server history (keep max)
  if (serverHistory) {
    for (const [dateKey, entry] of Object.entries(serverHistory)) {
      const serverVal = entry?.logged ?? 0;
      const localVal = data.history[dateKey]?.logged ?? 0;
      data.history[dateKey] = { logged: Math.max(serverVal, localVal) };
    }
  }

  save(data);
  return { lmpDate: data.lmpDate, cycleLength: data.cycleLength ?? 28 };
}

/**
 * Upload local data to server on first login.
 */
export async function syncToServer() {
  const data = load();
  if (!data) return;

  if (data.lmpDate) {
    await setupApi.save(data.lmpDate, data.cycleLength ?? 28).catch(() => {});
  }

  if (data.history && Object.keys(data.history).length > 0) {
    await progressApi.sync(data.history).catch(() => {});
  }
}
