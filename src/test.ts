import { Parser } from './Parser';
import { str, word, spaces, digits } from './ParserCreators';
import { sequenceOf, many, manyJoin, between } from './ParserCombinators';
// import { colors } from './colors';

const myChainParser = sequenceOf(between(str('<'), str('>'))(word), spaces)
	.map(result => result[0] as string)
	.chain((result): Parser<string|number> => {
		switch (result) {
			case 'word': return word;
			case 'number': return digits.map(result => Number(result));
			// default: return Parser.void;
		}
	})

const argsParser = manyJoin(myChainParser, sequenceOf(str(','), many(spaces)));

console.log(myChainParser.run('<word>wAOw yay'));
console.log(argsParser.run('<number> 123456, <word> wAOw, <word> incredible, <word> yeet, 0xf1g4b9fst4g9fs'));