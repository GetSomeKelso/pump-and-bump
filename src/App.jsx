import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen.jsx';
import SetupScreen from './components/SetupScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import { getSetup, saveSetup, setAuthed, syncFromServer, syncToServer } from './utils/storage.js';
import { authApi, progressApi } from './utils/api.js';

export default function App() {
  const [user, setUser] = useState(null);        // null = not logged in
  const [authChecked, setAuthChecked] = useState(false);
  const [skippedAuth, setSkippedAuth] = useState(false);
  const [setup, setSetup] = useState(() => getSetup());
  const [verifyMsg, setVerifyMsg] = useState('');

  // Check for email verification redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verify = params.get('verify');
    if (verify === 'success') setVerifyMsg('Email verified! You can now log in.');
    else if (verify === 'expired') setVerifyMsg('Verification link expired. Please register again.');
    else if (verify === 'invalid') setVerifyMsg('Invalid verification link.');
    if (verify) window.history.replaceState({}, '', '/');
  }, []);

  // Check existing session on mount
  useEffect(() => {
    authApi.me().then(async (res) => {
      if (res.ok && res.data?.user) {
        setUser(res.data.user);
        setAuthed(true);

        // Sync server data into local
        const serverHistory = await progressApi.getAll();
        const merged = await syncFromServer(
          res.data.setup,
          serverHistory.ok ? serverHistory.data : null
        );
        if (merged.lmpDate) setSetup({ lmpDate: merged.lmpDate, cycleLength: merged.cycleLength });
      }
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  async function handleLogin(data) {
    setUser(data.user);
    setAuthed(true);

    // Upload any local data to server first
    await syncToServer();

    // Then pull merged data from server
    const serverHistory = await progressApi.getAll();
    const merged = await syncFromServer(
      data.setup,
      serverHistory.ok ? serverHistory.data : null
    );
    if (merged.lmpDate) setSetup({ lmpDate: merged.lmpDate, cycleLength: merged.cycleLength });
  }

  async function handleLogout() {
    await authApi.logout();
    setUser(null);
    setAuthed(false);
  }

  function handleSetup(lmpDate, cycleLength) {
    saveSetup(lmpDate, cycleLength);
    setSetup({ lmpDate, cycleLength });
  }

  function handleReset() {
    setSetup(null);
  }

  // Show loading while checking auth
  if (!authChecked) return null;

  // Show auth screen if not logged in and hasn't skipped
  if (!user && !skippedAuth) {
    return (
      <>
        {verifyMsg && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            background: verifyMsg.includes('verified') ? '#e8efe0' : '#fde8e8',
            color: verifyMsg.includes('verified') ? '#3d5a1e' : '#b55a5a',
            textAlign: 'center', padding: '12px', fontFamily: "Georgia, serif",
            fontSize: '14px', fontWeight: 'bold',
          }}>
            {verifyMsg}
          </div>
        )}
        <AuthScreen onLogin={handleLogin} onSkip={() => setSkippedAuth(true)} />
      </>
    );
  }

  if (!setup) {
    return <SetupScreen onComplete={handleSetup} />;
  }

  return (
    <Dashboard
      lmpDate={setup.lmpDate}
      cycleLength={setup.cycleLength}
      onReset={handleReset}
      user={user}
      onLogout={handleLogout}
    />
  );
}
