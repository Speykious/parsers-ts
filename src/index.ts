/** Workaround for Typescript that infers tuple types. */
export const tuple = <T extends any[]>(...data: T) => data;

export * from './ParserState';
export * from './Parser';
export * from './ParserCombinators';
export * from './ParserCreators';
