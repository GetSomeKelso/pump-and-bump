import { useState } from 'react';

export default function LogInput({ onLog }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const reps = parseInt(value, 10);
    if (!reps || reps <= 0) return;
    onLog(reps);
    setValue('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center w-full max-w-xs mx-auto my-4">
      <input
        type="number"
        min="1"
        inputMode="numeric"
        placeholder="How many did you do?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-lg px-4 py-3 text-base outline-none"
        style={{
          background: '#f7f7f2',
          border: '1px solid #c2c1a5',
          color: '#2a2e1f',
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      />
      <button
        type="submit"
        className="rounded-xl px-5 py-3 text-white font-bold text-base cursor-pointer transition-opacity hover:opacity-90"
        style={{
          background: saved ? '#6b8f3c' : '#556b2f',
          fontFamily: "Georgia, 'Times New Roman', serif",
          minWidth: '80px',
          transition: 'background 0.3s ease',
        }}
      >
        {saved ? '\u2713 Saved!' : 'Log'}
      </button>
    </form>
  );
}
