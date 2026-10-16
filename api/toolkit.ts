// Self-contained Edge Function: no imports from other project files.
// Fetches live npm packuments for the Greenlight toolkit packages and
// returns their latest published versions.
export const config = { runtime: "edge" };

const PACKAGES = [
  "@reneturcios/greenlight",
  "@reneturcios/prwatch",
  "@reneturcios/claimcheck",
  "@reneturcios/gatefile",
] as const;

interface Packument {
  name?: string;
  description?: string;
  "dist-tags"?: Record<string, string>;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export default async function handler(_req: Request): Promise<Response> {
  try {
    const packages = await Promise.all(
      PACKAGES.map(async (pkg) => {
        const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
          headers: { accept: "application/json", "user-agent": "toolkit-status-api/1.0" },
        });
        if (!res.ok) throw new Error(`npm registry returned ${res.status} for ${pkg}`);
        const data = (await res.json()) as Packument;
        return {
          name: data.name ?? pkg,
          latest: data["dist-tags"]?.latest ?? null,
          description: data.description ?? null,
          npmUrl: `https://www.npmjs.com/package/${pkg}`,
        };
      }),
    );
    return json({ ok: true, packages });
  } catch (err) {
    return json({ ok: false, error: String(err) }, 502);
  }
}
