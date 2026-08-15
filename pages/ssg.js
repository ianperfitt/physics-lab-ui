export async function getStaticProps() {
  const data = {
    message: 'SSG demo data',
    generatedAt: new Date().toISOString(),
    items: [
      { id: 1, name: 'Golf' },
      { id: 2, name: 'Hotel' },
      { id: 3, name: 'India' },
    ],
  };

  return { props: { data } };
}

function SSGPage({ data }) {
  return (
    <div>
      <h1>Static Site Generation (SSG)</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default SSGPage;
