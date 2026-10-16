import { jsonResponse } from "./_lib/format.ts";
import { getGithubPrCounts, GITHUB_USER } from "./_lib/upstream.ts";

export const config = { runtime: "edge" };

export default async function handler(_req: Request): Promise<Response> {
  try {
    const prs = await getGithubPrCounts();
    return jsonResponse({
      ok: true,
      user: GITHUB_USER,
      profile: `https://github.com/${GITHUB_USER}`,
      pullRequests: prs,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 502);
  }
}
