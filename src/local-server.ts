// Local dev harness: serves the same Edge handlers over node:http
// so behavior can be verified before deploying. Not used in production.
import { createServer } from "node:http";
import health from "../api/health.ts";
import toolkit from "../api/toolkit.ts";
import github from "../api/github.ts";

const routes: Record<string, (req: Request) => Promise<Response> | Response> = {
  "/api/health": health,
  "/api/toolkit": toolkit,
  "/api/github": github,
};

const port = Number(process.env.PORT ?? 8787);
createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  const handler = routes[url.pathname];
  if (!handler) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "not found" }));
    return;
  }
  const response = await handler(new Request(url));
  res.writeHead(response.status, { "content-type": response.headers.get("content-type") ?? "application/json" });
  res.end(await response.text());
}).listen(port, () => console.log(`toolkit-status-api local server on http://localhost:${port}`));
