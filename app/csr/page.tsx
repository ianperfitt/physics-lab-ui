'use client';

import { useState, useEffect } from 'react';

interface Data {
  message: string;
  generatedAt: string;
  items: Array<{ id: number; name: string }>;
}

export default function CSRPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/rendering/csr`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch CSR data');
        return response.json() as Promise<Data>;
      })
      .then((nextData) => {
        if (!cancelled) setData(nextData);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Client-Side Rendering (CSR)</h1>
      <p>Component renders in the browser using &apos;use client&apos; directive</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
