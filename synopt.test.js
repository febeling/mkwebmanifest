import { createCommand } from './synopt';

let synopt;

beforeEach(() => {
  synopt = createCommand('mkstuf');
});

describe('option declaration parsing', () => {
  test('name', () => {
    synopt.option("--name NAME");
    expect(synopt.declarations()).toEqual([{
      name: "name",
      long: "--name",
      argname: "NAME"
    }]);
  });

  test('name default to same in uppercase', () => {
    synopt.option("--code");
    expect(synopt.declarations()).toEqual([{
      name: "code",
      long: "--code",
      argname: "CODE"
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
      long: "--num",
      argname: "NUM",
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
      long: "--num",
      argname: "NUM",
      description: "The number of it"
    }]);
  });

  test('boolean', () => {
    synopt.option("--count", "The count", { boolean: true });
    expect(synopt.declarations()).toEqual([{
      name: "count",
      argname: "COUNT",
      long: "--count",
      description: "The count",
      boolean: true,
    }]);
  });
});

test('usage banner', () => {
  synopt
    .summary('Summary.')
    .description('Description, which is longer.')
    .option("-n", "--name NAME", "Name to be used")
    .option("-f", "--config PATH", "Path to the configuration file")
    .option("--fast", "Fast algorithm", { boolean: true });

  expect(synopt.usage().trim()).toEqual(`Usage: mkstuf [options]

Summary.

Description, which is longer.

    -n,  --name NAME    Name to be used
    -f,  --config PATH  Path to the configuration file
         --fast         Fast algorithm`
  );
});

describe('parse argument vector', () => {
  test('parse', () => {
    synopt.option("--name");
    const options = synopt.parse(["--name", "Test-1"]);
    expect(options).toEqual({ name: "Test-1" });
  });

  test('last wins if used twice', () => {
    synopt.option("--name");
    const options = synopt.parse(["--name", "Test-1", "--name", "Test-2"]);
    expect(options).toEqual({ name: "Test-2" });
  });

  test('raise if value is missing', () => {
    synopt
      .option("--name")
      .option("--config");
    expect(() => {
      synopt.parse(["--name"]);
    }).toThrow('non-boolean option requires value: --name');
  });

  test('don\'t raise if value is missing but boolean', () => {
    synopt.option("--flat", { boolean: true });
    expect(() => {
      const opts = synopt.parse(["--flat"]);
    }).not.toThrow();
  });

  test('missing value (end of input)', () => {
    synopt.option("--name");
    expect(() => {
      const opts = synopt.parse(["--name"]);
    }).toThrow('non-boolean option requires value: --name');
  });

  test('missing value (next is option short or long)', () => {
    synopt
      .option("--name")
      .option("--flat", { boolean: true });
    expect(() => {
      synopt.parse(["--name", "--flat"]);
    }).toThrow('non-boolean option requires value: --name');
  });

  // options object correct
});
