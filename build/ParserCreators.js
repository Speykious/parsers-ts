"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parsers_1 = require("./Parsers");
// import { ParserState } from './ParserState';
const colors_1 = require("./colors");
/**
 * Creates a parser that matches a string.
 * @param s The string to match when parsing.
 */
exports.str = (s) => Parsers_1.Parser.newStandard(new RegExp(`^${s}`), matchString => matchString, (targetString, index = 0) => `Tried to match "${s}", but got "${targetString.slice(index, s.length + index)}" instead.`);
/**
 * Creates a parser that matches a regex.
 * @param r The regex to match when parsing.
 */
exports.reg = (r) => {
    let crx = `${colors_1.colors.FgRed}/${r.source}/${r.flags}${colors_1.colors.Reset}`;
    if (r.source[0] != '^')
        throw new Error(`The regex provided (${crx}) doesn't begin with ${colors_1.colors.FgGreen}'^'${colors_1.colors.Reset}.`);
    return Parsers_1.Parser.newStandard(r, matchString => matchString, targetString => `'${targetString}' does not match with the regex /${r.source}/${r.flags}.`);
};
exports.spaces = exports.reg(/^\s+/);
exports.word = exports.reg(/^\w+/);
exports.digits = exports.reg(/^\d+/);
exports.newlines = exports.reg(/^(\r?\n)+/);
//# sourceMappingURL=ParserCreators.js.map