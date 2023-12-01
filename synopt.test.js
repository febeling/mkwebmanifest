import { createCommand } from './synopt';

let synopt;

beforeEach(() => {
  synopt = createCommand('mkstuf');
});

test('name', () => {
  synopt.option("--name NAME");
  expect(synopt.declarations()).toEqual([{
    name: "name",
    long: "--name NAME"
  }]);
});

test('name without argname', () => {
  synopt.option("--name");
  expect(synopt.declarations()).toEqual([{
    name: "name",
    long: "--name"
  }]);
});

test('name is required', () => {
  expect(() => {
    synopt.option();
  }).toThrow();
});

test('option flag, short name', () => {
  synopt.option("-n", "--num NUM");
  expect(synopt.declarations()).toEqual([{
    name: "num",
    long: "--num NUM",
    short: "-n"
  }]);
});

test('only short throws', () => {
  expect(() => {
    synopt.option("-n");
  }).toThrow();
});

test('description', () => {
  synopt.option("--num NUM", "The number of it");
  expect(synopt.declarations()).toEqual([{
    name: "num",
    long: "--num NUM",
    description: "The number of it"
  }]);
});

test('boolean', () => {
  synopt.option("--count", "The count", { boolean: true });
  expect(synopt.declarations()).toEqual([{
    name: "count",
    long: "--count",
    description: "The count",
    boolean: true,
  }]);
});

test('usage banner', () => {
  synopt
    .summary('Summary.')
    .description('Description, which is longer.')
    .option("-n", "--name NAME", "Name to be used")
    .option("-f", "--config PATH", "Path to the configuration file");

  expect(synopt.usage().trim()).toEqual(`Usage: mkstuf [options]

Summary.

Description, which is longer.

    -n,  --name NAME    Name to be used
    -f,  --config PATH  Path to the configuration file`
  );
});

// TODO chain - return self