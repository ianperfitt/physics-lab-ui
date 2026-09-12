'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export default function CSRPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rendering/csr`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch CSR data');
        return response.json() as Promise<Data>;
      })
      .then((nextData) => {
        if (!cancelled) setData(nextData);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <section className="mx-auto max-w-3xl">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Orbit className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-950">
                Client-Side Rendering (CSR)
              </CardTitle>
              <CardDescription className="text-slate-600">
                Component renders in the browser using the client directive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-600">
                Loading...
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Orbit className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-950">
              Client-Side Rendering (CSR)
            </CardTitle>
            <CardDescription className="text-slate-600">
              Component renders in the browser using the client directive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
