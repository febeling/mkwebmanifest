import { loadConfig, findConfig } from './mkmanifest.js';

const defaults = {
  outdir: "public/",
  sizes: '512,192,180,168,144,96,72,48,32,16',
  outdir: 'public/',
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

const evaluateConfig = (synopt, argv) => {
  const options = synopt.parse(argv);
  const fileConfig = loadFileConfig(options);

  const config = { ...defaults, ...fileConfig, ...options };

  // icon

  if (!config.icon) {
    throw new Error("Source icon path missing");
  }

  // name 

  if (!config.name) {
    throw new Error('Name missing')
  }

  // outdir

  // sizes <string>      "comma-separated list of icon sizes to generate"

  const arr = config.sizes.split(',');
  config.sizesArray = arr;

  // short-name <string> "short variant of the app name"
  // display <string>    "configure browser UI or standalone", "browser"
  // description         "app description"
  // tags                "print meta tags to include manifest file and icons"
  // watch               "watch icon and configuration for changes"

  return config;
};

export { evaluateConfig };
