import {
	Parser,
	str,
	word,
	spaces,
	digits,
	sequenceOf,
	between,
	manyJoin,
	tuple
} from "../src/index"
// import { colors } from './colors';

test("Parser Combinator: chain", () => {
	const myChainParser = sequenceOf(
		tuple(between(str("<"), str(">"))(word), spaces),
		1
	)
		.map((result) => result[0] as string)
		.chain(
			(result): Parser<any> => {
				switch (result) {
					case "word":
						return word.map((respar) => ({ type: "word", value: respar }))
					case "number":
						return digits.map((respar) => ({
							type: "number",
							value: Number(respar)
						}))
					// default: return Parser.void;
				}
			}
		)

	// const argsParser = manyJoin(myChainParser, sequenceOf([str(','), spaces], 1));
	const sep = sequenceOf(tuple(str(","), spaces), 1)
	const argsParser = manyJoin(myChainParser, sep, 5)

	const runstate1 = myChainParser.run("<word>wAOw yay")
	const runstate2 = argsParser.run(
		"<number> 666942013, <word>wAOw,<word>    incredible, <word> yeet yeet"
	)

	expect(runstate1.error).toBe(undefined)
	expect(runstate2.error).not.toBe(undefined)
})
