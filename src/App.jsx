import { useState } from 'react';
import SetupScreen from './components/SetupScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import { getSetup, saveSetup } from './utils/storage.js';

export default function App() {
  const [setup, setSetup] = useState(() => getSetup());

  function handleSetup(lmpDate, cycleLength) {
    saveSetup(lmpDate, cycleLength);
    setSetup({ lmpDate, cycleLength });
  }

  function handleReset() {
    setSetup(null);
  }

  if (!setup) {
    return <SetupScreen onComplete={handleSetup} />;
  }

  return (
    <Dashboard
      lmpDate={setup.lmpDate}
      cycleLength={setup.cycleLength}
      onReset={handleReset}
    />
  );
}
