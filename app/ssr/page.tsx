interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export default async function SSRPage() {
  // In App Router, data fetching happens directly in the component
  // This is rendered on the server for each request
  const data: Data = {
    message: 'SSR demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Delta' },
      { id: 2, name: 'Echo' },
      { id: 3, name: 'Foxtrot' },
    ],
  };

  return (
    <div>
      <h1>Server-Side Rendering (SSR)</h1>
      <p>Server Component rendered fresh on each request</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
