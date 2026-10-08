import Link from "next/link";
import {
  Orbit,
  Server,
  Database,
  Layers,
  Code2,
  Grid3X3,
  Radio,
  Wifi,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type LearningLink = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  label: string;
};

const softwareDevelopmentLinks: LearningLink[] = [
  {
    href: "/rendering-comparison",
    title: "Rendering Comparison",
    description: "Compare data fetching, caching, and component choices across strategies.",
    icon: Orbit,
    label: "Architecture",
  },
  {
    href: "/server-sent-events",
    title: "Server-Sent Events",
    description: "Stream live readings from the Java service over a persistent connection.",
    icon: Radio,
    label: "Streaming",
  },
  {
    href: "/web-sockets",
    title: "WebSockets",
    description: "Keep a two-way connection open for live updates from the Java service.",
    icon: Wifi,
    label: "Streaming",
  },
  {
    href: "/polling",
    title: "Polling",
    description: "Request the latest reading on a timer and compare repeated HTTP calls.",
    icon: RefreshCw,
    label: "Request strategy",
  },
  {
    href: "/ssr",
    title: "Server-Side Rendering (SSR)",
    description: "Fetch fresh data on the server for each request.",
    icon: Server,
    label: "Rendering strategy",
  },
  {
    href: "/ssg",
    title: "Static Site Generation (SSG)",
    description: "Build and cache a page for content that changes infrequently.",
    icon: Database,
    label: "Rendering strategy",
  },
  {
    href: "/isr",
    title: "Incremental Static Regeneration (ISR)",
    description: "Serve cached content and refresh it on a revalidation schedule.",
    icon: Layers,
    label: "Rendering strategy",
  },
  {
    href: "/csr",
    title: "Client-Side Rendering (CSR)",
    description: "Load data in the browser and update the view with client state.",
    icon: Code2,
    label: "Rendering strategy",
  },
  {
    href: "/shortest-clear-path",
    title: "Shortest Clear Path",
    description: "Use breadth-first search to compute the shortest path length in a binary matrix.",
    icon: Grid3X3,
    label: "Algorithms",
  },
];

const physicsLinks: LearningLink[] = [
  {
    href: "/linear-algebra/row-echelon",
    title: "Row Echelon Form",
    description: "Use Gaussian elimination to find pivots, rank, and a matrix's row echelon form.",
    icon: Grid3X3,
    label: "Linear algebra",
  },
];

function LearningCards({ items }: { items: LearningLink[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-500 hover:shadow-lg"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-700 transition group-hover:bg-sky-700 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              {item.label}
            </div>
            <h3 className="mb-3 text-lg font-black leading-snug text-slate-950">
              {item.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600">{item.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
            <Orbit className="h-4 w-4" />
            PhysicsLab
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="mb-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950">
                Learning Lab
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Explore software architecture alongside the mathematics and
                computational ideas that power PhysicsLab.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                Two connected tracks
              </div>
              <div className="text-2xl font-black text-slate-950">
                Software + Physics
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Choose a section below to get started.
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <section
            aria-labelledby="software-development-heading"
            className="rounded-3xl border border-sky-100 bg-sky-50/60 p-6 md:p-8"
          >
            <div className="mb-6 max-w-3xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                Software development
              </p>
              <h2
                id="software-development-heading"
                className="mb-2 text-3xl font-black tracking-tight text-slate-950"
              >
                Web Architecture Lab
              </h2>
              <p className="leading-7 text-slate-600">
                Practice Next.js rendering strategies, data fetching, and the
                decisions behind server and client components.
              </p>
            </div>
            <LearningCards items={softwareDevelopmentLinks} />
          </section>

          <section
            aria-labelledby="physics-heading"
            className="rounded-3xl border border-violet-100 bg-violet-50/60 p-6 md:p-8"
          >
            <div className="mb-6 max-w-3xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                Physics and mathematics
              </p>
              <h2
                id="physics-heading"
                className="mb-2 text-3xl font-black tracking-tight text-slate-950"
              >
                Computational Physics Lab
              </h2>
              <p className="leading-7 text-slate-600">
                Turn mathematical methods into working tools, starting with
                foundational linear algebra.
              </p>
            </div>
            <LearningCards items={physicsLinks} />
          </section>
        </div>
      </div>
    </main>
  );
}
