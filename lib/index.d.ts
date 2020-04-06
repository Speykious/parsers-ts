export declare const tuple: <T extends any[]>(...data: T) => T;
export { ParserState, ErrorMsgProvider } from './ParserState';
export { Parser, MatchTransformer, ParserStateTransformer } from './Parser';
export { between, choice, join, many, manyJoin, sequenceOf } from './ParserCombinators';
export { digits, uint, newlines, reg, spaces, str, word } from './ParserCreators';
