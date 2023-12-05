#!/usr/bin/env node

import { evaluateConfig } from './config.js';
import { generate, watchFiles } from './mkmanifest.js';
import { synoptions } from './options.js';
import synopt from './synopt.js';

let config;

const run = async () => {
  try {
    config = evaluateConfig(synopt, process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    console.info(synoptions.usage());
    process.exit(0);
  }

  await generate(config);
};

run();

if (config.watch) {
  const files = [
    config.icon,
    ...(config.configFile ? [config.configFile] : [])
  ];

  console.log(files)

  watchFiles(files, run);
}
