import { execFileSync } from 'child_process';
import { open } from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';
import { promises as fs } from 'fs';

test('runs with clean exit code and output', () => {
  expect(() => {
    const output = execFileSync('./cli.js', ['--icon', 'fixtures/check-badge.svg', "-nName-1", "--ico"], {});
    expect(output.toString()).toEqual('');
  }).not.toThrow();
});

test('`icon` path is relative to `outdir`', async () => {
  const output = execFileSync('./cli.js', ['--icon', 'fixtures/check-badge.svg', "-nName-1"], {});
  expect(output.toString()).toEqual('');

  const content = await (await open('./public/app.webmanifest')).readFile();
  const manifest = JSON.parse(content);

  const icon = manifest.icons[0];
  expect(icon.src).toEqual('icons/check-badge_512x512.png');
  expect(icon.type).toEqual('image/png');
  expect(icon.sizes).toEqual('512x512');
});

test('generates favicon.ico file', async () => {
  await fs.rm('./public/favicon.ico', { force: true });

  const output = execFileSync('./cli.js', ['--icon', 'fixtures/check-badge.svg', "-nName-1", "--ico"], {});
  expect(output.toString()).toEqual('');

  const content = await (await open('./public/favicon.ico')).readFile();
  expect(content).toBeDefined();
});
