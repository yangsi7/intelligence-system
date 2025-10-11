#!/usr/bin/env node
/**
 * scripts/project-utils.js
 * Utility library to query PROJECT_INDEX.json with jq or pure JS fallback.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const INDEX_PATH = process.env.PROJECT_INDEX || path.resolve(process.cwd(), 'PROJECT_INDEX.json');

function hasJq() {
  try {
    execSync('jq --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function hasRg() {
  try {
    execSync('rg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function hasFd() {
  try {
    execSync('fd --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function hasFzf() {
  try {
    execSync('fzf --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function readIndex() {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  return JSON.parse(raw);
}

function jq(query) {
  const res = spawnSync('jq', ['-r', query, INDEX_PATH], { encoding: 'utf8' });
  if (res.status !== 0) throw new Error(res.stderr || 'jq failed');
  return res.stdout.trim();
}

function rgSearch(pattern, options = {}) {
  if (!hasRg()) {
    throw new Error('rg (ripgrep) is not available on PATH; install it to use content search.');
  }

  const {
    paths = ['.'],
    glob = [],
    types = [],
    before = 0,
    after = 0,
    context = 0,
    caseInsensitive = false,
    literal = false
  } = options;

  const args = ['--json', '--no-heading', '--color', 'never'];

  if (caseInsensitive) args.push('-i');
  if (literal) args.push('-F');

  const globs = Array.isArray(glob) ? glob : [glob];
  for (const globPattern of globs) {
    if (globPattern) {
      args.push('-g', globPattern);
    }
  }

  const fileTypes = Array.isArray(types) ? types : [types];
  for (const type of fileTypes) {
    if (type) {
      args.push('-t', type);
    }
  }

  if (context) {
    args.push('-C', String(context));
  } else {
    if (before) args.push('-B', String(before));
    if (after) args.push('-A', String(after));
  }

  args.push(pattern);
  const searchPaths = Array.isArray(paths) ? paths : [paths];
  args.push(...(searchPaths.length > 0 ? searchPaths : ['.']));

  const res = spawnSync('rg', args, { encoding: 'utf8' });
  if (![0, 1].includes(res.status)) {
    throw new Error(res.stderr || 'rg failed');
  }

  const matches = [];
  for (const line of res.stdout.split('\n')) {
    if (!line.trim()) {
      continue;
    }

    try {
      const message = JSON.parse(line);
      if (message.type === 'match') {
        const { path, lines, line_number, absolute_offset, submatches } = message.data;
        matches.push({
          file: path?.text || path,
          line: line_number,
          absOffset: absolute_offset,
          text: lines?.text || '',
          submatches: submatches?.map(sm => ({
            match: sm.match?.text || '',
            start: sm.start,
            end: sm.end
          })) || []
        });
      } else if (message.type === 'context') {
        const { path, line_number, lines } = message.data;
        matches.push({
          file: path?.text || path,
          line: line_number,
          text: lines?.text || '',
          context: true
        });
      }
    } catch {
      // ignore parse errors from non-JSON lines
    }
  }

  return matches;
}

function fdSearch(pattern = '', options = {}) {
  if (!hasFd()) {
    throw new Error('fd is not available on PATH; install it to use file search.');
  }

  const {
    paths = ['.'],
    extension,
    type,
    hidden = false,
    noIgnore = false,
    depth
  } = options;

  const args = ['--color', 'never'];
  if (hidden) args.push('--hidden');
  if (noIgnore) args.push('--no-ignore');
  if (depth !== undefined) args.push('-d', String(depth));
  if (extension) args.push('-e', extension);
  if (type) args.push('-t', type);

  if (pattern) {
    args.push(pattern);
  }

  const searchRoots = Array.isArray(paths) ? paths : [paths];
  if (searchRoots.length > 0) {
    args.push(...searchRoots);
  }

  const res = spawnSync('fd', args, { encoding: 'utf8' });
  if (![0, 1].includes(res.status)) {
    throw new Error(res.stderr || 'fd failed');
  }

  return res.stdout.split('\n').filter(Boolean);
}

function directoryStructure(options = {}) {
  if (!hasFd()) {
    throw new Error('fd is not available on PATH; install it to generate structure.');
  }

  const {
    root = '.',
    depth = 2,
    includeFiles = false,
    hidden = false
  } = options;

  const fdArgs = ['--color', 'never'];
  if (hidden) fdArgs.push('--hidden');
  fdArgs.push('-d', String(Math.max(depth, 1)));
  if (!includeFiles) {
    fdArgs.push('-t', 'd');
  }

  const res = spawnSync('fd', [...fdArgs, '', root], { encoding: 'utf8' });
  if (![0, 1].includes(res.status)) {
    throw new Error(res.stderr || 'fd failed while building structure');
  }

  const entries = res.stdout.split('\n').filter(Boolean).sort();
  const tree = [];
  for (const entry of entries) {
    const clean = entry.replace(/^\.\/?/, '');
    const level = clean.split('/').length - 1;
    const indent = '  '.repeat(Math.max(level, 0));
    tree.push(`${indent}${clean || '.'}`);
  }

  return tree;
}

function interactiveFileSelect(pattern = '', options = {}) {
  if (!hasFzf()) {
    throw new Error('fzf is not available on PATH; install it for interactive selection.');
  }
  if (!hasFd()) {
    throw new Error('fd is required for interactive selection to enumerate files.');
  }

  const {
    root = '.',
    type,
    hidden = false,
    depth
  } = options;

  const fdArgs = ['--color', 'never'];
  if (hidden) fdArgs.push('--hidden');
  if (depth !== undefined) fdArgs.push('-d', String(depth));
  if (type) fdArgs.push('-t', type);

  const fdRes = spawnSync('fd', [...fdArgs, pattern, root], { encoding: 'utf8' });
  if (![0, 1].includes(fdRes.status)) {
    throw new Error(fdRes.stderr || 'fd failed during interactive selection');
  }

  const list = fdRes.stdout;
  if (!list.trim()) {
    return null;
  }

  const fzfRes = spawnSync('fzf', ['--ansi'], { input: list, encoding: 'utf8' });
  if (fzfRes.status !== 0) {
    return null;
  }
  return fzfRes.stdout.trim() || null;
}

function sizeIndex() {
  const stat = fs.statSync(INDEX_PATH);
  const lines = fs.readFileSync(INDEX_PATH, 'utf8').split('\n').length;
  return { bytes: stat.size, lines };
}

// Simple fzf-like scorer
function fuzzyScore(needle, hay) {
  needle = needle.toLowerCase();
  hay = hay.toLowerCase();
  let score = 0, j = 0;
  for (let c of needle) {
    const i = hay.indexOf(c, j);
    if (i === -1) return -1;
    score += (i === j) ? 3 : 1;
    j = i + 1;
  }
  return score;
}

function fuzzyFindPaths(tokens) {
  const idx = readIndex();
  const keys = Object.keys(idx.f || {});
  const qTokens = tokens.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = keys.filter(pathname => qTokens.every(token => pathname.toLowerCase().includes(token)));
  // secondary ordering by fuzzy score on concatenated query
  const joint = qTokens.join('');
  const scored = matches
    .map(pathname => ({ path: pathname, score: fuzzyScore(joint, pathname) }))
    .filter(entry => entry.score >= 0)
    .toSorted((a, b) => b.score - a.score);

  return scored.map(entry => entry.path);
}

function functionsInFile(file) {
  const idx = readIndex();
  const entry = idx.f[file];
  const rawSymbols = Array.isArray(entry) ? entry[1] : (entry && entry.t) || [];
  const parsed = [];

  for (const symbol of rawSymbols) {
    const match = symbol.match(/^([^:]+):([0-9]+):\(([^)]*)\):([^:]*)?:(.*)$/);
    if (!match) {
      continue;
    }

    parsed.push({
      name: match[1],
      line: Number(match[2]),
      sig: match[3],
      ret: match[4] || '',
      calls: (match[5] || '').split(',').filter(Boolean)
    });
  }

  return parsed;
}

function findFunction(fnName) {
  const idx = readIndex();
  const out = [];
  for (const [file, value] of Object.entries(idx.f || {})) {
    const symbolList = Array.isArray(value) ? value[1] : (value && value.t) || [];
    for (const symbol of symbolList) {
      if (!symbol.startsWith(`${fnName}:`)) {
        continue;
      }

      const match = symbol.match(/^([^:]+):([0-9]+):/);
      if (match) {
        out.push({ file, line: Number(match[2]) });
      }
    }
  }
  return out;
}

function callersOf(fnName) {
  const idx = readIndex();
  const g = idx.g || [];
  return g.filter(e => e[1] === fnName).map(e => e[0]);
}

function calleesOf(fnName) {
  const idx = readIndex();
  const g = idx.g || [];
  return g.filter(e => e[0] === fnName).map(e => e[1]);
}

function importsOfFile(file) {
  const idx = readIndex();
  return (idx.deps && idx.deps[file]) ? idx.deps[file] : [];
}

function consumersOfFile(file) {
  const idx = readIndex();
  const out = [];
  if (!idx.deps) return out;
  for (const [k, arr] of Object.entries(idx.deps)) {
    if ((arr || []).includes(file)) out.push(k);
  }
  return out;
}

function routes() {
  const idx = readIndex();
  const keys = Object.keys(idx.f || {});
  const re = /^(app[/].*[/]page\.(ts|tsx)|app[/]api[/].*[/]route\.(ts|tsx))$/;
  return keys.filter(key => re.test(key));
}

function tests() {
  const idx = readIndex();
  return Object.keys(idx.f || {}).filter(k => k.startsWith('__tests__/'));
}

function topExtensions(limit = 20) {
  const idx = readIndex();
  const map = {};
  for (const k of Object.keys(idx.f || {})) {
    const m = k.match(/\.([^./]+)$/);
    const ext = m ? m[1] : '';
    map[ext] = (map[ext] || 0) + 1;
  }
  return Object.entries(map)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([ext, count]) => ({ ext, n: count }));
}

function graphEdges() {
  const idx = readIndex();
  return (idx.g || []).map(([from, to]) => ({ from, to }));
}

function toDOT(edges) {
  const lines = ['digraph G {'];
  for (const e of edges) lines.push(`  "${e.from}" -> "${e.to}";`);
  lines.push('}');
  return lines.join('\n');
}

export {
  INDEX_PATH,
  hasJq, hasRg, hasFd,
  hasFzf,
  jq, readIndex, sizeIndex,
  fuzzyFindPaths, functionsInFile, findFunction,
  callersOf, calleesOf, importsOfFile, consumersOfFile,
  routes, tests, topExtensions, graphEdges, toDOT,
  rgSearch, fdSearch, directoryStructure, interactiveFileSelect
};

const modulePath = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === modulePath;
if (invokedDirectly) {
  const cmd = process.argv[2];
  if (!cmd) {
    console.log(JSON.stringify({ index: INDEX_PATH, size: sizeIndex(), hasJq: hasJq() }, undefined, 2));
    process.exit(0);
  }
  const lib = {
    INDEX_PATH,
    hasJq, hasRg, hasFd,
    jq, readIndex, sizeIndex,
    fuzzyFindPaths, functionsInFile, findFunction,
    callersOf, calleesOf, importsOfFile, consumersOfFile,
    routes, tests, topExtensions, graphEdges, toDOT,
    rgSearch, fdSearch
  };
  if (!lib[cmd]) {
    console.error(`Unknown cmd. Available: ${Object.keys(lib).join(', ')}`);
    process.exit(1);
  }
  const args = process.argv.slice(3);
  const out = lib[cmd](...args);
  if (typeof out === 'string') console.log(out);
  else console.log(JSON.stringify(out, undefined, 2));
}
