import { getDaysOld } from '../utils/dates.js';
import { formatDate } from '../utils/dates.js';

export default function HistoryList({ history, conceptionDate, todayKey }) {
  const days = Object.keys(history)
    .filter((key) => key !== todayKey)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7);

  if (days.length === 0) return null;

  return (
    <div className="w-full max-w-sm mx-auto mt-6">
      <h3 className="text-sm font-bold mb-3" style={{ color: '#2a2e1f', fontFamily: "Georgia, 'Times New Roman', serif" }}>
        Recent History
      </h3>
      <div className="flex flex-col gap-2">
        {days.map((dateKey) => {
          const dayDate = new Date(dateKey + 'T00:00:00');
          const concDate = new Date(conceptionDate);
          concDate.setHours(0, 0, 0, 0);
          dayDate.setHours(0, 0, 0, 0);
          const goal = Math.floor((dayDate - concDate) / (1000 * 60 * 60 * 24));
          const logged = history[dateKey]?.logged ?? 0;
          const complete = logged >= goal;

          return (
            <div
              key={dateKey}
              className="flex items-center justify-between rounded-lg px-4 py-2"
              style={{
                background: '#f7f7f2',
                border: '1px solid #c2c1a5',
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              <span className="text-sm" style={{ color: '#2a2e1f' }}>
                {formatDate(dateKey)}
              </span>
              <span className="text-xs" style={{ color: '#6b6e5a' }}>
                Goal: {goal}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: complete ? '#6b8f3c' : '#8a7a3c' }}
              >
                {complete ? `\u2713 ${logged}` : `${logged}/${goal}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
