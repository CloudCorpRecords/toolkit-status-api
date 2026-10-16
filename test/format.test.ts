import { test } from "node:test";
import assert from "node:assert/strict";
import { formatGithubSearch, formatNpmPackument } from "../src/lib/format.ts";

test("formatNpmPackument extracts the latest dist-tag", () => {
  const out = formatNpmPackument("@reneturcios/greenlight", {
    name: "@reneturcios/greenlight",
    description: "OSS contribution pre-flight, CLI + MCP",
    "dist-tags": { latest: "0.3.2" },
  });
  assert.equal(out.latest, "0.3.2");
  assert.equal(out.npmUrl, "https://www.npmjs.com/package/@reneturcios/greenlight");
});

test("formatNpmPackument tolerates a packument with no dist-tags", () => {
  const out = formatNpmPackument("@reneturcios/prwatch", {});
  assert.equal(out.latest, null);
  assert.equal(out.name, "@reneturcios/prwatch");
});

test("formatGithubSearch returns total_count or null", () => {
  assert.equal(formatGithubSearch({ total_count: 40 }), 40);
  assert.equal(formatGithubSearch({}), null);
});
