'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, TrendingUp, AlertCircle, CheckCircle,
  Key, Palette, ToggleLeft, ArrowRight, Clock
} from 'lucide-react';

interface Stats {
  requestsToday: number;
  requestsThisHour: number;
  successesToday: number;
  errorsToday: number;
  recentErrors: { time: string; endpoint: string; error?: string }[];
}

interface Settings {
  appearance: { siteTitle: string; primaryColor: string };
  api: { rateLimitRequests: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/admin/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Anfragen heute',
      value: stats?.requestsToday ?? '–',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Diese Stunde',
      value: stats?.requestsThisHour ?? '–',
      icon: Clock,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Erfolgreich',
      value: stats?.successesToday ?? '–',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Fehler heute',
      value: stats?.errorsToday ?? '–',
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  const quickLinks = [
    { href: '/admin/settings/appearance', label: 'Aussehen anpassen', icon: Palette, desc: 'Titel, Logo, Farben' },
    { href: '/admin/settings/functions', label: 'Tools verwalten', icon: ToggleLeft, desc: 'Tools aktivieren / deaktivieren' },
    { href: '/admin/settings/api', label: 'API & Sicherheit', icon: Key, desc: 'API-Key, Rate-Limits, Passwort' },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Übersicht der Plattform-Aktivität
          {settings && ` · ${settings.appearance.siteTitle}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{link.label}</p>
                  <p className="text-xs text-gray-500 truncate">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Errors */}
      {stats && stats.recentErrors.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" />
            Letzte Fehler
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {stats.recentErrors.map((err, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-gray-700 truncate">{err.error}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{err.endpoint} · {new Date(err.time).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
