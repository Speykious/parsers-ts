"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParserCreators_1 = require("./ParserCreators");
const ParserCombinators_1 = require("./ParserCombinators");
// import { colors } from './colors';
const myChainParser = ParserCombinators_1.sequenceOf(ParserCombinators_1.between(ParserCreators_1.str('<'), ParserCreators_1.str('>'))(ParserCreators_1.word), ParserCreators_1.spaces)
    .map(result => result[0])
    .chain((result) => {
    switch (result) {
        case 'word': return ParserCreators_1.word;
        case 'number': return ParserCreators_1.digits.map(result => Number(result));
        // default: return Parser.void;
    }
});
const argsParser = ParserCombinators_1.manyJoin(myChainParser, ParserCombinators_1.sequenceOf(ParserCreators_1.str(','), ParserCombinators_1.many(ParserCreators_1.spaces)));
console.log(argsParser.run('<word> wAOw yay'));
console.log(argsParser.run('<number> 123456, <word> wAOw, <word> incredible, <word> yeet'));
//# sourceMappingURL=test.js.map