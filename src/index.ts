/** Workaround for Typescript that infers tuple types. */
export const tuple = <T extends any[]>(...data: T) => data;

export {
	ParserState,
	ErrorMsgProvider,
	ParserError
} from './ParserState';

export {
	Parser,
	MatchTransformer,
	ParserStateTransformer,
	ParserTuple
} from './Parser';

export {
	between,
	choice,
	join,
	many,
	manyJoin,
	sequenceOf
} from './ParserCombinators';

export {
	str, reg,
	spaces, word, letters,
	digits, uint, sint, sfloat,
	newlines
} from './ParserCreators';
