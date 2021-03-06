import { ComplexNode, SimpleNode } from "./node"

interface CodeRange {
  start: number,
  end: number
}

function createRange(start = -1, end = -1): CodeRange {
  return {
    start,
    end
  }
}


function createError(): never
function createError(json: string, position: number): never
function createError(...args: any[]): never {
  if (args.length === 2) {
    const [json, position] = args as [string, number]
    const start = json.lastIndexOf('\n', position - 1) + 1
    let end = json.indexOf('\n', position)
    end = end !== -1 ? end : (json.length)
    console.error(`${json.slice(start, end)}\n${' '.repeat(position - start)}^`);
    throw new SyntaxError(`Unexpected token , in JSON at position ${position}`)
  } else {
    throw new SyntaxError(`Unexpected end of JSON input`)
  }
}

const ComplexType = ['array', 'object']
function isComplexNode(node: any): node is ComplexNode {
  return node && ComplexType.includes(node.type)
}

const SimpleType = ['string', 'number', 'boolean', 'null']
function isSimpleNode(node: any): node is SimpleNode {
  return node && SimpleType.includes(node.type)
}

export { CodeRange, createRange, createError, isComplexNode, isSimpleNode }
