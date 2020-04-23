import { str, spaces } from '../src/ParserCreators'
import { stateContextual } from '../src/ParserCombinators'
import { ParserState } from '../src'

const greatParser = stateContextual<string, string | string[]>(function* () {
	const first: ParserState<string> = yield str('Hello')
	if (first.error) {
		return first.resultify('First nope.')
	}
	const second: ParserState<string> = yield spaces
	if (second.error) {
		return second.resultify('Second nope.')
	}
	const third: ParserState<string> = yield str('World!')
	return third.resultify([first.result, second.result, third.result])
})

test('The Great State-Contextual Parser', () => {
	const state1 = greatParser.run('Hell')
	const state2 = greatParser.run('Hello')
	const state3 = greatParser.run('Hello   ')
	const state4 = greatParser.run('Hello World')
	const state5 = greatParser.run('Hello World!')
	
	console.log(state1, state2, state3, state4, state5)
})