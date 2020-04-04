import { Parser } from './Parser';
// import { ParserState } from './ParserState';
import { colors } from './colors';
import { ParserState } from './ParserState';

/**
 * Creates a parser that matches a string.
 * @param s The string to match when parsing.
 */
export const str = (s: string) =>
  new Parser((inputState) => {
    if (inputState.targetString.slice(inputState.index).startsWith(s))
      return new ParserState(
        inputState.targetString,
        inputState.index + s.length,
        s
      );
    else
      return ParserState.errorify(
        inputState,
        (targetString, index = 0) =>
          `Tried to match "${s}", but got "${targetString.slice(
            index,
            s.length + index
          )}" instead.`
      );
  });

/**
 * Creates a parser that matches a regex.
 * @param r The regex to match when parsing.
 */
export const reg = (r: RegExp) => {
  const crx = `${colors.FgRed}/${r.source}/${r.flags}${colors.Reset}`;
  if (r.source[0] !== '^')
    throw new Error(
      `The regex provided (${crx}) doesn't begin with ${colors.FgGreen}'^'${colors.Reset}.`
    );

  return Parser.newStandard(
    r,
    (matchString) => matchString,
    (targetString) =>
      `'${targetString}' does not match with the regex /${r.source}/${r.flags}.`
  );
};

export const spaces = reg(/^\s+/);
export const word = reg(/^\w+/);
export const digits = reg(/^\d+/);
export const newlines = reg(/^(\r?\n)+/);
