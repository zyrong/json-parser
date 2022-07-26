import { createRange, createError, CodeRange } from './util'
import { NodeType, createComplexNode, createSimpleNode } from './node'
import { Token, TokenTypes, CloseToken, FixedLiteralToken, StringToken, NumberToken, SquareBracketToken, CurlyBracketToken, createToken } from './token';
import Visitor from './visitor'

function findRecentBracket(tokenStack: Token[], type: TokenTypes.CurlyBracket | TokenTypes.SquareBracket) {
  let i = tokenStack.length;
  while (i--) {
    if (tokenStack[i].type === type) {
      return i;
    }
  }
  return -1;
}

const valueTokenStrategy = {
  [TokenTypes.Close]: function (token: CloseToken) {
    return token.node
  },
  [TokenTypes.FixedLiteral]: function (token: FixedLiteralToken) {
    return createSimpleNode(token.value !== 'null' ? 'boolean' : 'null', token.value, token.range)
  },
  [TokenTypes.String]: function (token: StringToken) {
    return createSimpleNode('string', token.value, token.range)
  },
  [TokenTypes.Number]: function (token: NumberToken) {
    return createSimpleNode('number', token.value, token.range)
  }
} as { [key in TokenTypes]: (token: Token) => NodeType }

function closeBracket(type: TokenTypes.SquareBracket | TokenTypes.CurlyBracket, tokenStack: Token[], json: string, current: number) {
  const idx = findRecentBracket(tokenStack, type);
  if (idx === -1) {
    createError()
  }
  const startToken = tokenStack[idx] as SquareBracketToken | CurlyBracketToken;

  const complexNode = createComplexNode(type === TokenTypes.CurlyBracket ? 'object' : 'array')
  startToken.range.end = current
  complexNode.valueRange = startToken.range

  const betweenBracketsTokens = tokenStack.splice(idx, tokenStack.length - idx);

  if (type === TokenTypes.CurlyBracket) {
    const lastIdx = betweenBracketsTokens.length - 1
    let keyInfo!: {
      value: string,
      range: CodeRange
    }
    for (let i = 1; i <= lastIdx; i++) {
      const token = betweenBracketsTokens[i]
      switch (i % 4) {
        case 1:
          if (token.type === TokenTypes.String && i !== lastIdx) {
            keyInfo = {
              value: token.value,
              range: token.range
            }
          } else {
            createError(json, token.range.start)
          }
          break;
        case 2:
          if (token.type === TokenTypes.Colon && i !== lastIdx) {
          } else {
            createError(json, token.range.start)
          }
          break;
        case 3:
          if (valueTokenStrategy[token.type]) {
            const node: NodeType = valueTokenStrategy[token.type](token)
            node.key = keyInfo.value
            node.keyRange = keyInfo.range
            node.parent = complexNode
            complexNode.properties.push(node)
          } else {
            createError(json, token.range.start)
          }
          break;
        case 0:
          if (token.type === TokenTypes.Comma && i !== lastIdx) {
          } else {
            createError(json, token.range.start)
          }
          break;
        default:
          createError(json, token.range.start)
      }
    }
  } else if (type === TokenTypes.SquareBracket) {
    const lastIdx = betweenBracketsTokens.length - 1
    for (let i = 1; i <= lastIdx; i++) {
      const token = betweenBracketsTokens[i]
      switch (i % 2) {
        case 1:
          if (valueTokenStrategy[token.type]) {
            const node: NodeType = valueTokenStrategy[token.type](token)
            node.key = complexNode.properties.push(node) - 1
            node.parent = complexNode
          } else {
            createError(json, token.range.start)
          }
          break;
        case 0:
          if (token.type === TokenTypes.Comma && i !== lastIdx) {
          } else {
            createError(json, token.range.start)
          }
          break
        default:
          createError(json, token.range.start)
      }
    }
  }
  return createToken({ type: TokenTypes.Close, range: startToken.range, node: complexNode })
}


function getStringLiteral(json: string, current: number) {
  let string = '';

  while (current < json.length) {
    const char = json[++current];
    // TODO: 校验字符串中的/
    if (char === '"' && json[current - 1] !== '\\') {
      break;
    }
    string += char;
  }

  if (current >= json.length) {
    createError()
  }


  return string;
}


const fixedLiteralMap = {
  n: 'null',
  f: 'false',
  t: 'true'
} as const
type FixedLiteralMapType = typeof fixedLiteralMap
export type FixedLiteralValue = FixedLiteralMapType[keyof FixedLiteralMapType]
function getFixedLiteral(json: string, current: number, literal: FixedLiteralValue) {
  if (json.slice(current, current + literal.length) === literal) {
    return literal
  } else {
    createError(json, current)
  }
}





const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;

export default function parse(json: string): Visitor | null {
  json = json.trimEnd()
  let root: null | NodeType = null

  const tokens: Token[] = [];
  let current = 0;

  while (current < json.length) {
    let char = json[current];

    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }


    if (char === '{') {
      tokens.push(createToken({ type: TokenTypes.CurlyBracket, start: current }));
      current++;
      continue;
    }
    if (char === '}') {
      tokens.push(closeBracket(TokenTypes.CurlyBracket, tokens, json, current))
      current++;
      continue;
    }


    if (char === '[') {
      tokens.push(createToken({ type: TokenTypes.SquareBracket, start: current }));
      current++;
      continue;
    }
    if (char === ']') {
      tokens.push(closeBracket(TokenTypes.SquareBracket, tokens, json, current))
      current++;
      continue;
    }


    if (char === ':') {
      tokens.push(createToken({
        type: TokenTypes.Colon,
        start: current
      }))
      current++;
      continue;
    }
    if (char === ',') {
      tokens.push(createToken({
        type: TokenTypes.Comma,
        start: current
      }))
      current++;
      continue;
    }


    if (char === '"') {
      const string = getStringLiteral(json, current);
      // 不带引号的key范围
      const range = createRange(current + 1, current + string.length + 1)
      tokens.push(createToken({
        type: TokenTypes.String,
        range,
        value: string,
      }));
      current += (string.length + 2);
      continue;
    }

    if (fixedLiteralMap[char as keyof FixedLiteralMapType]) {
      const literal = fixedLiteralMap[char as keyof FixedLiteralMapType]
      const value = getFixedLiteral(json, current, literal)
      tokens.push(createToken({
        type: TokenTypes.FixedLiteral,
        range: createRange(current, current + literal.length),
        value
      }))
      current += literal.length
      continue
    }


    if (NUMBERS.test(char)) {
      let value = '';
      const start = current
      while (NUMBERS.test(char)) {
        value += char;
        char = json[++current];
      }
      tokens.push(createToken({
        type: TokenTypes.Number,
        range: {
          start,
          end: current - 1
        },
        value
      }))
      continue
    }


    createError(json, current)
  }

  if (tokens.length === 1) {
    const token = tokens[0]
    if ([TokenTypes.Close, TokenTypes.FixedLiteral, TokenTypes.Number, TokenTypes.String].includes(token.type)) {
      root = valueTokenStrategy[token.type](token)
    } else {
      createError(json, token.range.start)
    }
  } else if (tokens.length === 0) {
  } else {
    createError(json, tokens[1].range.start)
  }

  if (root) {
    return new Visitor(root)
  }
  return null
}





function getParentBracketIndex(tokenStack: Token[]) {
  let i = tokenStack.length - 1;
  while (i >= 0) {
    const token = tokenStack[i--];
    if (token.type === TokenTypes.CurlyBracket || token.type === TokenTypes.SquareBracket) {
      return i;
    }
  }
  return -1;
}

