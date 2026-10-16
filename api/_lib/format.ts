// Pure formatting helpers for upstream registry responses.
// Kept dependency free so the same code runs in Vercel Edge functions,
// in the local dev server, and in unit tests.

export interface PackageStatus {
  name: string;
  latest: string | null;
  description: string | null;
  npmUrl: string;
}

export interface NpmPackument {
  name?: string;
  description?: string;
  "dist-tags"?: Record<string, string>;
}

export function formatNpmPackument(pkg: string, data: NpmPackument): PackageStatus {
  return {
    name: data.name ?? pkg,
    latest: data["dist-tags"]?.latest ?? null,
    description: data.description ?? null,
    npmUrl: `https://www.npmjs.com/package/${pkg}`,
  };
}

export interface GithubPrCounts {
  total: number | null;
  open: number | null;
}

interface GithubSearchResponse {
  total_count?: number;
}

export function formatGithubSearch(data: GithubSearchResponse): number | null {
  return typeof data.total_count === "number" ? data.total_count : null;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
