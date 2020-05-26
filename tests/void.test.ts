import { Parser } from "../src/Parser"

test("Parser.void test", () => {
	const state = Parser.void.run('-*/0++ qfà-&"')

	expect(state.result).toBe('-*/0++ qfà-&"')
	expect(state.index).toBe(13)
	expect(state.error).toBe(null)
})
