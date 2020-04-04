"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const ParserState_1 = require("./ParserState");
/**
 * Runs a sequence of parsers in order.
 * Will return an error if the minimum amount of parsers didn't succeed.
 * @param parsers The parsers to run.
 * @param min The minimum amount of parsers to succeed. Put -1 for all of them, but it is also the default value.
 */
exports.sequenceOf = (parsers, min = -1) => new Parser_1.Parser(inputState => {
    if (inputState.error)
        return inputState;
    const results = [];
    let nextState = inputState;
    let finalError = null;
    let psucceed = 0, lastIndex = 0;
    for (let parser of parsers) {
        nextState = parser.transformer(nextState);
        if (nextState.error) { // Catch errors
            psucceed--;
            finalError = nextState.error;
        }
        else
            lastIndex = nextState.index;
        results.push(nextState.result);
        psucceed++;
    }
    if (finalError && (psucceed < min || min === -1))
        return ParserState_1.ParserState.errorify(nextState, () => finalError);
    else
        return { ...nextState, index: lastIndex, result: results, error: null };
});
/**
 * Runs the first parser that is successful.
 * @param parsers The parsers to run.
 */
exports.choice = (...parsers) => new Parser_1.Parser(inputState => {
    if (inputState.error)
        return inputState;
    for (let parser of parsers) {
        const nextState = parser.transformer(inputState);
        if (!nextState.error)
            return nextState;
    }
    return ParserState_1.ParserState.errorify(inputState, (targetString, index) => `choice: unable to match with any parser at index ${index}`);
});
/**
 * Runs the parser as many times as possible.
 * @param parser The parsers to run.
 * @param min The minimum amount of times to run the parser for it to be successful.
 */
exports.many = (parser, min = 0) => new Parser_1.Parser(inputState => {
    if (inputState.error)
        return inputState;
    const results = [];
    let nextState = inputState;
    let done = false;
    while (!done) {
        nextState = parser.transformer(nextState);
        if (nextState.error)
            done = true;
        else
            results.push(nextState.result);
    }
    if (results.length < min) {
        return ParserState_1.ParserState.errorify(inputState, (targetString, index) => `many: Unable to match at least ${min} input(s) at index ${index}, matched ${results.length} instead`);
    }
    return new ParserState_1.ParserState(nextState.targetString, nextState.index, results, null);
});
// 
exports.between = (left, right) => (content) => exports.sequenceOf([left, content, right])
    .map(results => results[1]);
/**
 * Runs a sequence of parsers interconnected by a same parser.
 * @param parsers The parsers to run.
 * @param joiner The parser interconnecting the other parsers together.
 * @param min The minimum amount of parsers to be successful (joiners excluded). Enter -1 for all of them, although it is already the default value.
 * @param joinResults Whether to include the results of the joiner parsers in the final array of results or not, false by default.
 */
exports.join = (parsers, joiner, min = -1, joinResults = false) => {
    let joinedParsers = [];
    let starts = true;
    for (let parser of parsers) {
        if (starts)
            starts = false;
        else if (joinResults) {
            joinedParsers.push(joiner);
        }
        else {
            parser = exports.sequenceOf([joiner, parser])
                .map(result => result[1]);
        }
        joinedParsers.push(parser);
    }
    return exports.sequenceOf(joinedParsers, min);
};
/**
 * Runs a parser as many times as possible, interconnected by a same other parser.
 * @param parser The parser to run.
 * @param joiner The parser interconnecting the other parser together.
 */
exports.manyJoin = (parser, joiner, min = 0, joinResults = false) => {
    return new Parser_1.Parser(inputState => {
        if (inputState.error)
            return inputState;
        const results = [];
        let nextState = inputState;
        let done = false;
        let starts = true;
        let np = 0;
        while (!done) {
            if (starts)
                starts = false;
            else {
                nextState = joiner.transformer(nextState);
                if (nextState.error)
                    done = true;
                else if (joinResults)
                    results.push(nextState.result);
            }
            nextState = parser.transformer(nextState);
            if (nextState.error)
                done = true;
            else {
                results.push(nextState.result);
                np++;
            }
        }
        if (np < min) {
            return ParserState_1.ParserState.errorify(inputState, (targetString, index) => `many: Unable to match at least ${min} input(s) at index ${index}, matched ${results.length} instead`);
        }
        return new ParserState_1.ParserState(nextState.targetString, nextState.index, results, null);
    });
};
//# sourceMappingURL=ParserCombinators.js.map