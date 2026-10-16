// Self-contained Edge Function: no imports from other project files.
// This project's functions are intentionally single-file (see README).
export const config = { runtime: "edge" };

export default function handler(_req: Request): Response {
  return new Response(
    JSON.stringify(
      {
        ok: true,
        service: "toolkit-status-api",
        runtime: "vercel-edge",
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
