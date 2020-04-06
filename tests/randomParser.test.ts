import { Parser, tuple } from "../src";

const pad = (
	n: number | string,
	size: number,
	padder: string = '0'
): string => {
	n = n + '';
	while (n.length < size)
		n = padder + n;
	return n;
}

const getRandits = (length: number) =>
	pad(Math.floor(Math.random() * Math.pow(10, length)), length);

const randomDigits = (length: number = 6) => {
	if (length <= 0)
		throw new Error(`The length has to be greater than 0.`);
	
	const randits = getRandits(length);

	return new Parser(inputState => {
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
			return inputState.update(issl, tuple('Congratulations You finally got it right!', randits))
	})
}

