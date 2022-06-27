import { NodeType } from "./node";

class Visitor {
  constructor(public body: NodeType) { }

  get(keystring: string): NodeType | undefined {
    const keyPath = keystring.trim().split('.')
    return keyPath.reduce<NodeType | undefined>((node, key) => {
      if(!node || key === ''){
        return node
      }else if (node.type === 'object' || node.type === 'array') {
        return node.properties[key]
      } else {
        return undefined
      }
    }, this.body)
  }
}

export default Visitor