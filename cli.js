#!/usr/bin/env node

import { evaluateConfig } from './config.js';
import { generate } from './mkmanifest.js';
import { synoptions } from './options.js';
import synopt from './synopt.js';

const imageType = 'png';
const imageMIMEType = 'image/png';

const webmanifestDefaults = {
  start_url: "/",
  display: "browser",
  background_color: "#fff",
};

let config
try {
  config = evaluateConfig(synopt, process.argv);
} catch (err) {
  console.error(err.message);
  console.info(synoptions.usage());
  exit(1);
}

generate();

if (config.watch) {
  watchFiles();
}
