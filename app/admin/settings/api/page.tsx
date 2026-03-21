'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, RefreshCw, Check, Loader2, AlertTriangle } from 'lucide-react';

export default function ApiSettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [rateLimitRequests, setRateLimitRequests] = useState(100);
  const [rateLimitWindowMs, setRateLimitWindowMs] = useState(3600000);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/settings').then(r => r.json()),
    ]).then(([settings]) => {
      if (settings.api) {
        setRateLimitRequests(settings.api.rateLimitRequests ?? 100);
        setRateLimitWindowMs(settings.api.rateLimitWindowMs ?? 3600000);
      }
    }).finally(() => setLoading(false));

    // Load API key from env (masked by server)
    fetch('/api/status').then(r => r.json()).then(() => {
      // API key is not exposed via status; we show placeholder
      setApiKey(process.env.NODE_ENV === 'development' ? 'sk_prod_**** (in .env)' : 'sk_prod_**** (in .env)');
    });
  }, []);

  async function handleSaveApi(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api: { rateLimitRequests, rateLimitWindowMs } }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Fehler beim Speichern');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 8) {
      setPwError('Das neue Passwort muss mindestens 8 Zeichen haben.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('Die Passwörter stimmen nicht überein.');
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPw }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Fehler');
      setPwSaved(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Lade Einstellungen…
      </div>
    );
  }

  const windowHours = Math.round(rateLimitWindowMs / 3600000);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API & Sicherheit</h1>
        <p className="text-gray-500 text-sm mt-1">API-Key, Rate-Limits und Admin-Passwort.</p>
      </div>

      {/* API Key Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">API-Key</h2>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700">
            {showKey ? apiKey : apiKey.replace(/sk_prod_[^(]*/,'sk_prod_••••••••••••')}
          </div>
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500"
            aria-label="API-Key anzeigen/verbergen"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Der API-Key ist in der Datei <code className="font-mono">/opt/html-to-pdf/.env</code> gespeichert.
            Um ihn zu ändern, bearbeite die Datei direkt und starte den Service neu:
            {' '}<code className="font-mono">systemctl restart html-to-pdf</code>
          </p>
        </div>
      </div>

      {/* Rate Limits */}
      <form onSubmit={handleSaveApi} className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Rate-Limiting</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max. Anfragen
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={rateLimitRequests}
              onChange={e => setRateLimitRequests(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Zeitfenster (Stunden)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={windowHours}
              onChange={e => setRateLimitWindowMs(Number(e.target.value) * 3600000)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Aktuell: max. <strong>{rateLimitRequests}</strong> Anfragen pro <strong>{windowHours} Stunde{windowHours > 1 ? 'n' : ''}</strong> pro API-Key.
        </p>
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Speichere…</> :
           saved ? <><Check className="w-4 h-4" /> Gespeichert</> : 'Speichern'}
        </button>
      </form>

      {/* Password Change */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Admin-Passwort ändern</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Neues Passwort</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              minLength={8}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mindestens 8 Zeichen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort bestätigen</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Passwort wiederholen"
            />
          </div>
        </div>
        {pwError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mt-4">{pwError}</div>
        )}
        <button
          type="submit"
          disabled={pwSaving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {pwSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Speichere…</> :
           pwSaved ? <><Check className="w-4 h-4" /> Passwort geändert</> : 'Passwort ändern'}
        </button>
      </form>
    </div>
  );
}
