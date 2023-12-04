import { evaluateConfig } from './config.js';
import { synoptions } from './options.js'

test('`icon` is required', () => {
  expect(() => {
    evaluateConfig(synoptions, []);
  }).toThrow("Source icon path missing");
});

test('`name` is required', () => {
  expect(() => {
    evaluateConfig(synoptions, ["--icon", "./icon.svg"]);
  }).toThrow('Name missing');
});

test('config without name', () => {
  expect(() => {
    evaluateConfig(synoptions, [
      "--icon",
      "./icon.svg",
      "--config",
      "./fixtures/config-without-name.json"
    ]);
  }).toThrow('Name missing');
});

test('config with name', () => {
  let config;
  expect(() => {
    config = evaluateConfig(synoptions, [
      "--icon",
      "./icon.svg",
      "--config",
      "./fixtures/config-with-name.json"
    ]);
  }).not.toThrow();
  expect(config.name).toBe('test-app');
});

test('outdir defaults to public/', () => {
  const args = ["--icon", "i.png", "--name", "name-1"];
  const config = evaluateConfig(synoptions, args);
  expect(config.outdir).toBe('public/');
});
