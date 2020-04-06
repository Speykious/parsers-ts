import { Parser } from './Parser';
// import { ParserState } from './ParserState';
import { colors } from './colors';
import { ParserState } from './ParserState';

/**
 * Creates a parser that matches a string.
 * @param s The string to match when parsing.
 */
export const str = (s: string) =>
	new Parser<string>((inputState) => {
		if (inputState.targetString.slice(inputState.index).startsWith(s))
			return new ParserState(inputState.targetString, inputState.index + s.length, s);
		else
			return inputState.errorify((targetString, index) =>
				`Tried to match "${s}", but got "${targetString.slice(index, s.length + index)}" instead.`
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

	return Parser.newStandard(r,
		(matchString) => matchString,
		(targetString, index) => `'${targetString.slice(index)}' does not match with the regex /${r.source}/${r.flags}.`
	);
};

export const spaces = reg(/^\s+/)
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with spaces`);
export const word = reg(/^\w+/)
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with a word`);
export const letters = reg(/^[A-Za-z]+/)
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with letters`);
export const digits = reg(/^\d+/)
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with digits`);
export const uint = digits.map(result => Number(result))
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with a number`);
export const newlines = reg(/^(\r?\n)+/)
.mapError((targetString, index) => `'${targetString.slice(index)}' does not begin with newlines`);
