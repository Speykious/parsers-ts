import { sequenceOf, uint, letters, tuple } from "../src"

test("Testing types with sequenceOf", () => {
	const someParsers = tuple(uint, letters, uint)
	const someSequence = sequenceOf(someParsers)
	const target = "123yaaay321"
	const state1 = someSequence.run(target)

	expect(state1).toEqual({
		targetString: target,
		index: target.length,
		result: [123, "yaaay", 321],
		error: null
	})
})
