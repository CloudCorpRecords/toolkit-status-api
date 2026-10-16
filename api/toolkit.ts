import { jsonResponse } from "../src/lib/format.ts";
import { getToolkitStatus } from "../src/lib/upstream.ts";

export const config = { runtime: "edge" };

export default async function handler(_req: Request): Promise<Response> {
  try {
    const packages = await getToolkitStatus();
    return jsonResponse({ ok: true, packages });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 502);
  }
}
