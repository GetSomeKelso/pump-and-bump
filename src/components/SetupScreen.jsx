import { useState } from 'react';

export default function SetupScreen({ onComplete }) {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!date) {
      setError('Please select a date.');
      return;
    }
    const selected = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected > today) {
      setError('Date cannot be in the future.');
      return;
    }
    onComplete(date);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
         style={{ background: 'linear-gradient(135deg, #f0f0e8, #dddcca)' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center"
           style={{ border: '1px solid #c2c1a5' }}>
        <div className="text-5xl mb-4">💪</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2a2e1f', fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Pump & Bump
        </h1>
        <p className="text-sm mb-6" style={{ color: '#6b6e5a', fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Dad reps for every day of the journey
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-left text-sm font-semibold mb-1"
                 style={{ color: '#2a2e1f', fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Conception Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(''); }}
            className="w-full rounded-lg px-4 py-3 text-base mb-1 outline-none"
            style={{
              background: '#f7f7f2',
              border: '1px solid #c2c1a5',
              color: '#2a2e1f',
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          />
          {error && (
            <p className="text-sm text-left mb-2" style={{ color: '#b55a5a', fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: '#556b2f',
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Let's Go
          </button>
        </form>
      </div>
    </div>
  );
}
