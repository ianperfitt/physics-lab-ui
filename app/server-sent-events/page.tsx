'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Radio, Square, Trash2 } from 'lucide-react';

interface Reading {
  sequence: number;
  timestamp: string;
  temperatureC: number;
}

type StreamStatus = 'idle' | 'connecting' | 'live' | 'reconnecting' | 'stopped';

const statusLabels: Record<StreamStatus, string> = {
  idle: 'Not connected',
  connecting: 'Connecting',
  live: 'Live',
  reconnecting: 'Reconnecting',
  stopped: 'Disconnected',
};

export default function ServerSentEventsPage() {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const isActive = status === 'connecting' || status === 'live' || status === 'reconnecting';
  const latestReading = readings[0];

  function startStream() {
    eventSourceRef.current?.close();
    setReadings([]);
    setError(null);
    setStatus('connecting');

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const eventSource = new EventSource(`${apiBase}/api/events/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setStatus('live');
    eventSource.onerror = () => {
      setStatus(eventSource.readyState === EventSource.CLOSED ? 'stopped' : 'reconnecting');
    };
    eventSource.addEventListener('reading', (event) => {
      try {
        const reading = JSON.parse((event as MessageEvent<string>).data) as Reading;
        setReadings((current) => [reading, ...current].slice(0, 20));
        setStatus('live');
      } catch {
        setError('Received an unreadable event from the service.');
      }
    });
  }

  function stopStream() {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setStatus('stopped');
  }

  useEffect(() => () => eventSourceRef.current?.close(), []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          <ArrowLeft className="h-4 w-4" />
          <Link
            href="/"
            className="hover:text-sky-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
          >
            PhysicsLab
          </Link>
          <span> / Server-Sent Events</span>
        </div>

        <header className="mb-8 border-b border-slate-200 pb-7">
          <div className="mb-3 flex items-center gap-3 text-emerald-700">
            <Radio className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Streaming lab</span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight">Server-Sent Events</h1>
          <p className="max-w-3xl leading-7 text-slate-600">
            <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm text-slate-800">EventSource</code>{' '}
            keeps a one-way connection open while the Java service pushes timestamped readings to this page.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3" aria-label="Stream summary">
          <div className="border-l-2 border-emerald-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Connection</div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className={`h-2.5 w-2.5 rounded-full ${status === 'live' ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'}`} />
              {statusLabels[status]}
            </div>
          </div>
          <div className="border-l-2 border-sky-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Events received</div>
            <div className="text-2xl font-black tabular-nums">{readings.length}</div>
          </div>
          <div className="border-l-2 border-orange-400 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Latest reading</div>
            <div className="text-2xl font-black tabular-nums">
              {latestReading ? `${latestReading.temperatureC.toFixed(1)} °C` : '—'}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-slate-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <Activity className="h-5 w-5 text-emerald-700" />
              Stream control
            </h2>
            <div className="mb-5 rounded-lg bg-slate-950 p-4 font-mono text-xs leading-6 text-emerald-300">
              GET /api/events/stream
              <br />
              text/event-stream
              <br />
              event: reading
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startStream}
                disabled={isActive}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Radio className="h-4 w-4" />
                Connect
              </button>
              <button
                type="button"
                onClick={stopStream}
                disabled={!isActive}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Square className="h-4 w-4" />
                Disconnect
              </button>
              <button
                type="button"
                onClick={() => setReadings([])}
                disabled={readings.length === 0}
                aria-label="Clear event history"
                title="Clear event history"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            {status === 'reconnecting' && (
              <p className="mt-4 text-sm leading-6 text-amber-700" role="status">
                Connection interrupted. EventSource will retry automatically.
              </p>
            )}
          </div>

          <div className="min-w-0 border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold">Incoming events</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Newest first</span>
            </div>
            <div className="max-h-[29rem] overflow-auto" aria-live="polite">
              {readings.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No events received yet.</p>
              ) : (
                <ol>
                  {readings.map((reading) => (
                    <li key={reading.sequence} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0">
                      <span className="font-mono text-xs text-slate-400">{String(reading.sequence).padStart(3, '0')}</span>
                      <time className="truncate text-xs text-slate-500" dateTime={reading.timestamp}>
                        {new Date(reading.timestamp).toLocaleTimeString()}
                      </time>
                      <span className="font-mono text-sm font-bold tabular-nums text-slate-900">
                        {reading.temperatureC.toFixed(1)} °C
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}