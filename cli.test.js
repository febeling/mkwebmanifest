import { execFileSync } from 'child_process';

test('`runs with clean exit code and output', () => {
  expect(() => {
    const output = execFileSync('./cli.js', ['--icon', 'fixtures/check-badge.svg', "-nName-1"], {});
    expect(output.toString()).toEqual('');
  }).not.toThrow();
});
