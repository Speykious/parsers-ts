"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParserState_1 = require("./ParserState");
/**
 * Transforms a ParserState into another ParserState.
 * Used to interpret a string and convert it into more useful data.
 * Can be all kinds of interpretations!
 */
class Parser {
    /**
     * Creates a Parser object.
     * @param transformer The ParserState transformer.
     */
    constructor(transformer) {
        this.transformer = transformer;
    }
    /**
     * Runs a parser by initiating a ParserState with the
     * targetString and giving it as an input to the parser.
     * @param parser The parser to run.
     * @param targetString The target string to run the parser on.
     */
    run(targetString) {
        return this.transformer(new ParserState_1.ParserState(targetString));
    }
    /**
     * Creates a new parser that will transform the result of the previous parser.
     * @param fn The function that transforms the result.
     */
    map(fn) {
        return new Parser(inputState => {
            const nextState = this.transformer(inputState);
            if (nextState.error) // Seems tautologous, but types have to match!
                return nextState.errorify(nextState.error);
            return nextState.resultify(fn(nextState.result));
        });
    }
    /**
     * Creates a new parser that will transform the error of the previous parser.
     * @param fn The function that transforms the result.
     */
    mapError(errorMsgProvider) {
        return new Parser(inputState => {
            const nextState = this.transformer(inputState);
            if (nextState.error)
                return nextState.errorify(errorMsgProvider);
            return nextState;
        });
    }
    /**
     * Creates a new parser that will filter the result of the previous parser.
     * The error will remain the same as the previous one if it occured before passing through the filtering function, but it will be different if it passes through the filter.
     * @param fn The function that filters the result.
     */
    filter(fn, filteringEMP) {
        return new Parser(inputState => {
            const nextState = this.transformer(inputState);
            if (!fn(nextState.result))
                return nextState.errorify(filteringEMP);
            return nextState;
        });
    }
    /**
     * Chooses the next parser depending on the previous result.
     * @param fn The function that chooses the next parser.
     */
    chain(fn) {
        return new Parser((inputState) => {
            const nextState = this.transformer(inputState);
            if (nextState.error)
                return nextState;
            const nextParser = fn(nextState.result);
            if (nextParser)
                return nextParser.transformer(nextState);
            else
                return inputState.errorify(`chain: function was unable to provide the next parser at index ${inputState.index}`);
        });
    }
    /**
     * Creates a standard regex parser.
     * @param regex The RegExp used to match the targetString.
     * @param matchTransformer The function that transforms the matchString into organized data.
     * @param errorMsgProvider The function that returns an error message eventually using the targetString, and maybe the index.
     */
    static newStandard(regex, matchTransformer, errorMsgProvider) {
        const standard = new Parser((inputState) => {
            const { targetString, index, error } = inputState;
            if (error)
                return inputState; // Propagate the error
            // Handling unexpected end of input
            const slicedString = targetString.slice(index);
            if (slicedString.length === 0) {
                return inputState.errorify(`Unexpected end of input ("${inputState.targetString}").`);
            }
            // The real goal of all of this >_<
            const match = slicedString.match(regex);
            if (match)
                // Success... Or not success? Hmmmmmmm <_<
                return inputState.update(index + match[0].length, matchTransformer(match[0]));
            else
                return inputState.errorify(errorMsgProvider);
        });
        return standard;
    }
}
exports.Parser = Parser;
Parser.void = new Parser((state) => state);
//# sourceMappingURL=Parser.js.map