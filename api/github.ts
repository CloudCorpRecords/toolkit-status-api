// Self-contained Edge Function: no imports from other project files.
// Returns live authored pull request counts for CloudCorpRecords from
// the GitHub Search API.
export const config = { runtime: "edge" };

const GITHUB_USER = "CloudCorpRecords";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

async function searchCount(query: string): Promise<number | null> {
  const res = await fetch(`https://api.github.com/search/issues?q=${query}`, {
    headers: { accept: "application/json", "user-agent": "toolkit-status-api/1.0" },
  });
  if (!res.ok) throw new Error(`GitHub search returned ${res.status}`);
  const data = (await res.json()) as { total_count?: number };
  return typeof data.total_count === "number" ? data.total_count : null;
}

export default async function handler(_req: Request): Promise<Response> {
  try {
    const base = `author:${GITHUB_USER}+type:pr`;
    const [total, open] = await Promise.all([
      searchCount(base),
      searchCount(`${base}+state:open`),
    ]);
    return json({
      ok: true,
      user: GITHUB_USER,
      profile: `https://github.com/${GITHUB_USER}`,
      pullRequests: { total, open },
    });
  } catch (err) {
    return json({ ok: false, error: String(err) }, 502);
  }
}
