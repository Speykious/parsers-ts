import { str, spaces } from '../src/ParserCreators'
import { stateContextual } from '../src/ParserCombinators'
import { ParserState } from '../src'

const greatParser = stateContextual<string, string | string[]>(function* () {
	const first: ParserState<string> = yield str('Hello')
	if (first.error) return first.resultify('First nope.')
	
	const second: ParserState<string> = yield spaces
	if (second.error) return second.resultify('Second nope.')
	
	const third: ParserState<string> = yield str('World!')
	if (third.error) return second.resultify('Third nope.')
	
	return third.resultify([first.result, second.result, third.result])
})

test('The Great State-Contextual Parser', () => {
	const state1 = greatParser.run('Hell')
	const state2 = greatParser.run('Hello')
	const state3 = greatParser.run('Hello   ')
	const state4 = greatParser.run('Hello World')
	const state5 = greatParser.run('Hello World!')

	expect(state1.result).toBe('First nope.')
	expect(state2.result).toBe('Second nope.')
	expect(state3.result).toBe('Third nope.')
	expect(state4.result).toBe('Third nope.')
	expect(state5.result).toEqual(['Hello', ' ', 'World!'])

	expect(state1.error).toBe(null)
	expect(state2.error).toBe(null)
	expect(state3.error).toBe(null)
	expect(state4.error).toBe(null)
	expect(state5.error).toBe(null)
})