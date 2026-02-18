export default async function Home() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";

  let message = "API not reachable (dev expected if API not started).";
  try {
    const res = await fetch(`${apiBase}/hello`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { message: string };
      message = data.message;
    } else {
      message = `API returned ${res.status}`;
    }
  } catch {
    // keep default
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Enterprise Platform Delivery - Dev Starter</h1>
      <p><b>Backend says:</b> {message}</p>

      <hr />
      <p>
        Set <code>NEXT_PUBLIC_API_BASE_URL</code> in <code>.env.local</code>.
      </p>
    </main>
  );
}
