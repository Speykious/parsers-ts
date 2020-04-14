import { ParserState, ErrorMsgProvider } from './ParserState';

/** Transforms a ParserState into another ParserState. */
export type ParserStateTransformer<TIn, TOut> = (inputState: ParserState<TIn>) => ParserState<TOut>;
/**
 * Transforms a matched string into useful data.
 * The matched string is supposed to have all the properties
 * that you want it to have to transform it correctly.
 */
export type MatchTransformer<T> = (matchString: string) => T;

/**
 * Transforms a ParserState into another ParserState.
 * Used to interpret a string and convert it into more useful data.
 * Can be all kinds of interpretations!
 */
export class Parser<TOut> {
	/**
	 * Creates a Parser object.
	 * @param transformer The ParserState transformer.
	 */
	constructor(public transformer: ParserStateTransformer<any, TOut>) {}

	static void = Parser.newStandard(/.*/,
		matchString => matchString,
		() => `Wait, the void parser returns an error? How is that possible?`
	)

	/**
	 * Runs a parser by initiating a ParserState with the
	 * targetString and giving it as an input to the parser.
	 * @param parser The parser to run.
	 * @param targetString The target string to run the parser on.
	 */
	run(targetString: string) {
		return this.transformer(new ParserState(targetString));
	}

	/**
	 * Creates a new parser that will transform the result of the previous parser.
	 * @param fn The function that transforms the result.
	 */
	map<T>(fn: (result: TOut) => T) {
		return new Parser<T>(inputState => {
			const nextState = this.transformer(inputState);

			if (nextState.error)	// Seems tautologous, but types have to match!
				return nextState.errorify(nextState.error);

			return nextState.resultify(fn(nextState.result));
		});
	}

	/**
	 * Creates a new parser that will transform the error of the previous parser.
	 * @param fn The function that transforms the result.
	 */
	mapError(errorMsgProvider: ErrorMsgProvider) {
		return new Parser<TOut>(inputState => {
			const nextState = this.transformer(inputState);

			if (nextState.error)
				return nextState.errorify(errorMsgProvider);

			return nextState;
		});
	}

	/**
	 * Creates a new parser that will filter the result of the previous parser.
	 * The error will remain the same as the previous one if it occured before passing through the filtering function, but it will be different if it passes through the filter.
	 * @param fn The function that filters the result.
	 */
	filter(fn: (result: TOut) => boolean, filteringEMP: ErrorMsgProvider) {
		return new Parser<TOut>(inputState => {
			const nextState = this.transformer(inputState);

			if (!fn(nextState.result))
				return nextState.errorify(filteringEMP);

			return nextState;
		})
	}

	/**
	 * Chooses the next parser depending on the previous result.
	 * @param fn The function that chooses the next parser.
	 */
	chain<T>(fn: (result: TOut) => Parser<T>) {
		return new Parser<TOut | T>((inputState) => {
			const nextState = this.transformer(inputState);

			if (nextState.error) return nextState;

			const nextParser = fn(nextState.result);
			if (nextParser) return nextParser.transformer(nextState);
			else
				return inputState.errorify(
						`chain: function was unable to provide the next parser at index ${inputState.index}`
				);
		});
	}

	/**
	 * Creates a standard regex parser.
	 * @param regex The RegExp used to match the targetString.
	 * @param matchTransformer The function that transforms the matchString into organized data.
	 * @param errorMsgProvider The function that returns an error message eventually using the targetString, and maybe the index.
	 */
	static newStandard<T>(
		regex: RegExp,
		matchTransformer: MatchTransformer<T>,
		errorMsgProvider: ErrorMsgProvider
	) {
		const standard = new Parser<T>((inputState) => {
			const { targetString, index, error } = inputState;
			if (error) return inputState; // Propagate the error

			// Handling unexpected end of input
			const slicedString = targetString.slice(index);
			if (slicedString.length === 0) {
				return inputState.errorify(`Unexpected end of input ("${targetString}").`);
			}

			// The real goal of all of this >_<
			const match = slicedString.match(regex);
			if (match)
				// Success... Or not success? Hmmmmmmm <_<
				return inputState.update(index + match[0].length, matchTransformer(match[0]));
			else return inputState.errorify(errorMsgProvider);
		});

		return standard;
	}
}

export type ParserTuple<T> = { [K in keyof T]: Parser<T[K]> };
