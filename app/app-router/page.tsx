// App Router Example - Default is Server Component
// No getServerSideProps or getStaticProps needed!
// Just make the component async and fetch data directly

interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export default async function AppRouterPage() {
  // Data fetching happens directly in the component
  // This is Server Component rendering by default
  const data: Data = {
    message: 'App Router demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Juliet' },
      { id: 2, name: 'Kilo' },
      { id: 3, name: 'Lima' },
    ],
  };

  return (
    <div>
      <h1>App Router (Server Component)</h1>
      <p>This demonstrates Next.js 13+ App Router approach</p>
      <p>Component is a Server Component by default - no special data fetching functions needed!</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
