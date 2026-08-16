'use client';

import { useState, useEffect } from 'react';

interface Data {
  message: string;
  items: Array<{ id: number; name: string }>;
}

const demoData: Data = {
  message: 'CSR demo data',
  items: [
    { id: 1, name: 'Juliet' },
    { id: 2, name: 'Kilo' },
    { id: 3, name: 'Lima' },
  ],
};

export default function CSRPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(demoData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Client-Side Rendering (CSR)</h1>
      <p>Component renders in the browser using 'use client' directive</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
