import { execFileSync, execFile } from 'child_process';
// import { evaluateConfig } from './cli';
import { program } from 'commander';

test('exit override', () => {
  program
    .option("--name <name>")
    .exitOverride()

  try {
    program.error('The error')
  } catch(err) {
    console.log('caught', err)
  }
});
