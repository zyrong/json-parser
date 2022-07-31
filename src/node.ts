import { CodeRange } from './util'

type NodeKey = number | string | null

type NodeType = ComplexNode | SimpleNode
interface ComplexNode {
  type: 'object' | 'array',   // node数据类型
  key: NodeKey,               // key对应的值
  keyRange: CodeRange | null, // key在json中的范围
  valueRange: CodeRange,      // value对应的范围
  parent: ComplexNode | null, // parentNode。rootNode的parent为null
  properties: Array<NodeType> // childNodes
}
interface SimpleNode {
  type: 'string' | 'number' | 'boolean' | 'null',
  key: NodeKey,               // key对应的值
  keyRange: CodeRange | null, // key在json中的范围
  value: string,              // value对应的字符串值
  valueRange: CodeRange,      // value在json中的范围
  parent: ComplexNode | null,
}


function createComplexNode(type: 'object' | 'array'): ComplexNode {
  return {
    type,
    key: null,
    keyRange: null,
    // @ts-ignore
    valueRange: undefined,
    parent: null,
    properties: []
  }
}

function createSimpleNode(type: 'string' | 'number' | 'boolean' | 'null', value: string, valueRange: CodeRange): SimpleNode {
  return {
    type,
    key: null,
    keyRange: null,
    value,
    valueRange,
    parent: null,
  }
}

export {
  createComplexNode,
  createSimpleNode,
  ComplexNode,
  SimpleNode,
  NodeType,
  NodeKey
}
