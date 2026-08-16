interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export const revalidate = 10; // Revalidate every 10 seconds

export default async function ISRPage() {
  // In App Router, ISR is achieved by setting revalidate
  // The page is cached and revalidated on the specified interval
  const data: Data = {
    message: 'ISR demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Bravo' },
      { id: 3, name: 'Charlie' },
    ],
  };

  return (
    <div>
      <h1>Incremental Static Regeneration (ISR)</h1>
      <p>Server Component revalidated every 10 seconds</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
