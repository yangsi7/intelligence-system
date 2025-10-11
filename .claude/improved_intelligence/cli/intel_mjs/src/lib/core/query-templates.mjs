/**
 * query-templates.js - Reusable jq query templates
 * These templates can be used with string interpolation to build complex queries
 */

const raw = String.raw;
const flatten = (strings, ...values) => raw(strings, ...values).replaceAll('\n', ' ');

export const templates = {
  /**
   * File and symbol discovery templates
   */
  findFile: (pattern) => raw`.f | keys[] | select(test("${pattern}"))`,

  findFileExact: (name) => raw`.f | keys[] | select(. == "${name}")`,

  findFunction: (name) => flatten`
    def syms(v):
      (if v|type=="array" then v[1]
       elif (v|type=="object" and v.t?) then v.t
       else [] end);
    .f | to_entries[]
    | . as $e
    | syms($e.value)[]?
    | select(test("^${name}:"))
    | {file:$e.key, symbol:.}
  `,

  getSymbolsInFile: (file) => flatten`
    def syms(v):
      (if v|type=="array" then v[1]
       elif (v|type=="object" and v.t?) then v.t
       else [] end);
    (.f["${file}"] | syms(.))[]?
  `,

  /**
   * Call graph templates
   */
  getCallers: (fn) => raw`.g[]? | select(.[1]=="${fn}") | .[0]`,

  getCallees: (fn) => raw`.g[]? | select(.[0]=="${fn}") | .[1]`,

  getCallChain: (from, to) => flatten`
    def path($f; $t):
      if $f == $t then [$f]
      elif (.g[]? | select(.[0]==$f and .[1]==$t)) then [$f, $t]
      else
        [.g[]? | select(.[0]==$f) | .[1]] as $next
        | [$f] + ([$next[] | path(.; $t)] | min_by(length))
      end;
    path("${from}"; "${to}")
  `,

  /**
   * Dependency templates
   */
  getImports: (file) => raw`.deps["${file}"]//[]`,

  getConsumers: (file) => flatten`
    .deps | to_entries[]
    | select(.value[]? == "${file}")
    | .key
  `,

  getTransitiveDeps: (file, depth = 2) => flatten`
    def deps($f; $d):
      if $d == 0 then []
      else
        (.deps[$f]//[]) as $direct
        | $direct + ([$direct[] | deps(.; $d-1)] | add//[])
      end;
    deps("${file}"; ${depth}) | unique
  `,

  /**
   * Pattern matching templates
   */
  findByExtension: (ext) => raw`.f | keys[] | select(test("\.${ext}$"))`,

  findInDirectory: (dir) => raw`.f | keys[] | select(test("^${dir}/"))`,

  findByPattern: (pattern) => raw`.f | keys[] | select(test("${pattern}"))`,

  /**
   * Analysis templates
   */
  getCentrality: () => flatten`
    [.g[]? | .[1]] | group_by(.)
    | map({fn:.[0], degree:length})
    | sort_by(-.degree)
  `,

  getHotspots: (limit = 10) => flatten`
    .deps | to_entries
    | map(. as $e | ($e.value[]? | {from:$e.key, to:.}))
    | group_by(.to)
    | map({file:.[0].to, imports:length})
    | sort_by(-.imports)[:${limit}]
  `,

  getCircularDeps: () => flatten`
    .deps | to_entries[] as $e1
    | .deps | to_entries[] as $e2
    | select($e1.key < $e2.key and
             ($e1.value[]? == $e2.key) and
             ($e2.value[]? == $e1.key))
    | {cycle: [$e1.key, $e2.key]}
  `,

  /**
   * Next.js specific templates
   */
  getPages: () => raw`.f | keys[] | select(test("^app/.*/page\.(ts|tsx)$"))`,

  getLayouts: () => raw`.f | keys[] | select(test("^app/.*/layout\.(ts|tsx)$"))`,

  getApiRoutes: () => raw`.f | keys[] | select(test("^app/api/.*/route\.(ts|tsx)$"))`,

  getMiddleware: () => raw`.f | keys[] | select(test("^middleware\.(ts|tsx)$"))`,

  getServerComponents: () => raw`.f | keys[] | select(test("^app/.*\.(ts|tsx)$") and test("use client"|not))`,

  getClientComponents: () => flatten`
    def syms(v):
      (if v|type=="array" then v[1]
       elif (v|type=="object" and v.t?) then v.t
       else [] end);
    .f | to_entries[]
    | select(.key | test("^app/.*\\.(ts|tsx)$"))
    | select(syms(.value)[]? | test("use client"))
    | .key
  `,

  /**
   * Test templates
   */
  getTestFiles: () => raw`.f | keys[] | select(test("test|spec"))`,

  getTestsForFile: (file) => flatten`
    .deps | to_entries[]
    | select((.value[]? == "${file}") and (.key | test("test|spec")))
    | .key
  `,

  getUntestedFiles: () => flatten`
    .f | keys[] as $file
    | select((if ($file|type)=="string" then ($file|test("test|spec"))|not else false end))
    | select([.deps | to_entries[] | select(.value[]? == $file and (.key | test("test|spec")))] | length == 0)
    | $file
  `,

  /**
   * Database/Supabase templates
   */
  getMigrations: () => raw`.f | keys[] | select(test("migrations/.*\\.sql$"))`,

  getDbSchema: () => raw`.f | keys[] | select(test("schema\\.(sql|prisma)$"))`,

  getSupabaseEdgeFunctions: () => raw`.f | keys[] | select(test("^supabase/functions/"))`,

  /**
   * Utility templates
   */
  getStats: () => '.stats',

  getFileCount: () => '.f | keys | length',

  getFunctionCount: () => flatten`
    def syms(v):
      (if v|type=="array" then v[1]
       elif (v|type=="object" and v.t?) then v.t
       else [] end);
    [.f | to_entries[] | syms(.value)[]?] | length
  `,

  getCallGraphSize: () => '.g | length',

  getDependencyCount: () => '.deps | to_entries | map(.value | length) | add',

  /**
   * Orphan and dead code templates
   */
  getOrphans: () => flatten`
    .deps as $D
    | (.f | keys[]) as $k
    | select([$D | to_entries[] | select(.value[]? == $k) | .key] | length == 0)
    | select((if ($k|type)=="string" then ($k|test("test|spec"))|not else false end))
    | $k
  `,

  getDeadFunctions: () => flatten`
    def all_fns: [.g[]? | .[0]] | unique;
    def called_fns: [.g[]? | .[1]] | unique;
    all_fns - called_fns
  `,

  getUnusedExports: () => flatten`
    def exports($file):
      def syms(v):
        (if v|type=="array" then v[1]
         elif (v|type=="object" and v.t?) then v.t
         else [] end);
      .f[$file] | syms(.) | map(split(":")[0]);

    .f | keys[] as $file
    | exports($file) as $exp
    | $exp[] as $e
    | select([.g[]? | select(.[1] == $e)] | length == 0)
    | {file: $file, export: $e}
  `,

  /**
   * Complex analysis templates
   */
  getTwoHopNeighbors: (fn) => flatten`
    def succ($x): [.g[]? | select(.[0]==$x) | .[1]];
    (succ("${fn}") | unique) as $n1
    | [$n1[]?, ([$n1[]? | succ(.)[]] | unique[])] | unique
  `,

  getImpactRadius: (file, hops = 2) => flatten`
    def consumers($f; $h):
      if $h == 0 then []
      else
        (.deps | to_entries[] | select(.value[]? == $f) | .key) as $c
        | [$c] + consumers($c; $h-1)
      end;
    consumers("${file}"; ${hops}) | unique
  `,

  getCommunityByImports: () => flatten`
    .deps | to_entries
    | group_by(.key | split("/")[0])
    | map({
        community: .[0].key | split("/")[0],
        files: map(.key),
        imports: map(.value) | add | unique | length
      })
  `
};

/**
 * Helper function to escape special characters in patterns
 */
const escapePattern = (pattern) =>
  pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Helper function to build fuzzy search pattern
 */
const buildFuzzyPattern = (text) => [...text.toLowerCase()]
  .map(character => escapePattern(character))
  .join('.*');

/**
 * Composite query builders
 */
export const builders = {
  /**
   * Build a complete module analysis query
   */
  moduleAnalysis: (modulePath) => {
    const queries = [
      templates.getSymbolsInFile(modulePath),
      templates.getImports(modulePath),
      templates.getConsumers(modulePath),
      templates.getTestsForFile(modulePath)
    ];
    return queries.join(' | ');
  },

  /**
   * Build a function trace query
   */
  functionTrace: (functionName) => {
    const queries = [
      templates.findFunction(functionName),
      templates.getCallers(functionName),
      templates.getCallees(functionName),
      templates.getTwoHopNeighbors(functionName)
    ];
    return queries.join(' | ');
  },

  /**
   * Build a complete health check query
   */
  healthCheck: () => {
    const queries = [
      templates.getStats(),
      templates.getFileCount(),
      templates.getFunctionCount(),
      templates.getOrphans(),
      templates.getDeadFunctions(),
      templates.getCircularDeps()
    ];
    return queries.join(' | ');
  }
};

export { escapePattern, buildFuzzyPattern };
