import { ComplexNode, NodeType, SimpleNode } from "./node";

const ComplexType = ['array', 'object']
const SimpleType = ['string', 'number', 'boolean', 'null']

class Visitor {
  constructor(public body: NodeType) { }

  isComplexNode(node: any): node is ComplexNode {
    return node && ComplexType.includes(node.type)
  }

  isSimpleNode(node: any): node is SimpleNode {
    return node && SimpleType.includes(node.type)
  }

  get(keyPath: string | string[]): NodeType | undefined {
    const path = Array.isArray(keyPath) ? keyPath : keyPath.trim().split('.')

    if (path.length === 1 && path[0] === '') return this.body

    let node: NodeType | undefined = this.body
    for (let index = 0; index < path.length; index++) {
      if (!node) return undefined
      if (node.type === 'array') {
        node = node.properties[Number(path[index])]
      } else if (node.type === 'object') {
        node = node.properties.find(item => {
          return path[index] === item.key
        })
      } else {
        return undefined
      }
    }
    return node
  }
}

export default Visitor
