'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface AppearanceSettings {
  siteTitle: string;
  logoUrl: string;
  primaryColor: string;
  description: string;
  footerText: string;
}

const COLOR_PRESETS = [
  { label: 'Blau', value: '#3b82f6' },
  { label: 'Violett', value: '#8b5cf6' },
  { label: 'Grün', value: '#10b981' },
  { label: 'Orange', value: '#f59e0b' },
  { label: 'Rot', value: '#ef4444' },
  { label: 'Grau', value: '#6b7280' },
];

export default function AppearanceSettingsPage() {
  const [form, setForm] = useState<AppearanceSettings>({
    siteTitle: '',
    logoUrl: '',
    primaryColor: '#3b82f6',
    description: '',
    footerText: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.appearance) setForm(data.appearance);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appearance: form }),
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Lade Einstellungen…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Aussehen</h1>
        <p className="text-gray-500 text-sm mt-1">Passe das Erscheinungsbild der Plattform an.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Seiten-Titel</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={e => setForm(f => ({ ...f, siteTitle: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HTML to PDF Platform"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschreibung / Subtitle</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Convert HTML to PDF instantly"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo-URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
            {form.logoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={form.logoUrl} alt="Logo Vorschau" className="h-8 object-contain rounded" onError={e => (e.currentTarget.style.display = 'none')} />
                <span className="text-xs text-gray-400">Vorschau</span>
              </div>
            )}
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primärfarbe</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, primaryColor: preset.value }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    form.primaryColor === preset.value
                      ? 'border-gray-400 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.value }} />
                  {preset.label}
                  {form.primaryColor === preset.value && <Check className="w-3 h-3 text-gray-600" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="w-9 h-9 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Footer Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer-Text</label>
            <input
              type="text"
              value={form.footerText}
              onChange={e => setForm(f => ({ ...f, footerText: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="© 2025 Meine Firma"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Speichere…</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Gespeichert</>
          ) : (
            'Speichern'
          )}
        </button>
      </form>
    </div>
  );
}
