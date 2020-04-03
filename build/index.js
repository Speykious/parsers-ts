"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParserState_1 = require("./ParserState");
const Parser_1 = require("./Parser");
const Combinators = require("./ParserCombinators");
const Creators = require("./ParserCreators");
exports.ParserTS = {
    Creators,
    Combinators,
    Parser: Parser_1.Parser,
    ParserState: ParserState_1.ParserState
};
//# sourceMappingURL=index.js.map