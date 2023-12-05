import { loadConfig, findConfig } from './mkmanifest.js';

const defaults = {
  outdir: "public/",
  sizes: '512,192,180,168,144,96,72,48,32,16',
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
    throw new Error('Name missing');
  }

  config.sizesArray = config.sizes.split(',').map(s => parseInt(s, 10));

  return config;
};

export { evaluateConfig };
