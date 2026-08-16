interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export const revalidate = false; // Cache indefinitely (SSG behavior)

export default async function SSGPage() {
  // In App Router, to make this truly SSG (Static Site Generation),
  // set revalidate = false (default) or omit it with default caching
  const data: Data = {
    message: 'SSG demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Golf' },
      { id: 2, name: 'Hotel' },
      { id: 3, name: 'India' },
    ],
  };

  return (
    <div>
      <h1>Static Site Generation (SSG)</h1>
      <p>Server Component with caching (revalidate = false by default)</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
