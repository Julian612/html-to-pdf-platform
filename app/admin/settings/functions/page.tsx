'use client';

import { useEffect, useState } from 'react';
import { tools } from '@/lib/tools-config';
import { Check, Loader2 } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  pdf: 'PDF-Tools',
  images: 'Bild-Tools',
  files: 'Datei-Tools',
  utilities: 'Hilfsmittel',
};

export default function FunctionsSettingsPage() {
  const [toolStates, setToolStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.tools) setToolStates(data.tools);
        else {
          const defaults: Record<string, boolean> = {};
          tools.forEach(t => (defaults[t.id] = true));
          setToolStates(defaults);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setToolStates(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools: toolStates }),
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

  const categories = ['pdf', 'images', 'files', 'utilities'] as const;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Lade Einstellungen…
      </div>
    );
  }

  const enabledCount = Object.values(toolStates).filter(Boolean).length;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Funktionen</h1>
        <p className="text-gray-500 text-sm mt-1">
          Aktiviere oder deaktiviere einzelne Tools auf der Startseite.
          {' '}
          <span className="font-medium text-gray-700">{enabledCount} / {tools.length} aktiv</span>
        </p>
      </div>

      <div className="space-y-6">
        {categories.map(cat => {
          const catTools = tools.filter(t => t.category === cat);
          return (
            <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">{CATEGORY_LABELS[cat]}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {catTools.map(tool => {
                  const Icon = tool.icon;
                  const enabled = toolStates[tool.id] !== false;
                  return (
                    <div key={tool.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className={`p-1.5 rounded-lg ${enabled ? 'bg-blue-50' : 'bg-gray-100'}`}>
                        <Icon className={`w-4 h-4 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {tool.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{tool.description}</p>
                      </div>
                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => toggle(tool.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                          enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={enabled}
                        aria-label={`${tool.title} ${enabled ? 'deaktivieren' : 'aktivieren'}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
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
        <button
          type="button"
          onClick={() => {
            const all: Record<string, boolean> = {};
            tools.forEach(t => (all[t.id] = true));
            setToolStates(all);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Alle aktivieren
        </button>
      </div>
    </div>
  );
}
