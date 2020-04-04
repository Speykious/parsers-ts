import { Parser } from './Parser';
/**
 * Runs a sequence of parsers in order.
 * Will return an error if the minimum amount of parsers didn't succeed.
 * @param parsers The parsers to run.
 * @param min The minimum amount of parsers to succeed. Put -1 for all of them, but it is also the default value.
 */
export declare const sequenceOf: (parsers: Parser<any>[], min?: number) => Parser<any>;
/**
 * Runs the first parser that is successful.
 * @param parsers The parsers to run.
 */
export declare const choice: (...parsers: Parser<any>[]) => Parser<any>;
/**
 * Runs the parser as many times as possible.
 * @param parser The parsers to run.
 * @param min The minimum amount of times to run the parser for it to be successful.
 */
export declare const many: (parser: Parser<any>, min?: number) => Parser<any>;
export declare const between: <TL, TR>(left: Parser<TL>, right: Parser<TR>) => <T>(content: Parser<T>) => Parser<T>;
/**
 * Runs a sequence of parsers interconnected by a same parser.
 * @param parsers The parsers to run.
 * @param joiner The parser interconnecting the other parsers together.
 * @param min The minimum amount of parsers to be successful (joiners excluded). Enter -1 for all of them, although it is already the default value.
 * @param joinResults Whether to include the results of the joiner parsers in the final array of results or not, false by default.
 */
export declare const join: (parsers: Parser<any>[], joiner: Parser<any>, min?: number, joinResults?: boolean) => Parser<any>;
/**
 * Runs a parser as many times as possible, interconnected by a same other parser.
 * @param parser The parser to run.
 * @param joiner The parser interconnecting the other parser together.
 */
export declare const manyJoin: (parser: Parser<any>, joiner: Parser<any>, min?: number, joinResults?: boolean) => Parser<any>;
