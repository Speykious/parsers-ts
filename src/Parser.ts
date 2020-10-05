import { ParserState, ErrorMsgProvider } from "./ParserState"

/** Transforms a ParserState into another ParserState. */
export type ParserStateTransformer<TIn, TOut> = (
	inputState: ParserState<TIn, any>
) => ParserState<TIn, TOut>
/** Transforms a matched string into useful data.
 * The matched string is supposed to have all the properties
 * that you want it to have to transform it correctly. */
export type MatchTransformer<T> = (matchString: string) => T

/** Transforms a ParserState into another ParserState.
 * Used to interpret a string and convert it into more useful data.
 * Can be all kinds of interpretations! */
export class Parser<TIn, TOut> {
	/** Creates a Parser object.
	 * @param transformer The ParserState transformer. */
	constructor(public transformer: ParserStateTransformer<TIn, TOut>) {}

	static void = Parser.newStandard(
		/.*/,
		(matchString) => matchString,
		`Wait, the void parser returns an error? How is that possible?`
	)

	static nothing = new Parser((state) => state)

	/** Runs a parser by initiating a ParserState with the
	 * target and giving it as an input to the parser.
	 * @param target The target string to run the parser on. */
	run(target: TIn) {
		return this.transformer(new ParserState({ target }))
	}

	/** Creates a new parser that will transform the result of the previous parser.
	 * @param fn The function that transforms the result. */
	map<T>(fn: (result: TOut) => T) {
		return new Parser<TIn, T>((inputState) => {
			const nextState = this.transformer(inputState)

			if (nextState.error)
				// Seems tautologous, but types have to match!
				return nextState.errorify(nextState.error)

			return nextState.resultify(fn(nextState.result))
		})
	}

	/** Creates a new parser that will transform the error of the previous parser.
	 * @param errorMsgProvider What provides the error message. */
	mapError(errorMsgProvider: ErrorMsgProvider) {
		return new Parser<TIn, TOut>((inputState) => {
			const nextState = this.transformer(inputState)

			if (nextState.error) return nextState.errorify(errorMsgProvider)

			return nextState
		})
	}

	/** Creates a new parser that will filter the result of the previous parser.
	 * The error will remain the same as the previous one if it occured before passing through the filtering function, but it will be different if it passes through the filter.
	 * @param fn The function that filters the result.
	 * @param filteringEMP What provides the error message if the filter returns false. */
	filter(fn: (result: TOut) => boolean, filteringEMP: ErrorMsgProvider) {
		return new Parser<TIn, TOut>((inputState) => {
			const nextState = this.transformer(inputState)
			if (nextState.error) return nextState;

			if (!fn(nextState.result))
				return nextState
					.update(inputState.index, undefined)
					.errorify(filteringEMP)

			return nextState
		})
	}

	/** Chooses the next parser depending on the previous result.
	 * @param fn The function that chooses the next parser. */
	chain<T>(fn: (result: TOut) => Parser<TIn, T>) {
		return new Parser<TIn, T>((inputState) => {
			const nextState = this.transformer(inputState)

			if (nextState.error) return nextState.errorify(nextState.error)

			const nextParser = fn(nextState.result)
			if (nextParser) return nextParser.transformer(nextState)
			else
				return inputState.errorify({
					info: `unable to provide the next parser`,
					combinator: "chain",
					result: nextState.result,
					index: inputState.index
				})
		})
	}

	/** Creates a standard regex parser.
	 * @param regex The RegExp used to match the target.
	 * @param matchTransformer The function that transforms the matchString into organized data.
	 * @param errorMsgProvider The function that returns an error message eventually using the target, and maybe the index. */
	static newStandard<R>(
		regex: RegExp,
		matchTransformer: MatchTransformer<R>,
		errorMsgProvider: ErrorMsgProvider
	) {
		const standard = new Parser<string, R>((inputState) => {
			const { target, index, error } = inputState
			if (error) return inputState // Propagate the error

			// Handling unexpected end of input
			const slicedString = target.slice(index)
			if (slicedString.length === 0) {
				return inputState.errorify({
					info: `Unexpected end of input.`,
					target
				})
			}

			// The real goal of all of this >_<
			const match = slicedString.match(regex)
			if (match)
				// Success... Or not success? Hmmmmmmm <_<
				return inputState.update(
					index + match[0].length,
					matchTransformer(match[0])
				)
			else return inputState.errorify(errorMsgProvider)
		})

		return standard
	}
}

/** An array of different generic parsers. */
export type ParserTuple<TIn, T extends any[]> = { [K in keyof T]: Parser<TIn, T[K]> }
