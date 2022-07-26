import { FixedLiteralValue } from "./parser";
import { ComplexNode } from "./node";
import { CodeRange, createRange } from "./util";


enum TokenTypes {
  CurlyBracket = 1,
  SquareBracket,
  Close,
  Comma,
  Colon,
  String,
  Number,
  FixedLiteral,
}
interface CurlyBracketToken {
  type: TokenTypes.CurlyBracket,
  range: CodeRange
}
interface SquareBracketToken {
  type: TokenTypes.SquareBracket,
  range: CodeRange
}
interface CloseToken {
  type: TokenTypes.Close,
  range: CodeRange,
  node: ComplexNode
}

interface FixedLiteralToken {
  type: TokenTypes.FixedLiteral,
  value: FixedLiteralValue,
  range: CodeRange
}
interface StringToken {
  type: TokenTypes.String,
  value: string,
  range: CodeRange,
}

interface NumberToken {
  type: TokenTypes.Number,
  value: string,
  range: CodeRange,
}


interface CommaToken {
  type: TokenTypes.Comma,
  range: CodeRange,
}
interface ColonToken {
  type: TokenTypes.Colon,
  range: CodeRange,
}

type Token = CurlyBracketToken | SquareBracketToken | CloseToken | StringToken | CommaToken | ColonToken | FixedLiteralToken | NumberToken;

namespace CreateToken_Args {
  export type All = Number | FixedLiteral | Colon | Comma | Close | String | Bracket

  export interface Close {
    type: TokenTypes.Close,
    range: CodeRange,
    node: ComplexNode
  };

  export interface String {
    type: TokenTypes.String,
    value: string,
    range: CodeRange
  };

  export interface Bracket {
    type: TokenTypes.SquareBracket | TokenTypes.CurlyBracket,
    start: number
  };

  export interface Colon {
    type: TokenTypes.Colon,
    start: number
  }

  export interface Comma {
    type: TokenTypes.Comma,
    start: number
  }

  export interface FixedLiteral {
    type: TokenTypes.FixedLiteral,
    range: CodeRange,
    value: FixedLiteralValue
  }

  export interface Number {
    type: TokenTypes.Number,
    range: CodeRange,
    value: string
  }
}
function createToken(args: CreateToken_Args.Close): CloseToken;
function createToken(args: CreateToken_Args.String): StringToken;
function createToken(args: CreateToken_Args.Bracket): SquareBracketToken;
function createToken(args: CreateToken_Args.Bracket): CurlyBracketToken;
function createToken(args: CreateToken_Args.Colon): ColonToken;
function createToken(args: CreateToken_Args.Comma): CommaToken;
function createToken(args: CreateToken_Args.FixedLiteral): FixedLiteralToken;
function createToken(args: CreateToken_Args.Number): NumberToken;
function createToken(args: CreateToken_Args.All): Token {
  switch (args.type) {
    case TokenTypes.CurlyBracket:
      return {
        type: TokenTypes.CurlyBracket,
        range: createRange(args.start),
      };

    case TokenTypes.SquareBracket:
      return {
        type: TokenTypes.SquareBracket,
        range: createRange(args.start)
      };

    case TokenTypes.String:
      return {
        type: TokenTypes.String,
        value: args.value,
        range: args.range,
      };

    case TokenTypes.Close:
      return {
        type: TokenTypes.Close,
        node: args.node,
        range: args.range
      };

    case TokenTypes.Comma:
      return {
        type: TokenTypes.Comma,
        range: createRange(args.start, args.start)
      };

    case TokenTypes.Colon:
      return {
        type: TokenTypes.Colon,
        range: createRange(args.start, args.start)
      };



    case TokenTypes.Number:
      return {
        type: TokenTypes.Number,
        value: args.value,
        range: args.range
      }

    case TokenTypes.FixedLiteral:
      return {
        type: TokenTypes.FixedLiteral,
        value: args.value,
        range: args.range
      }

    default:
      throw new Error('不存在对应的类型');
  }
}

export { createToken, TokenTypes, CurlyBracketToken, SquareBracketToken, CloseToken, FixedLiteralToken, StringToken, NumberToken, CommaToken, ColonToken, Token }
