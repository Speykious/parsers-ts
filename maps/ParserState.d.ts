/**
 * Provides an error message using the targetString and eventually the index.
 */
export declare type ErrorMsgProvider = (targetString: string, index?: number) => string;
/**
 * A class about structures used by the Parser class.
 */
export declare class ParserState<TResult> {
    targetString: string;
    index: number;
    result: TResult;
    error: string;
    /**
     * Creates a ParserState object.
     */
    constructor(targetString: string, index?: number, result?: TResult, error?: string);
    /**
     * Returns an update of the inputState without modifying the inputState.
     * @param inputState The ParserState to update.
     * @param index The index of parsing.
     * @param result The result of the parsing.
     */
    static update<T>(inputState: ParserState<T>, index: number, result: T): ParserState<T>;
    /**
     * Returns an update of the inputState with a new result.
     * @param inputState The ParserState to update.
     * @param result The new result of the parsing.
     */
    static resultify<TIn, TOut>(inputState: ParserState<TIn>, result: TOut): ParserState<TOut>;
    /**
     * Returns an update of the inputState with a new error message.
     * @param inputState The ParserState to update.
     * @param errorMsgProvider What provides the error message.
     */
    static errorify<T>(inputState: ParserState<T>, errorMsgProvider: ErrorMsgProvider): ParserState<T>;
}
