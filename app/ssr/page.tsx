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
    <div>
      <h1>Server-Side Rendering (SSR)</h1>
      <p>Server Component rendered fresh on each request</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
