import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server } from 'lucide-react';

interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export default async function SSRPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/rendering/ssr`,
    { cache: 'no-store' },
  );

  if (!response.ok) throw new Error('Failed to fetch SSR data');

  const data: Data = await response.json();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <Server className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-950">
              Server-Side Rendering (SSR)
            </CardTitle>
            <CardDescription className="text-slate-600">
              Server Component rendered fresh on each request
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
