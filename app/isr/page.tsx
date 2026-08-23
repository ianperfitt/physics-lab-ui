interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export const revalidate = 10; // Revalidate every 10 seconds

export default async function ISRPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/rendering/isr`,
    { next: { revalidate: 10 } },
  );

  if (!response.ok) throw new Error('Failed to fetch ISR data');

  const data: Data = await response.json();

  return (
    <div>
      <h1>Incremental Static Regeneration (ISR)</h1>
      <p>Server Component revalidated every 10 seconds</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
