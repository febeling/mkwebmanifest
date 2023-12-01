#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import { loadConfig, findConfig } from './index.js';

program
  .summary("Generate icons and web manifest for web applications")
  .description('`icon` path is required. `name` can be guessed from package.json, else it\'s required, too. Pass required parameters as options or in the .json config file')
  .option("--icon <path>", "source icon (.svg, .png, etc.)")
  .option("--name <string>", "name of the web application")
  .option("--config <path>", "configuration file")
  .option("--outdir <path>", "directory path for generated files")
  .option("--sizes <string>", "comma-separated list of icon sizes to generate")
  .option("--short-name <string>", "short variant of the app name")
  .option("--display <string>", "configure browser UI or standalone")
  .option("--description", "app description")
  .option("--tags", "print meta tags to include manifest file and icons")
  .option("--watch", "watch icon and configuration for changes")
  .exitOverride((err) => {
    // console.log('exit skipped', err);
    throw err;
  });

const outdir = 'app/assets/builds';
const sizes = [512, 192, 180, 168, 144, 96, 72, 48, 32, 16];
const imageType = 'png';
const imageMIMEType = 'image/png';

const webmanifestDefaults = {
  start_url: "/",
  display: "browser",
  background_color: "#fff",
};

const loadFileConfig = ({ config }) => {
  const hasConfigFileOption = !!config;
  let fileConfig = {};

  if (hasConfigFileOption) {
    fileConfig = loadConfig(config);
  } else {
    const defaultConfigFile = findConfig();
    if (defaultConfigFile) {
      fileConfig = loadConfig(defaultConfigFile);
    }
  }

  return fileConfig;
};

const evaluateConfig = (argv, fileConfig = {}) => {
  let configError = null;

  program.parse(argv);
  const options = program.opts();
  fileConfig = loadFileConfig(options);

  const config = { ...fileConfig, ...options };

  // icon

  if (!config.icon) {
    try {
      program.error("Source icon path missing");
    } catch(err) {
      // only happens in testing, exits in prod
      console.error("XXX", err)
    }
  }

  // name 

  if (!config.name) {
    try {
      const packageJson = JSON.parse(fs.readFileSync("./package.json"));
      const packageName = packageJson.name;
      if (!!packageName) {
        console.log('name: ', packageName);
        config.name = packageName;
      } else {
        throw new Error('no name');
      }
    } catch (error) {
      program.error("Name missing");
    }
  }

  // outdir

  // .option("--sizes <string>", "comma-separated list of icon sizes to generate")
  // .option("--short-name <string>", "short variant of the app name")
  // .option("--display <string>", "configure browser UI or standalone", "browser")
  // .option("--description", "app description")
  // .option("--tags", "print meta tags to include manifest file and icons")
  // .option("--watch", "watch icon and configuration for changes")

  return { evaluateConfig };
};

const config = evaluateConfig(process.argv);

// generate();

// if (watch) {
//   watchFiles();
// }

console.log("----");
console.log("Effective config: ", config);

export { evaluateConfig };