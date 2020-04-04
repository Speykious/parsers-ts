import { Parser } from '../src/Parser';
import { str, word, spaces, digits } from '../src/ParserCreators';
import { sequenceOf, between, join, manyJoin } from '../src/ParserCombinators';
// import { colors } from './colors';

test('Parser Combinator: chain', () => {
  const myChainParser = sequenceOf([between(str('<'), str('>'))(word), spaces], 1)
    .map((result) => result[0] as string)
    .chain(
      (result): Parser<any> => {
        switch (result) {
          case 'word':
            return word.map((result) => ({ type: 'word', value: result }));
          case 'number':
            return digits.map((result) => ({ type: 'number', value: Number(result) }));
          // default: return Parser.void;
        }
      },
    );

  //const argsParser = manyJoin(myChainParser, sequenceOf([str(','), spaces], 1));
  const sep = sequenceOf([str(','), spaces], 1);
  const argsParser = manyJoin(myChainParser, sep, 5);

  const runstate1 = myChainParser.run('<word>wAOw yay');
  const runstate2 = argsParser.run('<number> 123456, <word>wAOw,<word>    incredible, <word> yeet yeet');

  expect(runstate1.error).toBe(null);
  expect(runstate2.error).not.toBe(null);
});