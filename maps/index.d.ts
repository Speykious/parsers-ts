import { ParserState } from './ParserState';
import { Parser } from './Parser';
import * as Combinators from './ParserCombinators';
import * as Creators from './ParserCreators';
export declare const ParserTS: {
    Creators: typeof Creators;
    Combinators: typeof Combinators;
    Parser: typeof Parser;
    ParserState: typeof ParserState;
};
