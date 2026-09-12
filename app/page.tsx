import Link from "next/link";
import { Orbit, Server, Database, Layers, Code2 } from "lucide-react";

const strategies = [
  {
    href: "/rendering-comparison",
    title: "Rendering Comparison",
    description: "Compare the architecture and fetch behavior of each strategy.",
    icon: Orbit,
  },
  {
    href: "/ssr",
    title: "Server-Side Rendering (SSR)",
    description: "Fresh HTML generated per request on the server.",
    icon: Server,
  },
  {
    href: "/ssg",
    title: "Static Site Generation (SSG)",
    description: "Fully cached HTML for static, read-heavy content.",
    icon: Database,
  },
  {
    href: "/isr",
    title: "Incremental Static Regeneration (ISR)",
    description: "Static assets refreshed through controlled revalidation.",
    icon: Layers,
  },
  {
    href: "/csr",
    title: "Client-Side Rendering (CSR)",
    description: "Browser-driven page state and data loading.",
    icon: Code2,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
            <Orbit className="h-4 w-4" />
            PhysicsLab UI
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="mb-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950">
                Rendering Strategy Lab
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A small Next.js learning surface for comparing SSR, SSG,
                ISR, CSR, and the distinction between architecture and component model.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                Current Track
              </div>
              <div className="text-3xl font-black text-slate-950">ISR / CSR / SSR / SSG</div>
              <div className="mt-2 text-sm text-slate-600">
                Next.js Rendering Methods
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <Link
                key={strategy.href}
                href={strategy.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-500 hover:shadow-lg"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Rendering
                </div>
                <h2 className="mb-3 text-lg font-black leading-snug text-slate-950">
                  {strategy.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  {strategy.description}
                </p>
              </Link>
            );
          })}
        </section>
      </section>
    </main>
  );
}
