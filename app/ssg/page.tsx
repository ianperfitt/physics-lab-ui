interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export const revalidate = false; // Cache indefinitely (SSG behavior)

export default async function SSGPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/rendering/ssg`,
    { cache: 'force-cache' },
  );

  if (!response.ok) throw new Error('Failed to fetch SSG data');

  const data: Data = await response.json();

  return (
    <div>
      <h1>Static Site Generation (SSG)</h1>
      <p>Server Component with caching (revalidate = false by default)</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
