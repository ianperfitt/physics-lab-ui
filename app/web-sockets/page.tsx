'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, Square, Trash2, Wifi } from 'lucide-react';

interface Reading {
  sequence: number;
  timestamp: string;
  temperatureC: number;
}

type ConnectionStatus = 'idle' | 'connecting' | 'live' | 'disconnected';

const statusLabels: Record<ConnectionStatus, string> = {
  idle: 'Not connected',
  connecting: 'Connecting',
  live: 'Live',
  disconnected: 'Disconnected',
};

export default function WebSocketsPage() {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [exchange, setExchange] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const latestReading = readings[0];
  const isActive = status === 'connecting' || status === 'live';

  function connect() {
    socketRef.current?.close();
    setReadings([]);
    setError(null);
    setExchange([]);
    setStatus('connecting');

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const socketUrl = new URL('/api/events/socket', apiBase);
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => { if (socketRef.current === socket) setStatus('live'); };
    socket.onmessage = (event: MessageEvent<string>) => {
      if (socketRef.current !== socket) return;
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'intervalChanged') {
          setExchange((current) => [...current, `← Java acknowledged: readings every ${message.intervalMs} ms`].slice(-10));
          return;
        }
        if (message.type === 'error') {
          setError(message.message);
          return;
        }
        const reading = JSON.parse(event.data) as Reading;
        setReadings((current) => [reading, ...current].slice(0, 20));
        setStatus('live');
      } catch {
        setError('Received an unreadable message from the service.');
      }
    };
    socket.onerror = () => { if (socketRef.current === socket) setError('Could not connect. Check that the Java service is running.'); };
    socket.onclose = () => { if (socketRef.current === socket) setStatus('disconnected'); };
  }

  function changeInterval() {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'setInterval', intervalMs }));
    setError(null);
    setExchange((current) => [...current, `→ Browser requested: readings every ${intervalMs} ms`].slice(-10));
  }

  function disconnect() {
    socketRef.current?.close();
    socketRef.current = null;
    setStatus('disconnected');
  }

  useEffect(() => () => socketRef.current?.close(), []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="hover:text-sky-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">
            PhysicsLab
          </Link>
          <span> / WebSockets</span>
        </div>

        <header className="mb-8 border-b border-slate-200 pb-7">
          <div className="mb-3 flex items-center gap-3 text-sky-700">
            <Wifi className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Streaming lab</span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight">WebSockets</h1>
          <p className="max-w-3xl leading-7 text-slate-600">
            Java pushes readings to the browser. Send a sampling interval command back over the same connection, and Java acknowledges it and changes the stream.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3" aria-label="WebSocket summary">
          <div className="border-l-2 border-sky-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Connection</div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className={`h-2.5 w-2.5 rounded-full ${status === 'live' ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'}`} />
              {statusLabels[status]}
            </div>
          </div>
          <div className="border-l-2 border-emerald-500 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Messages received</div>
            <div className="text-2xl font-black tabular-nums">{readings.length}</div>
          </div>
          <div className="border-l-2 border-orange-400 bg-white px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Latest reading</div>
            <div className="text-2xl font-black tabular-nums">{latestReading ? `${latestReading.temperatureC.toFixed(1)} °C` : '—'}</div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border border-slate-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold"><Radio className="h-5 w-5 text-sky-700" />Connection control</h2>
            <div className="mb-5 rounded-lg bg-slate-950 p-4 font-mono text-xs leading-6 text-sky-300">
              ws://localhost:8080/api/events/socket<br />
              persistent connection<br />
              browser commands ↔ server readings
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={connect} disabled={isActive} className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50">
                <Wifi className="h-4 w-4" />Connect
              </button>
              <button type="button" onClick={disconnect} disabled={!isActive} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50">
                <Square className="h-4 w-4" />Disconnect
              </button>
              <button type="button" onClick={() => setReadings([])} disabled={readings.length === 0} aria-label="Clear message history" title="Clear message history" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <label htmlFor="sampling-interval" className="mb-2 block text-sm font-bold">Sampling interval</label>
              <div className="flex flex-wrap gap-3">
                <select id="sampling-interval" value={intervalMs} onChange={(event) => setIntervalMs(Number(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2">
                  <option value={500}>0.5 seconds</option>
                  <option value={1000}>1 second</option>
                  <option value={2000}>2 seconds</option>
                  <option value={5000}>5 seconds</option>
                </select>
                <button type="button" onClick={changeInterval} disabled={status !== 'live'} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50">Send command</button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Each connection starts at 1 second. Commands affect only your connection.</p>
              <div className="mt-4 space-y-2 font-mono text-xs text-sky-800" aria-live="polite">
                {exchange.map((entry, index) => <p key={index}>{entry}</p>)}
              </div>
            </div>
            {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}
          </div>

          <div className="min-w-0 border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold">Incoming messages</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Newest first</span>
            </div>
            <div className="max-h-[29rem] overflow-auto" aria-live="polite">
              {readings.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No messages received yet.</p>
              ) : (
                <ol>{readings.map((reading) => (
                  <li key={reading.sequence} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0">
                    <span className="font-mono text-xs text-slate-400">{String(reading.sequence).padStart(3, '0')}</span>
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