export async function getStaticProps() {
  const data = {
    message: 'ISR demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Bravo' },
      { id: 3, name: 'Charlie' },
    ],
  };

  return {
    props: { data },
    revalidate: 10,
  };
}

function ISRPage({ data }) {
  return (
    <div>
      <h1>Incremental Static Regeneration (ISR)</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ISRPage;
