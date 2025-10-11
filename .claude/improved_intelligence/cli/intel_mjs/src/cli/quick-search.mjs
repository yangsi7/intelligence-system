#!/usr/bin/env node
/**
 * scripts/quick-search.js
 * Fast CLI for targeted queries over PROJECT_INDEX.json
 *
 * Examples:
 *   node scripts/quick-search.js file "auth otp"
 *   node scripts/quick-search.js fn calculateDecision
 *   node scripts/quick-search.js callers handleSubmit
 *   node scripts/quick-search.js deps app/api/example/route.ts
 */
import { pathToFileURL } from 'node:url';

import {
  fuzzyFindPaths,
  findFunction,
  callersOf,
  calleesOf,
  importsOfFile,
  consumersOfFile,
  routes,
  tests,
  graphEdges,
  toDOT
} from '../lib/project-utils.mjs';

function usage() {
  return `Usage:
  file <tokens...>              # fuzzy path search (token AND)
  fn <name>                     # find function locations
  callers <fn>                  # list direct callers
  callees <fn>                  # list direct callees
  deps <file>                   # imports of a file
  rdeps <file>                  # consumers of a file
  routes                        # list page and API routes
  tests                         # list test files
  dot                           # emit DOT of function graph`;
}

export function runQuickSearch(argv = process.argv.slice(2)) {
  const [cmd, ...rest] = argv;

  if (!cmd) {
    console.log(usage());
    return 1;
  }

  switch (cmd) {
    case 'file': {
      const q = rest.join(' ');
      console.log(JSON.stringify(fuzzyFindPaths(q), null, 2));
      return 0;
    }
    case 'fn': {
      console.log(JSON.stringify(findFunction(rest[0]), null, 2));
      return 0;
    }
    case 'callers': {
      console.log(JSON.stringify(callersOf(rest[0]), null, 2));
      return 0;
    }
    case 'callees': {
      console.log(JSON.stringify(calleesOf(rest[0]), null, 2));
      return 0;
    }
    case 'deps': {
      console.log(JSON.stringify(importsOfFile(rest[0]), null, 2));
      return 0;
    }
    case 'rdeps': {
      console.log(JSON.stringify(consumersOfFile(rest[0]), null, 2));
      return 0;
    }
    case 'routes': {
      console.log(JSON.stringify(routes(), null, 2));
      return 0;
    }
    case 'tests': {
      console.log(JSON.stringify(tests(), null, 2));
      return 0;
    }
    case 'dot': {
      console.log(toDOT(graphEdges()));
      return 0;
    }
    default:
      console.log(usage());
      return 1;
  }
}

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isMain) {
  const code = runQuickSearch();
  if (typeof code === 'number') {
    process.exit(code);
  }
}
