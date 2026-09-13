"use client";

import { useMemo, useState } from 'react';
import { Search, Orbit, Database, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchDocument {
  id: string;
  type: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
}

interface SearchEvent {
  type: string;
  source: string;
  payload: string;
  createdAt: string;
}

export default function PhysicsSearchPage() {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [events, setEvents] = useState<SearchEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const hotTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    for (const document of documents) {
      for (const tag of document.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [documents]);

  async function loadDocuments(nextQuery = query) {
    setLoading(true);

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/search/search`);
      url.searchParams.set('q', nextQuery);

      const response = await fetch(url, { cache: 'no-store' });
      const nextDocuments = (await response.json()) as SearchDocument[];
      setDocuments(nextDocuments);

      const eventsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/search/events`,
        { cache: 'no-store' },
      );
      const nextEvents = (await eventsResponse.json()) as SearchEvent[];
      setEvents(nextEvents);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            <Orbit className="h-4 w-4" />
            PhysicsLab / Search Index
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-950">
                PhysicsLab Index
              </h1>
              <p className="max-w-3xl text-slate-600">
                A lightweight searchable knowledge layer for physics concepts,
                learning topics, and problem descriptions.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                Index Flow
              </div>
              <div className="text-2xl font-black text-slate-950">Content → Event → Search</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[minmax(420px,2fr)_minmax(260px,1fr)]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Search className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-950">
                Search Library
              </CardTitle>
              <CardDescription className="text-slate-600">
                Find concepts and problem topics across the PhysicsLab document index.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white"
                  placeholder="Search physics concepts..."
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') loadDocuments();
                  }}
                />
                <button
                  onClick={() => loadDocuments()}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-sky-700"
                >
                  Search
                </button>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Results
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {loading ? 'Searching...' : `${documents.length} found`}
                  </span>
                </div>

                {documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-sm text-slate-500">
                    No matching documents yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <article key={document.id} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
                            {document.type}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {document.createdAt}
                          </span>
                        </div>
                        <h2 className="mb-2 text-lg font-black text-slate-950">
                          {document.title}
                        </h2>
                        <p className="text-sm leading-6 text-slate-600">
                          {document.body}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {document.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <Database className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-950">
                  Topic Cloud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotTags.length === 0 ? (
                    <span className="text-sm text-slate-500">No indexed topics yet</span>
                  ) : (
                    hotTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setQuery(tag);
                          loadDocuments(tag);
                        }}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600 transition hover:border-sky-600 hover:text-sky-700"
                      >
                        {tag} <span className="text-slate-400">({count})</span>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <Activity className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-950">
                  Event Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-sm text-slate-500">No events recorded.</div>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 4).map((event, index) => (
                      <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="mb-1 text-[11px] font-black uppercase tracking-wide text-sky-700">
                          {event.type}
                        </div>
                        <div className="text-xs leading-5 text-slate-600">
                          {event.payload}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </section>
      </section>
    </main>
  );
}
