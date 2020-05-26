export interface ParserError {
	info: string
	[key: string]: any
}

/** Provides an error message using the targetString and eventually the index. */
export type ErrorMsgProvider =
	| (<T>(state?: ParserState<T>) => ParserError | string)
	| string
	| ParserError

/** A class about structures used by the Parser class. */
export class ParserState<TResult> {
	/** Creates a ParserState object. */
	constructor(
		public targetString: string,
		public index: number = 0,
		public result: TResult = null,
		public error: ParserError = null
	) {}

	/** Returns an update of the inputState without modifying the inputState.
	 * @param inputState The ParserState to update.
	 * @param index The index of parsing.
	 * @param result The result of the parsing. */
	update<T>(index: number, result: T): ParserState<T> {
		return new ParserState(this.targetString, index, result)
	}

	/** Returns an update of the inputState with a new result.
	 * @param inputState The ParserState to update.
	 * @param result The new result of the parsing. */
	resultify<T>(result: T): ParserState<T> {
		return new ParserState(this.targetString, this.index, result)
	}

	/** Returns an update of the inputState with a new ParserError.
	 * @param inputState The ParserState to update.
	 * @param errorMsgProvider What provides the error message. */
	errorify<T>(errorMsgProvider: ErrorMsgProvider) {
		let parserError: ParserError
		switch (typeof errorMsgProvider) {
			case "string":
				parserError = { info: errorMsgProvider }
				break
			case "function":
				const res = errorMsgProvider(this)
				if (typeof res === "string") parserError = { info: res }
				else parserError = res
				break
			default:
				parserError = errorMsgProvider
				break
		}
		return new ParserState<T>(this.targetString, this.index, null, parserError)
	}
}
