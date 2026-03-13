import { useState } from 'react';
import { authApi } from '../utils/api.js';

export default function AuthScreen({ onLogin, onSkip }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'sent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const font = "Georgia, 'Times New Roman', serif";

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await authApi.register(email, password);
        if (res.ok) {
          if (res.data?.message?.includes('Check your email')) {
            setMode('sent');
          } else {
            // Auto-verified — log in immediately
            const loginRes = await authApi.login(email, password);
            if (loginRes.ok) {
              onLogin(loginRes.data);
            } else {
              setMode('login');
              setError('Account created! Please log in.');
            }
          }
        } else {
          setError(res.data?.error || 'Registration failed');
        }
      } else {
        const res = await authApi.login(email, password);
        if (res.ok) {
          onLogin(res.data);
        } else {
          setError(res.data?.error || 'Login failed');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'sent') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #f0f0e8, #dddcca)' }}
      >
        <div
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center"
          style={{ border: '1px solid #c2c1a5' }}
        >
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#2a2e1f', fontFamily: font }}>
            Check your email
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6b6e5a', fontFamily: font }}>
            We sent a verification link to <strong>{email}</strong>. Click it, then come back and log in.
          </p>
          <button
            onClick={() => setMode('login')}
            className="w-full py-3 rounded-xl text-white font-bold text-base cursor-pointer"
            style={{ background: '#556b2f', fontFamily: font }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f0f0e8, #dddcca)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center"
        style={{ border: '1px solid #c2c1a5' }}
      >
        <div className="text-5xl mb-4">💪</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2a2e1f', fontFamily: font }}>
          Pump & Bump
        </h1>
        <p className="text-sm mb-6" style={{ color: '#6b6e5a', fontFamily: font }}>
          {mode === 'login' ? 'Welcome back, Dad' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            required
            className="w-full rounded-lg px-4 py-3 text-base mb-3 outline-none"
            style={{
              background: '#f7f7f2',
              border: '1px solid #c2c1a5',
              color: '#2a2e1f',
              fontFamily: font,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            required
            minLength={8}
            className="w-full rounded-lg px-4 py-3 text-base mb-3 outline-none"
            style={{
              background: '#f7f7f2',
              border: '1px solid #c2c1a5',
              color: '#2a2e1f',
              fontFamily: font,
            }}
          />

          {error && (
            <p className="text-sm text-left mb-2" style={{ color: '#b55a5a', fontFamily: font }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-white font-bold text-base cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#556b2f', fontFamily: font }}
          >
            {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          className="mt-4 text-sm cursor-pointer bg-transparent border-none"
          style={{ color: '#556b2f', fontFamily: font }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>

        <div style={{ borderTop: '1px solid #e5e5dc', margin: '16px 0' }} />

        <button
          onClick={onSkip}
          className="text-xs cursor-pointer bg-transparent border-none"
          style={{ color: '#7d8068', fontFamily: font }}
        >
          Continue without an account
        </button>
      </div>
    </div>
  );
}
