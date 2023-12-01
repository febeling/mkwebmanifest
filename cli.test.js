import { execFileSync, execFile } from 'child_process';
import { evaluateConfig } from './cli';

test('missing icon path error message', () => {
  // const result = new Promise((resolve, reject) => {
  //   execFile('./cli.js', [], {}, (stdin, stdout, stderr) => {
  //     resolve(stderr.toString());
  //   });
  //   setTimeout(reject, 1000);
  // });
  // return result.then((stderr) => {
  //   expect(stderr).toMatch("Source icon path missing");
  // });
  
  try {
    expect(() => {
      evaluateConfig([], {});
    }).toThrow("Source icon path missing");
  } catch(err) {
    fail('caught error', err)
  }




});

// test('icon path is required', () => {
//   expect(() => {
//     execFileSync('./cli.js', []);
//   }).toThrow();
// });

// test('name is required', () => {
//   expect(() => {
//     execFileSync('../cli.js', ['--icon', 'fixtures/oval.svg'], {
//       cwd: './fixtures'
//     });
//   }).toThrow('Name missing');
// });

// test('config without name', () => {
//   expect(() => {
//     execFileSync('../cli.js', ['--icon', 'fixtures/oval.svg', '--config', 'config-without-name.json'], {
//       cwd: './fixtures'
//     });
//   }).toThrow('Name missing');
// });

// test('config with name', () => {
//   expect(() => {
//     execFileSync('../cli.js', ['--icon', 'fixtures/oval.svg', '--config', 'config-with-name.json'], {
//       cwd: './fixtures'
//     });
//   }).not.toThrow();
// });

// test('outdir defaults to public/', () => {
//   const args = [];
//   const fileConfig = {};
//   const config = evaluateConfig(args, fileConfig);
//   expect(config.outdir).toBe('./public');
// });