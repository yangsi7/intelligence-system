#!/usr/bin/env node
/**
 * scripts/gap-analysis.js
 * Heuristic Next.js + Supabase health checks sourced from PROJECT_INDEX.json.
 */
import { pathToFileURL } from 'node:url';

import { readIndex } from '../lib/project-utils.mjs';

export function runGapAnalysis() {
  const idx = readIndex();
  const files = Object.keys(idx.f || {});

  function exists(pat) {
    return files.some(f => pat.test(f));
  }

  function count(pat) {
    return files.filter(f => pat.test(f)).length;
  }

  function evidenceServerSideAuth() {
    const hasServer = exists(/^lib\/supabase\/server\.ts$/);
    const hasMiddleware = exists(/^lib\/supabase\/middleware\.ts$/) || exists(/^middleware\.ts$/);
    const hasActions = count(/^app\/.*\/actions\.ts$/) > 0;
    return { hasServer, hasMiddleware, hasActions, pass: hasServer && hasMiddleware };
  }

  function evidenceRLS() {
    const hasMigrations = count(/^supabase\/migrations\/.*\.sql$/) > 0;
    const hasPolicy = exists(/supabase\/migrations\/.*(policy|rls).*\.sql$/i);
    return { hasMigrations, hasPolicy, pass: hasMigrations && hasPolicy };
  }

  function evidenceTDD() {
    const tests = count(/^__tests__\//);
    const hasJestSetup = exists(/^jest\.setup\.js$/);
    return { tests, hasJestSetup, pass: tests > 0 };
  }

  function evidenceMCPFirst() {
    const hasAgents = exists(/^AGENTS\.md$/) || exists(/^CLAUDE\.md$/);
    // presence of mcp keywords in docs within repo index keys
    const mcpRefs = files.filter(f => /^.*CLAUDE\.md$/.test(f) || /^docs\/.*\.md$/.test(f));
    return { hasAgents, docsMentioned: mcpRefs.length > 0, pass: hasAgents };
  }

  const report = {
    generated_at: new Date().toISOString(),
    checks: {
      server_side_auth: evidenceServerSideAuth(),
      rls: evidenceRLS(),
      tdd: evidenceTDD(),
      mcp_first: evidenceMCPFirst(),
    },
    summary: {}
  };

  report.summary.passed = Object.entries(report.checks)
    .filter(([, v]) => v.pass)
    .map(([k]) => k);
  report.summary.failed = Object.entries(report.checks)
    .filter(([, v]) => !v.pass)
    .map(([k]) => k);

  return report;
}

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isMain) {
  const report = runGapAnalysis();
  console.log(JSON.stringify(report, undefined, 2));
}
