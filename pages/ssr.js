export async function getServerSideProps() {
  const data = {
    message: 'SSR demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Delta' },
      { id: 2, name: 'Echo' },
      { id: 3, name: 'Foxtrot' },
    ],
  };

  return { props: { data } };
}

function SSRPage({ data }) {
  return (
    <div>
      <h1>Server-Side Rendering (SSR)</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default SSRPage;
