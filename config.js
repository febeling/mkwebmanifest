import fs from "fs";
import { exit } from "process";

const configFiles = [
  'config/mkwebmanifest.json',
  'mkwebmanifest.json',
  'mkwebmanifest.config.json',
  'config/mkwebmanifest.config.json'
];

const webmanifestDefaults = {
  start_url: "/",
  display: "browser",
  background_color: "#fff",
};

const defaults = {
  outdir: "public/",
  sizes: '512,192,180,168,144,96,72,48,32,16',
};

const loadFileConfig = (configFile) => {
  const hasConfigFileOption = !!configFile;
  let fileConfig = {};

  if (hasConfigFileOption) {
    fileConfig = loadConfig(configFile);
  } else {
    const defaultConfigFile = findConfig();
    if (defaultConfigFile) {
      fileConfig = loadConfig(defaultConfigFile);
    }
  }

  return fileConfig;
};

const evaluateConfig = (synopt, argv) => {
  const options = synopt.parse(argv);
  const fileConfig = loadFileConfig(options.config);

  const config = { ...defaults, ...fileConfig, ...options };

  // icon

  if (!config.icon) {
    throw new Error("Source icon path missing");
  }

  // name 

  if (!config.name) {
    throw new Error('Name missing');
  }

  config.sizesArray = config.sizes.split(',').map(s => parseInt(s, 10));

  return config;
};

function findConfig() {
  try {
    return configFiles.find(path => fs.existsSync(path));
  } catch (error) {
    console.error(`Unable to determine config file: `, error.message);
    exit(1);
  }
}

function loadConfig(path) {
  try {
    const config = JSON.parse(fs.readFileSync(path, 'utf8'));
    config.configFile = path;
    return config;
  } catch (error) {
    console.error(`Unable to read configuration '${path}': `, error.message);
    exit(1);
  }
}

export {
  webmanifestDefaults,
  configFiles,
  evaluateConfig,
  loadConfig,
}; 
