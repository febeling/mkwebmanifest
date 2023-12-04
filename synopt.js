/** 
 * Parse an option declaration into a parser
 *
 * The object representing the option interface also parses an argument vector into an concrete options object.
 *
 * @param {string} [short] - The short form of the option, with this format '-f'
 * @param {string} name - The long option name, this format '--name' (two dashes, name of any length)
 * @param {string} [description] - Descriptive text of the option
 * @param {object} [options] - Options for this declaration. Example `{ boolean: true, required: true }`
 * @return {object} The option declaration representation object
 */

const parseDeclaration = (arr) => {
  const decl = arr.slice().reverse();

  const option = {};

  const reLong = /^(--([-\w]+?))( (\w+?)?)?$/;
  const reShort = /^-[^-]$/;

  while (decl.length > 0) {
    const elem = decl.pop();
    if (decl.length === 0 && typeof (elem) === 'object') {
      if (elem.boolean === true) {
        option.boolean = true;
      }
    } else if (reShort.test(elem)) {
      option.short = elem;
    } else if (reLong.test(elem)) {
      const [_all, long, name, _x, argname] = elem.match(reLong);
      option.long = long;
      option.argname = argname || name.toUpperCase();
      option.name = name;
    } else if (option.name && !option.description) {
      option.description = elem;
    } else {
      throw new Error("parse error", arr);
    }
  }
  if (!option.name || !option.long) {
    throw new Error('option name required');
  }
  return option;
};

const isOption = (string) => /^-/.test(string);

const createCommand = (name) => {
  const state = {
    name,
    optionDeclarations: [],
  };

  const command = {
    summary: (text) => {
      state.summary = text;
      return command;
    },
    description: (text) => {
      state.description = text;
      return command;
    },
    option: (...args) => {
      const declaration = parseDeclaration(args);
      state.optionDeclarations.push(declaration);
      return command;
    },
    parse: (args) => {
      const options = {};

      for (let i = 0; i < args.length; i++) {
        const element = args[i];
        const nextElement = args[i + 1];
        const decl = state.optionDeclarations.find(decl => decl.long === element);

        // if (!decl) {
        //   console.log(args, decl, element, state.optionDeclarations);
        //   throw new Error('Invariant: decl missing');
        // };

        if (decl?.boolean) {
          options[decl.name] = true;
        } else if (nextElement && !isOption(nextElement)) {
          options[decl.name] = nextElement;
          i++;
        } else {
          throw new Error(`non-boolean option requires value: ${element}`);
        }
      }

      return options;
    },
    declarations: () => state.optionDeclarations,
    usage: () => {
      const shorts = state.optionDeclarations.map((val, i) => val.short);
      const longs = state.optionDeclarations.map((val, i) => val.long);
      const argnames = state.optionDeclarations.map((val, i) => val.argname);
      const descriptions = state.optionDeclarations.map((val, i) => val.description);

      const longMax = Math.max(...longs.map((l, i) => {
        let len = l.length;
        if (!state.optionDeclarations[i].boolean) {
          len += argnames[i].length + 1;
        }
        return len;
      }));

      const anyShorts = shorts.filter(x => x).length > 0;

      const optionHelpLines = longs.map((long, i) => {
        return `    ${anyShorts ? (shorts[i] ? shorts[i] + ',' : '   ') : ''}  ${(long + (state.optionDeclarations[i].boolean ? '' : ` ${argnames[i]}`)).padEnd(longMax, ' ')}  ${descriptions[i]}`;
      });

      return [
        `Usage: ${state.name || 'SCRIPT_NAME'} [options]`,
        ...(!!state.summary ? ['', state.summary] : []),
        ...(!!state.description ? ['', state.description] : []),
        '',
        ...optionHelpLines
      ].join("\n");
    }
  };
  return command;
};

const synopt = createCommand();

export default synopt;
export { createCommand };