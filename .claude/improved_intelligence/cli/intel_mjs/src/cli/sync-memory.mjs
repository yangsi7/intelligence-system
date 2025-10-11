#!/usr/bin/env node
/**
 * scripts/sync-memory.js
 * Refresh memory/state/reference snippets from PROJECT_INDEX.json.
 * Writes Markdown to stdout or to files when --out <dir> is provided.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  readIndex,
  topExtensions,
  routes,
  tests,
  graphEdges,
  toDOT
} from '../lib/project-utils.mjs';

function parseArgs(argv = process.argv.slice(2)) {
  const outDirFlag = argv.indexOf('--out');
  const outDir = outDirFlag >= 0 ? argv[outDirFlag + 1] : null;
  return { argv, outDir };
}

function writeMaybe(outDir, p, content) {
  if (!outDir) {
    process.stdout.write(`${content}\n`);
    return;
  }
  const fp = path.join(outDir, p);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content);
  console.error(`wrote ${fp}`);
}

export function runSyncMemory(argv = process.argv.slice(2)) {
  const { outDir } = parseArgs(argv);

  const idx = readIndex();
  const ext = topExtensions();
  const rts = routes();
  const tsts = tests();
  const edges = graphEdges();
  const dot = toDOT(edges);

  const archCore = `# Architecture Core — Snapshot

Updated: ${new Date().toISOString()}

## File Types
${ext.map(e=>`- .${e.ext || '(none)'}: ${e.n}`).join('\n')}

## Routes (pages and API)
${rts.map(r=>`- ${r}`).join('\n') || '- none'}

## Tests
Count: ${tsts.length}
${tsts.slice(0,50).map(t=>`- ${t}`).join('\n')}${tsts.length>50?`\n- ... (+${tsts.length-50} more)`:''}

`;

  const refsOverview = `# Documentation Index (generated)

- Architecture snapshot in \`architecture-core.md\`
- Function graph DOT in \`refs/graphs/functions.dot\`
- Routes listed under Architecture snapshot
- Tests count and sample included

`;

  writeMaybe(outDir, 'architecture-core.md', archCore);
  writeMaybe(outDir, 'refs/doc-index.generated.md', refsOverview);
  writeMaybe(outDir, 'refs/graphs/functions.dot', dot);

  return {
    outDir,
    files: ['architecture-core.md', 'refs/doc-index.generated.md', 'refs/graphs/functions.dot']
  };
}

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isMain) {
  runSyncMemory();
}
