import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import sharp from 'sharp';
import { webmanifestDefaults } from './config.js';

const imageType = 'png';
const imageMIMEType = 'image/png';

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
    console.error(`Icon not found: '${inputIconPath}'`);
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

  // Assemble the properties

  const webmanifest = {
    ...structuredClone(webmanifestDefaults),
    ...config?.webmanifest || {}
  };

  config.name && (webmanifest.name = config.name);
  webmanifest.icons = outputImages;

  // Write to file

  const outputJsonFile = path.join(config.outdir, 'app.webmanifest');
  fs.writeFileSync(outputJsonFile, JSON.stringify(webmanifest, null, 2), 'utf8');

  if (config.verbose) {
    console.log(`Written app.webmanifest: ${outputJsonFile}`);
  }
}

function watchFiles(files, callback) {
  files.forEach(file => {
    console.log(`File changed (${file}), regenerating...`);
    fs.watch(file, callback);
  });

  console.log('Watching for changes...');
}

export {
  watchFiles,
  generate,
};