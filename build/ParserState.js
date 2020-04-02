"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A class about structures used by the Parser class.
 */
class ParserState {
    /**
     * Creates a ParserState object.
     */
    constructor(targetString, index = 0, result = null, error = null) {
        this.targetString = targetString;
        this.index = index;
        this.result = result;
        this.error = error;
    }
    /**
     * Returns an update of the inputState without modifying the inputState.
     * @param inputState The ParserState to update.
     * @param index The index of parsing.
     * @param result The result of the parsing.
     */
    static update(inputState, index, result) {
        return new ParserState(inputState.targetString, index, result);
    }
    /**
     * Returns an update of the inputState with a new result.
     * @param inputState The ParserState to update.
     * @param result The new result of the parsing.
     */
    static resultify(inputState, result) {
        return new ParserState(inputState.targetString, inputState.index, result, inputState.error);
    }
    /**
     * Returns an update of the inputState with a new error message.
     * @param inputState The ParserState to update.
     * @param errorMsgProvider What provides the error message.
     */
    static errorify(inputState, errorMsgProvider) {
        return new ParserState(inputState.targetString, inputState.index, null, errorMsgProvider(inputState.targetString, inputState.index));
    }
}
exports.ParserState = ParserState;
//# sourceMappingURL=ParserState.js.map