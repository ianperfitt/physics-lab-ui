import { useState, useEffect } from 'react';

const demoData = {
  message: 'CSR demo data',
  items: [
    { id: 1, name: 'Juliet' },
    { id: 2, name: 'Kilo' },
    { id: 3, name: 'Lima' },
  ],
};

function CSRPage() {
  const [data, setData] = useState(null);

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
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default CSRPage;
