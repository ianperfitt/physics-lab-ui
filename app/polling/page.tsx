'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Play, Square, Trash2 } from 'lucide-react';

interface Reading {
  sequence: number;
  timestamp: string;
  temperatureC: number;
}

type PollingStatus = 'idle' | 'polling' | 'stopped';

const pollIntervalMs = 1500;

export default function PollingPage() {
  const [status, setStatus] = useState<PollingStatus>('idle');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeRef = useRef(false);
  const latestReading = readings[0];

  async function requestReading() {
    if (!activeRef.current) return;

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const response = await fetch(`${apiBase}/api/events/reading`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const reading = await response.json() as Reading;
      setReadings((current) => [reading, ...current].slice(0, 20));
      setRequestCount((current) => current + 1);
      setError(null);
    } catch (requestError) {
      if (requestError instanceof Error && requestError.name !== 'AbortError') {
        setError(requestError.message || 'Could not fetch a reading.');
      }
    }

    if (activeRef.current) timerRef.current = setTimeout(requestReading, pollIntervalMs);
  }

  function startPolling() {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
    setReadings([]);
    setRequestCount(0);
    setError(null);
    activeRef.current = true;
    setStatus('polling');
    void requestReading();
  }

  function stopPolling() {
    activeRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('stopped');
  }

  useEffect(() => () => {
    activeRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="hover:text-sky-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">PhysicsLab</Link>
          <span> / Polling</span>
        </div>

        <header className="mb-8 border-b border-slate-200 pb-7">
          <div className="mb-3 flex items-center gap-3 text-orange-700">
            <Activity className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Request strategy lab</span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight">Polling</h1>
          <p className="max-w-3xl leading-7 text-slate-600">
            The browser asks for the latest reading every 1.5 seconds. Each update is a separate HTTP request, unlike a persistent streaming connection.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3" aria-label="Polling summary">
          <div className="border-l-2 border-orange-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Status</div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className={`h-2.5 w-2.5 rounded-full ${status === 'polling' ? 'animate-pulse bg-orange-500' : 'bg-slate-300'}`} />
              {status === 'polling' ? 'Polling' : status === 'stopped' ? 'Stopped' : 'Not started'}
            </div>
          </div>
          <div className="border-l-2 border-sky-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Requests completed</div>
            <div className="text-2xl font-black tabular-nums">{requestCount}</div>
          </div>
          <div className="border-l-2 border-emerald-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Latest reading</div>
            <div className="text-2xl font-black tabular-nums">{latestReading ? `${latestReading.temperatureC.toFixed(1)} °C` : '—'}</div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-slate-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold"><Activity className="h-5 w-5 text-orange-700" />Polling control</h2>
            <div className="mb-5 rounded-lg bg-slate-950 p-4 font-mono text-xs leading-6 text-orange-300">
              GET /api/events/reading<br />
              every 1,500 ms<br />
              one request per update
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={startPolling} disabled={status === 'polling'} className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-50">
                <Play className="h-4 w-4" />Start
              </button>
              <button type="button" onClick={stopPolling} disabled={status !== 'polling'} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50">
                <Square className="h-4 w-4" />Stop
              </button>
              <button type="button" onClick={() => { setReadings([]); setRequestCount(0); }} disabled={readings.length === 0} aria-label="Clear polling history" title="Clear polling history" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}
          </div>

          <div className="min-w-0 border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold">HTTP responses</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Newest first</span>
            </div>
            <div className="max-h-[29rem] overflow-auto" aria-live="polite">
              {readings.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No responses received yet.</p>
              ) : (
                <ol>{readings.map((reading, index) => (
                  <li key={`${reading.sequence}-${reading.timestamp}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0">
                    <span className="font-mono text-xs text-slate-400">#{requestCount - index}</span>
                    <time className="truncate text-xs text-slate-500" dateTime={reading.timestamp}>{new Date(reading.timestamp).toLocaleTimeString()}</time>
                    <span className="font-mono text-sm font-bold tabular-nums text-slate-900">{reading.temperatureC.toFixed(1)} °C</span>
                  </li>
                ))}</ol>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}