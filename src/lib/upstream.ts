import { formatGithubSearch, formatNpmPackument, type GithubPrCounts, type PackageStatus } from "./format.ts";

export const TOOLKIT_PACKAGES = [
  "@reneturcios/greenlight",
  "@reneturcios/prwatch",
  "@reneturcios/claimcheck",
  "@reneturcios/gatefile",
] as const;

export const GITHUB_USER = "CloudCorpRecords";

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "toolkit-status-api/1.0" },
  });
  if (!res.ok) throw new Error(`Upstream ${url} returned ${res.status}`);
  return res.json();
}

export async function getToolkitStatus(): Promise<PackageStatus[]> {
  const results = await Promise.all(
    TOOLKIT_PACKAGES.map(async (pkg) => {
      const encoded = encodeURIComponent(pkg);
      const data = (await fetchJson(`https://registry.npmjs.org/${encoded}`)) as Parameters<typeof formatNpmPackument>[1];
      return formatNpmPackument(pkg, data);
    }),
  );
  return results;
}

export async function getGithubPrCounts(): Promise<GithubPrCounts> {
  const base = `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr`;
  const [all, open] = await Promise.all([
    fetchJson(base) as Promise<{ total_count?: number }>,
    fetchJson(`${base}+state:open`) as Promise<{ total_count?: number }>,
  ]);
  return { total: formatGithubSearch(all), open: formatGithubSearch(open) };
}
