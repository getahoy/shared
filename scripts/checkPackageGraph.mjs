import { readdirSync, readFileSync } from "node:fs";

const SCOPE = "@getahoy/";
const allowedDependencies = {
  tokens: [],
  protocol: [],
  crypto: [],
  lib: ["protocol"],
};

function declaredSiblings(manifest) {
  const fields = ["dependencies", "peerDependencies", "devDependencies"];
  const names = fields.flatMap((field) => Object.keys(manifest[field] ?? {}));
  return [...new Set(names.filter((name) => name.startsWith(SCOPE)))].map((name) =>
    name.slice(SCOPE.length),
  );
}

function readGraph() {
  const packages = readdirSync(new URL("../packages", import.meta.url));
  return Object.fromEntries(
    packages.map((name) => {
      const path = new URL(`../packages/${name}/package.json`, import.meta.url);
      return [name, declaredSiblings(JSON.parse(readFileSync(path, "utf8")))];
    }),
  );
}

function findCycle(graph, start, trail = []) {
  if (trail.includes(start)) return [...trail, start];
  for (const next of graph[start] ?? []) {
    const cycle = findCycle(graph, next, [...trail, start]);
    if (cycle) return cycle;
  }
  return null;
}

const graph = readGraph();
const problems = [];

for (const [name, siblings] of Object.entries(graph)) {
  const allowed = allowedDependencies[name];
  if (!allowed) problems.push(`${name}: not in the allowed graph, add it deliberately`);
  for (const sibling of siblings) {
    if (allowed && !allowed.includes(sibling))
      problems.push(`${name} must not depend on ${sibling}`);
  }
  const cycle = findCycle(graph, name);
  if (cycle) problems.push(`cycle: ${cycle.join(" -> ")}`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`package graph ok: ${Object.keys(graph).join(", ")}`);
