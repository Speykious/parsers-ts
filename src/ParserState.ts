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
	public targetString: string
	public index: number
	public result: TResult
	public error: ParserError

	/** Creates a ParserState object. */
	constructor(args: {
		targetString: string
		index?: number
		result?: TResult
		error?: ParserError
	}) {
		this.targetString = args.targetString
		this.index = args.index ? args.index : 0
		this.result = args.result
		this.error = args.error
	}

	/** Returns an update of the inputState without modifying the inputState.
	 * @param index The index of parsing.
	 * @param result The result of the parsing. */
	update<T>(index: number, result: T): ParserState<T> {
		return new ParserState({
			targetString: this.targetString,
			index,
			result
		})
	}

	/** Returns an update of the inputState with a new result.
	 * @param result The new result of the parsing. */
	resultify<T>(result: T): ParserState<T> {
		return new ParserState({
			targetString: this.targetString,
			index: this.index,
			result
		})
	}

	/** Returns an update of the inputState with a new ParserError.
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

		return new ParserState<T>({
			targetString: this.targetString,
			index: this.index,
			error: parserError
		})
	}
}
