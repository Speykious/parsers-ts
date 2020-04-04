import { Parser } from './Parser';
import { ParserState } from './ParserState';

/**
 * Runs a sequence of parsers in order.
 * Will return an error if the minimum amount of parsers didn't succeed.
 * @param parsers The parsers to run.
 * @param min The minimum amount of parsers to succeed. Put -1 for all of them, but it is also the default value.
 */
export const sequenceOf = (parsers: Parser<any>[], min = -1) =>
	new Parser(inputState => {
		if (inputState.error) return inputState;
		const results: undefined[] = [];

		let nextState = inputState;
		let finalError: string = null;
		let pi = 0, psucceed = 0;
		for (let parser of parsers) {
			nextState = parser.transformer(nextState);
			if (nextState.error) { // Catch errors
				psucceed--;
				finalError = nextState.error;
			}
			results.push(nextState.result);
			pi++; psucceed++;
		}
		
		if (finalError && (psucceed < min || min === -1))
			return ParserState.errorify(nextState, () =>
				`sequenceOf - parser n°${pi}: ${finalError}`
			);
		else return ParserState.resultify(nextState, results);
	});

/**
 * Runs the first parser that is successful.
 * @param parsers The parsers to run.
 */
export const choice = (...parsers: Parser<any>[]) =>
	new Parser(inputState => {
		if (inputState.error) return inputState;

		for (let parser of parsers) {
			const nextState = parser.transformer(inputState);
			if (!nextState.error)
				return nextState;
		}
	
		return ParserState.errorify(inputState,
			(targetString, index) => `choice: unable to match with any parser at index ${index}`)
	});

/**
 * Runs the parser as many times as possible.
 * @param parser The parsers to run.
 * @param min The minimum amount of times to run the parser for it to be successful.
 */
export const many = (parser: Parser<any>, min = 0) =>
new Parser(inputState => {
	if (inputState.error) return inputState;
	const results: undefined[] = [];

	let nextState = inputState;
	let done = false;
	while (!done) {
		nextState = parser.transformer(nextState);
		if (nextState.error) done = true;
		else results.push(nextState.result);
	}

	if (results.length < min) {
		return ParserState.errorify(inputState,
			(targetString, index) => `many: Unable to match at least ${min} input(s) at index ${index}, matched ${results.length} instead`);
	}
	
	return new ParserState(
		nextState.targetString,
		nextState.index,
		results, null);
});
// 
export const between = <TL, TR>(left: Parser<TL>, right: Parser<TR>) =>
	<T>(content: Parser<T>) =>
		sequenceOf([left, content, right])
		.map(results => results[1]) as Parser<T>;

/**
 * Runs a sequence of parsers interconnected by a same parser.
 * @param parsers The parsers to run.
 * @param joiner The parser interconnecting the other parsers together.
 */
export const join = (parsers: Parser<any>[], joiner: Parser<any>, joinResults = false) => {
	let joinedParsers = [];
	let starts = true;

	for (const parser of parsers) {
		if (starts) starts = false;
		else if (joinResults) joinedParsers.push(joiner);
		joinedParsers.push(parser);
	}
	return sequenceOf(joinedParsers);
}

/**
 * Runs a parser as many times as possible, interconnected by a same other parser.
 * @param parser The parser to run.
 * @param joiner The parser interconnecting the other parser together.
 */
export const manyJoin = (parser: Parser<any>, joiner: Parser<any>, min = 0, joinResults = false) => {
	return new Parser(inputState => {
		if (inputState.error) return inputState;
		const results: undefined[] = [];
	
		let nextState = inputState;
		let done = false;
		let starts = true;
		while (!done) {
			if (starts) starts = false;
			else {
				nextState = joiner.transformer(nextState);
				if (nextState.error) done = true;
				else if (joinResults) results.push(nextState.result);
			}
			nextState = parser.transformer(nextState);
			if (nextState.error) done = true;
			else results.push(nextState.result);
		}
	
		if (results.length < min) {
			return ParserState.errorify(inputState,
				(targetString, index) => `many: Unable to match at least ${min} input(s) at index ${index}, matched ${results.length} instead`);
		}
		
		return new ParserState(
			nextState.targetString,
			nextState.index,
			results, null);
	});
}