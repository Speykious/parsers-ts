export interface ParserError {
	info: string
	[key: string]: any
}

/** Provides an error message using the target and eventually the index. */
export type ErrorMsgProvider =
	| (<T, R>(state?: ParserState<T, R>) => ParserError | string)
	| string
	| ParserError

/** A class about structures used by the Parser class. */
export class ParserState<TTarget, TResult> {
	public target: TTarget
	public index: number
	public result: TResult
	public error: ParserError

	/** Creates a ParserState object. */
	constructor(args: {
		target: TTarget 
		index?: number
		result?: TResult
		error?: ParserError
	}) {
		this.target = args.target
		this.index = args.index ? args.index : 0
		this.result = args.result
		this.error = args.error
	}

	/** Returns an update of the inputState without modifying the inputState.
	 * @param index The index of parsing.
	 * @param result The result of the parsing. */
	update<R>(index: number, result: R): ParserState<TTarget, R> {
		return new ParserState({
			target: this.target,
			index,
			result
		})
	}

	/** Returns an update of the inputState with a new result.
	 * @param result The new result of the parsing. */
	resultify<R>(result: R): ParserState<TTarget, R> {
		return new ParserState({
			target: this.target,
			index: this.index,
			result
		})
	}

	/** Returns an update of the inputState with a new ParserError.
	 * @param errorMsgProvider What provides the error message. */
	errorify<R>(errorMsgProvider: ErrorMsgProvider) {
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

		return new ParserState<TTarget, R>({
			target: this.target,
			index: this.index,
			error: parserError
		})
	}
}
