#!/usr/bin/env node

import { evaluateConfig } from './config.js';
import { generate } from './mkmanifest.js';
import { synoptions } from './options.js';
import synopt from './synopt.js';

let config;
try {
  config = evaluateConfig(synopt, process.argv.slice(2));
} catch (err) {
  console.error(err.message);
  console.info(synoptions.usage());
  process.exit(0);
}

generate(config);

if (config.watch) {
  watchFiles();
}
