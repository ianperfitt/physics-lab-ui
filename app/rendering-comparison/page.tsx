import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Boxes, Orbit, Server } from 'lucide-react';

interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

interface Strategy {
  key: 'ssr' | 'ssg' | 'isr' | 'csr';
  label: string;
  endpoint: string;
  componentModel: string;
  strategy: string;
  fetchMode: string;
  icon: React.ReactNode;
}

const strategies: Strategy[] = [
  {
    key: 'ssr',
    label: 'SSR',
    endpoint: '/api/rendering/ssr',
    componentModel: 'Server Component',
    strategy: 'Render per request',
    fetchMode: 'cache: no-store',
    icon: <Server className="h-5 w-5" />,
  },
  {
    key: 'ssg',
    label: 'SSG',
    endpoint: '/api/rendering/ssg',
    componentModel: 'Server Component',
    strategy: 'Static, cached content',
    fetchMode: 'cache: force-cache',
    icon: <Boxes className="h-5 w-5" />,
  },
  {
    key: 'isr',
    label: 'ISR',
    endpoint: '/api/rendering/isr',
    componentModel: 'Server Component',
    strategy: 'Regenerate on interval',
    fetchMode: 'next: { revalidate: 10 }',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    key: 'csr',
    label: 'CSR',
    endpoint: '/api/rendering/csr',
    componentModel: 'Client Component',
    strategy: 'Hydrate in browser',
    fetchMode: 'useEffect + fetch',
    icon: <Orbit className="h-5 w-5" />,
  },
];

export const dynamic = 'force-dynamic';

export default async function RenderingComparisonPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  const strategyData = await Promise.all(
    strategies.map(async (strategy) => {
      const response = await fetch(`${apiBase}${strategy.endpoint}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        return {
          ...strategy,
          data: null,
          error: `Unable to load ${strategy.label} data`,
        };
      }

      const data = (await response.json()) as Data;
      return {
        ...strategy,
        data,
        error: null,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            <Orbit className="h-4 w-4" />
            PhysicsLab / Rendering Lab
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-950">
            Rendering Strategy Comparison
          </h1>
          <p className="max-w-3xl text-slate-600">
            This page uses one backend shape for every strategy while modeling
            the important differences in where the page is rendered,
            when it is fetched, and which component model owns the view.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {strategyData.map((strategy) => (
            <Card key={strategy.key} className="overflow-hidden border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  {strategy.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-slate-950">
                  {strategy.label}
                </CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                  {strategy.componentModel}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Fetch mode
                  </span>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {strategy.fetchMode}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-100 px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Strategy
                  </span>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {strategy.strategy}
                  </p>
                </div>

                {strategy.error ? (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                    {strategy.error}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {strategy.data?.message}
                    </p>
                    <p className="text-xs text-slate-500">
                      {strategy.data?.generatedAt}
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {strategy.data?.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}
