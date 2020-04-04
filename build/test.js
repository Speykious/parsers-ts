"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParserCreators_1 = require("./ParserCreators");
const ParserCombinators_1 = require("./ParserCombinators");
// import { colors } from './colors';
const myChainParser = ParserCombinators_1.sequenceOf([ParserCombinators_1.between(ParserCreators_1.str('<'), ParserCreators_1.str('>'))(ParserCreators_1.word), ParserCreators_1.spaces], 1)
    .map(result => result[0])
    .chain((result) => {
    switch (result) {
        case 'word':
            return ParserCreators_1.word.map(result => ({ type: 'word', value: result }));
        case 'number':
            return ParserCreators_1.digits.map(result => ({ type: 'number', value: Number(result) }));
        // default: return Parser.void;
    }
});
//const argsParser = manyJoin(myChainParser, sequenceOf([str(','), spaces], 1));
const sep = ParserCombinators_1.sequenceOf([ParserCreators_1.str(','), ParserCreators_1.spaces], 1);
const argsParser = ParserCombinators_1.join([myChainParser, myChainParser, myChainParser, myChainParser, myChainParser], sep, 5);
console.log(myChainParser.run('<word>wAOw yay'));
console.log(argsParser.run('<number> 123456, <word>wAOw,<word>    incredible, <word> yeet yeet'));
//# sourceMappingURL=test.js.map