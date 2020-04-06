import { Parser } from './Parser';
/**
 * Creates a parser that matches a string.
 * @param s The string to match when parsing.
 */
export declare const str: (s: string) => Parser<string>;
/**
 * Creates a parser that matches a regex.
 * @param r The regex to match when parsing.
 */
export declare const reg: (r: RegExp) => Parser<string>;
export declare const spaces: Parser<string>;
export declare const word: Parser<string>;
export declare const digits: Parser<string>;
export declare const uint: Parser<string | number>;
export declare const newlines: Parser<string>;
