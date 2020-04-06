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
    update<T>(index: number, result: T): ParserState<T>;
    /**
     * Returns an update of the inputState with a new result.
     * @param inputState The ParserState to update.
     * @param result The new result of the parsing.
     */
    resultify<T>(result: T): ParserState<T>;
    /**
     * Returns an update of the inputState with a new error message.
     * @param inputState The ParserState to update.
     * @param errorMsgProvider What provides the error message.
     */
    errorify<T>(errorMsgProvider: ErrorMsgProvider | string): ParserState<T>;
}
