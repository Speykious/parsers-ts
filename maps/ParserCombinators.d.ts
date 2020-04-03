import { Parser } from './Parser';
/**
 * Runs a sequence of parsers in order.
 * @param parsers The parsers to run.
 */
export declare const sequenceOf: (...parsers: Parser<any>[]) => Parser<any>;
/**
 * Runs the first parser that is successful.
 * @param parsers The parsers to run.
 */
export declare const choice: (...parsers: Parser<any>[]) => Parser<any>;
/**
 * Runs the parser as many times as possible.
 * @param parser The parsers to run.
 */
export declare const many: (parser: Parser<any>, min?: number) => Parser<any>;
export declare const between: <TL, TR>(left: Parser<TL>, right: Parser<TR>) => <T>(content: Parser<T>) => Parser<T>;
/**
 * Runs a sequence of parsers interconnected by a same parser.
 * @param parsers The parsers to run.
 * @param joiner The parser interconnecting the other parsers together.
 */
export declare const join: (parsers: Parser<any>[], joiner: Parser<any>, joinResults?: boolean) => Parser<any>;
/**
 * Runs a parser as many times as possible, interconnected by a same other parser.
 * @param parser The parser to run.
 * @param joiner The parser interconnecting the other parser together.
 */
export declare const manyJoin: (parser: Parser<any>, joiner: Parser<any>, min?: number, joinResults?: boolean) => Parser<any>;
