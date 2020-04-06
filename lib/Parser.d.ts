import { ParserState, ErrorMsgProvider } from './ParserState';
/** Transforms a ParserState into another ParserState. */
export declare type ParserStateTransformer<TIn, TOut> = (inputState: ParserState<TIn>) => ParserState<TOut>;
/**
 * Transforms a matched string into useful data.
 * The matched string is supposed to have all the properties
 * that you want it to have to transform it correctly.
 */
export declare type MatchTransformer<T> = (matchString: string) => T;
/**
 * Transforms a ParserState into another ParserState.
 * Used to interpret a string and convert it into more useful data.
 * Can be all kinds of interpretations!
 */
export declare class Parser<TOut> {
    transformer: ParserStateTransformer<any, TOut>;
    /**
     * Creates a Parser object.
     * @param transformer The ParserState transformer.
     */
    constructor(transformer: ParserStateTransformer<any, TOut>);
    static void: Parser<any>;
    /**
     * Runs a parser by initiating a ParserState with the
     * targetString and giving it as an input to the parser.
     * @param parser The parser to run.
     * @param targetString The target string to run the parser on.
     */
    run(targetString: string): ParserState<TOut>;
    /**
     * Creates a new parser that will transform the result of the previous parser.
     * @param fn The function that transforms the result.
     */
    map<T>(fn: (result: TOut) => T): Parser<T>;
    /**
     * Creates a new parser that will transform the error of the previous parser.
     * @param fn The function that transforms the result.
     */
    mapError(errorMsgProvider: ErrorMsgProvider): Parser<TOut>;
    /**
     * Chooses the next parser depending on the previous result.
     * @param fn The function that chooses the next parser.
     */
    chain<T>(fn: (result: TOut) => Parser<T>): Parser<TOut | T>;
    /**
     * Creates a standard regex parser.
     * @param regex The RegExp used to match the targetString.
     * @param matchTransformer The function that transforms the matchString into organized data.
     * @param errorMsgProvider The function that returns an error message eventually using the targetString, and maybe the index.
     */
    static newStandard<T>(regex: RegExp, matchTransformer: MatchTransformer<T>, errorMsgProvider: ErrorMsgProvider): Parser<T>;
}
export declare type ParserTuple<T> = {
    [K in keyof T]: Parser<T[K]>;
};
