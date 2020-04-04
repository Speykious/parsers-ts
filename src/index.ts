import { ParserState } from './ParserState';
import { Parser } from './Parser';
import * as Combinators from './ParserCombinators';
import * as Creators from './ParserCreators';

export const ParserTS = {
	Creators,
	Combinators,
	Parser,
	ParserState
};
