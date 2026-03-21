'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Admin-Bereich</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-500 text-sm mb-6">Bitte melde dich an, um fortzufahren.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Benutzername
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Passwort verstecken' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            >
              {loading ? 'Anmelden…' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          HTML to PDF Platform · Admin
        </p>
      </div>
    </div>
  );
}
