import { Parser } from './Parser';
import { colors } from './colors';

/** Creates a parser that matches a string.
 * @param s The string to match when parsing. */
export const str = (s: string) =>
	new Parser<string>(inputState => {
		if (inputState.targetString.slice(inputState.index).startsWith(s))
			return inputState.update(inputState.index + s.length, s);
		else {
			const match = inputState.targetString
				.slice(inputState.index, s.length + inputState.index)
			
			return inputState.errorify({
				info: `Tried to match "${s}", but got "${match}" instead.`,
				match: match
			});
		}
			
	});

/** Creates a parser that matches a regex.
 * @param r The regex to match when parsing. */
export const reg = (r: RegExp) => {
	const crx = `${colors.FgRed}/${r.source}/${r.flags}${colors.Reset}`;
	if (r.source[0] !== '^')
		throw new Error(
			`The regex provided (${crx}) doesn't begin with ${colors.FgGreen}'^'${colors.Reset}.`
		);

	return Parser.newStandard(r,
		(matchString) => matchString,
		from => `'${from.targetString.slice(from.index)}' does not match with the regex /${r.source}/${r.flags}.`
	);
};

export const spaces = reg(/^\s+/)
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with spaces`);
export const word = reg(/^\w+/)
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with a word`);
export const letters = reg(/^[A-Za-z]+/)
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with letters`);

export const digits = reg(/^\d+/)
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with digits`);
export const uint = digits.map(result => Number(result))
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with an unsigned int`);
export const sint = reg(/^[+-]?\d+/).map(result => Number(result))
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with a signed int`);
export const sfloat = reg(/^[+-]?\d*\.?\d+/).map(result => Number(result))
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with a signed float`);

export const newlines = reg(/^(\r?\n)+/)
.mapError(from => `'${from.targetString.slice(from.index)}' does not begin with newlines`);

export const succeed = <T>(value: T) => 
	Parser.void.map(() => value)