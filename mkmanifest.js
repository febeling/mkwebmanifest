import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import sharp from 'sharp';

const configFiles = [
  'config/mkwebmanifest.json',
  'mkwebmanifest.json',
  'mkwebmanifest.config.json',
  'config/mkwebmanifest.config.json'
];

const imageType = 'png';
const imageMIMEType = 'image/png';

const webmanifestDefaults = {
  start_url: "/",
  display: "browser",
  background_color: "#fff",
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
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`Unable to read configuration '${path}': `, error.message);
    exit(1);
  }
}

function resizeImage(inputPath, outputPath, size) {
  return sharp(inputPath)
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(outputPath);
}

async function generate(config) {
  const inputIconPath = config.icon;
  const basename = path.parse(inputIconPath).name;
  const outputImages = [];

  if (!fs.existsSync(inputIconPath)) {
    console.error(`Unable to read icon '${inputIconPath}'`);
    exit(1);
  }

  if (!fs.existsSync(config.outdir)) {
    fs.mkdirSync(config.outdir);
  }

  const iconsDir = path.join(config.outdir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  const { width, height } = await new sharp(inputIconPath).metadata();
  const maxSize = Math.max(...config.sizesArray);

  if (config.verbose && (width !== height)) {
    console.warn(`Icon isn't square format: ${width}x${height} - will be cropped`);
  }

  if (config.verbose && (width < maxSize || height < maxSize)) {
    console.warn(`Input icon size smaller than biggest output size. For best results use big (512x512) or vector input icons.`);
  }

  for (const imageSize of config.sizesArray) {
    const outputFilePath = path.join(iconsDir, `${basename}_${imageSize}x${imageSize}.${imageType}`);
    await resizeImage(inputIconPath, outputFilePath, imageSize);
    outputImages.push({
      src: outputFilePath,
      sizes: `${imageSize}x${imageSize}`,
      type: imageMIMEType
    });

    if (config.verbose) {
      console.log(`${`${imageSize}x${imageSize}`} written to ${outputFilePath}`);
    }
  }

  const { start_url, display, description, name, short_name } = config?.webmanifest || {};
  const webmanifest = {
    ...structuredClone(webmanifestDefaults),
    ...{ start_url, display, description, name, short_name }
  };
  webmanifest.icons = outputImages;
  const outputJsonFile = path.join(config.outdir, 'app.webmanifest');
  fs.writeFileSync(outputJsonFile, JSON.stringify(webmanifest, null, 2), 'utf8');

  if (config.verbose) {
    console.log(`Written app.webmanifest: ${outputJsonFile}`);
  }
}

function watchFiles() {
  fs.watch(configFile, (event) => {
    console.log(`JSON file changed (${event}), reloading...`);
    loadConfig();
    generate();
  });

  const { icon: inputIconPath } = config;
  fs.watch(inputIconPath, (event) => {
    console.log(`Image file changed (${event}), regenerating...`);
    generate();
  });

  console.log('Watching for changes...');
}

export {
  loadConfig,
  findConfig,
  watchFiles,
  generate,
};