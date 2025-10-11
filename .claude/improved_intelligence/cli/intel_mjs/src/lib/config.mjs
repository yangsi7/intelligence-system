/**
 * Configuration loader for code‑intel.
 *
 * This module attempts to read a JSON configuration file that defines
 * project‑specific settings such as domain keywords, test file patterns and
 * preset definitions.  The path can be specified via the `CODE_INTEL_CONFIG`
 * environment variable.  If no configuration file exists, sensible defaults
 * are returned.  Consumers should not throw errors if the file is missing.
 */

import fs from 'node:fs';
import path from 'node:path';

export function loadConfig() {
  const envPath = process.env.CODE_INTEL_CONFIG;
  const configPath = envPath
    ? path.resolve(envPath)
    : path.resolve(process.cwd(), '.code-intel-config.json');

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(content);
      return parsed;
    } catch (err) {
      console.error(`Failed to parse config file at ${configPath}: ${err.message}`);
    }
  }
  // Default configuration
  return {
    domainKeywords: [],
    testPatterns: ['**/*.test.ts', '**/*.test.tsx'],
    presets: {
      compact: ['overview', 'hotspots'],
      standard: ['overview', 'patterns', 'hotspots'],
      extended: ['overview', 'patterns', 'hotspots', 'graph stats', 'graph cycles']
    }
  };
}

export default { loadConfig };