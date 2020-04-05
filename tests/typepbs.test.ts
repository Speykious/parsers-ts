import { sequenceOf, digits, word } from "../src"

test('Testing types with sequenceOf', () => {
	const someParsers = [digits, word, digits];
	const someSequence = sequenceOf(someParsers);
	const state1 = someSequence.run('123yaaay321');

	expect(state1.error).toBe(null);
	expect(state1.result).toEqual([123, 'yaaay', 321]);
})