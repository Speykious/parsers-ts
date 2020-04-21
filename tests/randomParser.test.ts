import { Parser, tuple, ParserState } from "../src";

const pad = (
	n: number | string,
	size: number,
	padder: string = '0'
): string => {
	n = n.toString();
	while (n.length < size)
		n = padder + n;
	return n;
}

const getRandits = (length: number) =>
	pad(Math.floor(Math.random() * Math.pow(10, length)), length);

const randomDigits = (length: number) => {
	if (length <= 0)
		throw new Error(`The length has to be greater than 0.`);
	
	const randits = getRandits(length);

	return new Parser<[string, string]>(inputState => {
		const issl = inputState.targetString.length;
		if (issl === 0)
			return inputState.errorify(`... You won't even attempt to guess?`);

		else if (issl < length)
			return inputState.errorify(`... Nope, you got the length too short!`);

		else if (issl > length)
			return inputState.errorify(`... Nope, you got the length too long!`);

		else if (inputState.targetString !== randits)
			return inputState.errorify(`... You got the length just right, but your guess is wrong!`);
		
		else
			return inputState.update(issl, tuple('Congratulations, you finally got it right!', randits))
	})
}

test('Random digits: null length', () => {
	let error: string = null;

	try {
		randomDigits(0).run('something');
	} catch (err) {
		error = err;
	}

	expect(/greater than 0/.test(error)).toBe(true);
})

test('Random digits: no guess', () => {
	const regnoguess = /attempt to guess/;
	for (let i = 2; i < 10; i++)
		expect(regnoguess.test(
			randomDigits(i).run('').error.info
		)).toBe(true);
})

test('Random digits: guess too short', () => {
	const regtooshort = /too short/;
	for (let i = 2; i < 10; i++)
		expect(regtooshort.test(
			randomDigits(i).run(getRandits(i-1)).error.info
		)).toBe(true);
})

test('Random digits: guess too long', () => {
	const regtoolong = /too long/;
	for (let i = 2; i < 10; i++)
		expect(regtoolong.test(
			randomDigits(i).run(getRandits(i+1)).error.info
		)).toBe(true);
})

test('Random digits: guess until correct', () => {
	const toGuess = randomDigits(2);
	const wrong = /but your guess is wrong/;
	let state: ParserState<[string, string]>;

	for (let i = 0; i < 100; i++) {
		state = toGuess.run(pad(i, 2))
		if (!state.result)
			expect(wrong.test(state.error.info)).toBe(true);
		else break;
	}

	console.log(state);
	expect(/finally got it right/.test(state.result[0])).toBe(true);
})
