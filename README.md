# JsonParser
解析json字符串  
<br/>

## example
```js
import jsonParse from 'json-parser'

const json = `{
  "array": [
    "string", 123
  ]
}`
const visitor = jsonParse(json)

console.log(visitor.body) // 根node


// 字符串索引路径访问node
console.log(visitor.get('array.0').value.code); // output: 'string'

// 访问不存在的node，返回undefined
console.log(visitor.get('xxx').value.code);     // output: undefined

// 返回根node
console.log(visitor.get('') === visitor.body);  // output: true

```  
<br/>

## Node定义
```ts
type ObjectKey = {
  value: string,    // key对应的值
  range: CodeRange  // key在json中的范围
}
type NodeKey = ObjectKey | number

type NodeValue = {
  code: string,     // value对应的字符串值
  range: CodeRange, // value在json中的范围
}

type NodeType = ComplexNode | SimpleNode
interface ComplexNode {
  type: 'object' | 'array',   // node数据类型
  key: NodeKey | null,        // value对应的key
  value: NodeValue,           // key对应的value
  parent: ComplexNode | null, // parentNode。rootNode的parent为null
  properties: Array<NodeType> & Record<string, NodeType> // childNodes
}
interface SimpleNode {
  type: 'string' | 'number' | 'boolean' | 'null',
  key: NodeKey | null,
  value: NodeValue,
  parent: ComplexNode | null,
}

```  
<br/>

## 错误json提示
```js
import jsonParse from 'json-parser'

const json = `{"key":"value",}`  // 多了一个尾部逗号
const visitor = jsonParse(json) // 抛出异常
// output:
// {"key":"value",}
//               ^
// SyntaxError: Unexpected token , in JSON at position 14
```  
<br/>


## 使用场景
判断 当前选中的json是否在dependencies
```js
// ------- 已知条件 -------
// package.json字符串
const packageJson = `{
  "name":"xxx",
  "dependencies": {
    "@types/node": "^18.0.0",
    "microbundle": "^0.15.0",
    "ts-node": "^10.8.1"
  }
}`
// 鼠标选中的json范围.
const range = {
  start: 103,
  end: 109
}
const selectedString = packageJson.slice(range.start, range.end+1) // ts-node
// -------------------


import jsonParse from 'json-parser'
const visitor = jsonParse(packageJson)
const node = visitor.get('dependencies')
const depRange = node.value.range
if(range.start > depRange.start && range.end < depRange.end){
  console.log(selectedString+'在dependencies的范围内')
}else{
  console.log(selectedString+'不在dependencies的范围内')
}
```
> 对应项目地址: https://github.com/zyrong/vscode-node-modules
