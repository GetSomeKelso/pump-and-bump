import { useState } from 'react';

const DEFAULT_CYCLE = 28;

export default function SetupScreen({ onComplete }) {
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(DEFAULT_CYCLE);
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
    const cl = parseInt(cycleLength, 10);
    if (!cl || cl < 20 || cl > 45) {
      setError('Cycle length should be between 20 and 45 days.');
      return;
    }
    onComplete(date, cl);
  }

  const font = "Georgia, 'Times New Roman', serif";

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
         style={{ background: 'linear-gradient(135deg, #f0f0e8, #dddcca)' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center"
           style={{ border: '1px solid #c2c1a5' }}>
        <div className="text-5xl mb-4">💪</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2a2e1f', fontFamily: font }}>
          Pump & Bump
        </h1>
        <p className="text-sm mb-6" style={{ color: '#6b6e5a', fontFamily: font }}>
          Dad reps for every day of the journey
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-left text-sm font-semibold mb-1"
                 style={{ color: '#2a2e1f', fontFamily: font }}>
            Last Menstrual Period (LMP)
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(''); }}
            className="w-full rounded-lg px-4 py-3 text-base mb-4 outline-none"
            style={{
              background: '#f7f7f2',
              border: '1px solid #c2c1a5',
              color: '#2a2e1f',
              fontFamily: font,
            }}
          />

          <label className="block text-left text-sm font-semibold mb-1"
                 style={{ color: '#2a2e1f', fontFamily: font }}>
            Cycle Length
          </label>
          <div className="flex items-center gap-3 mb-1">
            <input
              type="range"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => { setCycleLength(e.target.value); setError(''); }}
              className="flex-1"
              style={{ accentColor: '#556b2f' }}
            />
            <span
              className="font-bold text-lg"
              style={{ color: '#2a2e1f', fontFamily: font, minWidth: '60px', textAlign: 'center' }}
            >
              {cycleLength} days
            </span>
          </div>
          <p className="text-xs text-left mb-4" style={{ color: '#7d8068', fontFamily: font }}>
            Standard is 28 days. Adjust if her cycle is longer or shorter.
          </p>

          {error && (
            <p className="text-sm text-left mb-2" style={{ color: '#b55a5a', fontFamily: font }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: '#556b2f',
              fontFamily: font,
            }}
          >
            Let's Go
          </button>
        </form>
      </div>
    </div>
  );
}
