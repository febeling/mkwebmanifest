#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exit, argv } from 'process';
import sharp from 'sharp';

const watch = argv === '--watch';
const configFile = 'config/webmanifest-config.json';
const outdir = 'app/assets/builds';
const sizes = [512, 192, 180, 168, 144, 96, 72, 48, 32, 16];
const imageType = 'png';
const imageMIMEType = 'image/png';

const webmanifestDefaults = {
  start_url: "/",
  display: "browser",
  background_color: "#fff",
  // name
  // short_name
  // description
};

let config;

function loadJson() {
  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (error) {
    console.error(`Unable to read configuration '${configFile}'`, error.message);
    exit(1);
  }
}

loadJson();

function resizeImage(inputPath, outputPath, size) {
  return sharp(inputPath)
    .resize(size, size, {
      fit: 'contain',
      position: 'center',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(outputPath);
}

async function generate() {
  const inputIconPath = config.icon;
  const basename = path.parse(inputIconPath).name;
  const outputImages = [];

  if (!fs.existsSync(inputIconPath)) {
    console.error(`Unable to read icon '${inputIconPath}'`);
    exit(1);
  }

  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
  }

  if (!fs.existsSync(`${outdir}/icons`)) {
    fs.mkdirSync(`${outdir}/icons`);
  }

  for (const imageSize of sizes) {
    const outputFilePath = `${outdir}/icons/${basename}_${imageSize}x${imageSize}.${imageType}`;
    await resizeImage(inputIconPath, outputFilePath, imageSize);
    outputImages.push({
      src: outputFilePath,
      sizes: `${imageSize}x${imageSize}`,
      type: imageMIMEType
    });
    console.log(`Icon ${`${imageSize}x${imageSize}`}: ${outputFilePath}`);
  }

  const { start_url, display, description, name, short_name } = config.webmanifest;
  const webmanifest = {
    ...structuredClone(webmanifestDefaults),
    ...{ start_url, display, description, name, short_name }
  };
  webmanifest.icons = outputImages;
  const outputJsonFile = `${outdir}/app.webmanifest`;
  fs.writeFileSync(outputJsonFile, JSON.stringify(webmanifest, null, 2), 'utf8');
  console.log(`Written app.webmanifest: ${outputJsonFile}`);
}

function watchFiles() {
  fs.watch(configFile, (event) => {
    console.log(`JSON file changed (${event}), reloading...`);
    loadJson();
    generate();
  });

  const { icon: inputIconPath } = config;
  fs.watch(inputIconPath, (event) => {
    console.log(`Image file changed (${event}), regenerating...`);
    generate();
  });

  console.log('Watching for changes...');
}

generate();

if (watch) {
  watchFiles();
}
