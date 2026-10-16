# Toolkit Status API

A serverless API built and deployed on **Vercel Edge Functions** (TypeScript). It reports live status for the Greenlight open source toolkit: current npm versions and GitHub pull request counts, fetched from public upstream APIs at request time and cached at the edge.

Built by Rene Turcios (CloudCorpRecords) as a working demonstration of serverless architecture: no servers to provision or manage, functions scale to zero, responses are cached with `s-maxage` and `stale-while-revalidate`.

## Live endpoints

| Endpoint | What it returns |
| --- | --- |
| `GET /api/health` | Service health, runtime, timestamp |
| `GET /api/toolkit` | Latest npm versions and descriptions for `@reneturcios/greenlight`, `prwatch`, `claimcheck`, `gatefile` |
| `GET /api/github` | Live authored pull request counts for `CloudCorpRecords` from the GitHub Search API |

Example:

```sh
curl https://toolkit-status-api.vercel.app/api/toolkit
curl https://toolkit-status-api.vercel.app/api/github
```

## Architecture

- `api/*.ts` : Vercel Edge Functions (web standard `Request`/`Response`, `runtime: "edge"`)
- `api/_lib/format.ts` : pure formatting helpers, unit tested
- `api/_lib/upstream.ts` : upstream fetchers for the npm registry and GitHub APIs
- `src/local-server.ts` : local dev harness that serves the same handlers over `node:http`
- `public/index.html` : static landing page, also served by Vercel

No runtime dependencies. Tests use the built in Node test runner with Node's native TypeScript support.

## Run locally

```sh
npm test          # unit tests
npm run dev       # local server on http://localhost:8787
curl http://localhost:8787/api/health
```

## Deploy

Linked to Vercel from this GitHub repository. Pushes to `main` deploy automatically. The same code can be deployed manually with `vercel deploy --prod`.
