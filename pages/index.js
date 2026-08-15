export default function Home() {
  return (
    <div>
      <h1>Next.js Rendering Methods</h1>
      <ul>
        <li><a href="/ssr">Server-Side Rendering (SSR)</a></li>
        <li><a href="/ssg">Static Site Generation (SSG)</a></li>
        <li><a href="/isr">Incremental Static Regeneration (ISR)</a></li>
        <li><a href="/csr">Client-Side Rendering (CSR)</a></li>
      </ul>
    </div>
  );
}
