import { CodeRange } from './util'

type ObjectKey = {
  value: string, // key对应的值
  range: CodeRange // key在json中的范围
}
type NodeKey = ObjectKey | number

type NodeValue = {
  code: string, // value对应的字符串值
  range: CodeRange, // value在json中的范围
}

type NodeType = ComplexNode | SimpleNode
interface ComplexNode {
  type: 'object' | 'array', // node数据类型
  key: NodeKey | null, // value对应的key
  value: NodeValue, // key对应的value
  parent: ComplexNode | null, // parentNode。rootNode的parent为null
  properties: Array<NodeType> & Record<string, NodeType> // childNodes
}
interface SimpleNode {
  type: 'string' | 'number' | 'boolean' | 'null',
  key: NodeKey | null,
  value: NodeValue,
  parent: ComplexNode | null,
}


function createComplexNode(type: 'object' | 'array'): ComplexNode {
  return {
    type,
    key: null,
    value: {
      code: '',
      range: null
    },
    parent: null,
    properties: []
  } as unknown as ComplexNode
}

function createSimpleNode(type: 'string' | 'number' | 'boolean' | 'null'): SimpleNode {
  return {
    type,
    key: null,
    value: {
      code: '',
      range: null
    },
    parent: null,
  } as unknown as SimpleNode
}

export {
  createComplexNode,
  createSimpleNode,
  ComplexNode,
  SimpleNode,
  NodeType,
  ObjectKey
}