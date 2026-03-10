import { useState } from 'react';
import SetupScreen from './components/SetupScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import { getConceptionDate, setConceptionDate } from './utils/storage.js';

export default function App() {
  const [conceptionDate, setDate] = useState(() => getConceptionDate());

  function handleSetup(date) {
    setConceptionDate(date);
    setDate(date);
  }

  function handleReset() {
    setDate(null);
  }

  if (!conceptionDate) {
    return <SetupScreen onComplete={handleSetup} />;
  }

  return <Dashboard conceptionDate={conceptionDate} onReset={handleReset} />;
}
