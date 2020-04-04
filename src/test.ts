import { Parser } from './Parser';
import { str, word, spaces, digits } from './ParserCreators';
import { sequenceOf, many, manyJoin, between } from './ParserCombinators';
// import { colors } from './colors';

const myChainParser = sequenceOf([between(str('<'), str('>'))(word), spaces], 1)
	.map(result => result[0] as string)
	.chain((result): Parser<any> => {
		switch (result) {
			case 'word':
				return word.map(result => ({type: 'word', value: result}));
			case 'number':
				return digits.map(result => ({type: 'number', value: Number(result)}));
			// default: return Parser.void;
		}
	})

//const argsParser = manyJoin(myChainParser, sequenceOf([str(','), spaces], 1));
const sep = sequenceOf([str(','), spaces], 1);
const argsParser = manyJoin(myChainParser, sep);

console.log(myChainParser.run('<word>wAOw yay'));

console.log(argsParser.run(
	'<number> 123456, <word>wAOw,<word>    incredible, <word> yeet yeet'
));