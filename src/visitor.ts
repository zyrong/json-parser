import { NodeType } from "./node";

class Visitor {
  constructor(public body: NodeType) { }

  get(keyPath?: string | string[]): NodeType | undefined {
    if (keyPath === undefined) return this.body

    const path = Array.isArray(keyPath) ? keyPath : keyPath.trim().split('.')

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
