import { jsonResponse } from "./_lib/format.ts";

export const config = { runtime: "edge" };

export default function handler(_req: Request): Response {
  return jsonResponse({
    ok: true,
    service: "toolkit-status-api",
    runtime: "vercel-edge",
    timestamp: new Date().toISOString(),
  });
}
