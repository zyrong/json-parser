# JsonParser  ![](https://badgen.net/npm/v/@zyrong/json-parser)  ![](https://badgen.net/badge/types/included/blue) ![](https://badgen.net/npm/dt/@zyrong/json-parser) ![](https://badgen.net/badge/language/typescript/blue)
将json字符串解析为 [Node](https://github.com/zyrong/json-parser#node%E5%AE%9A%E4%B9%89) Tree  
<br/>

## example
```js
import { parse } from '@zyrong/json-parser'

const json = `{
  "array": [
    "string", 123
  ]
}`
const visitor = parse(json)

console.log(visitor.body) // 根node

// 对应的Node Tree 如下:
{
  "key": null,
  "type": "object",
  "valueRange": {
    "end": 46,
    "start": 0
  },
  "parent": null,
  "properties": [
    {
      "type": "array",
      "key": "array",
      "keyRange": {
        "end": 12,
        "start": 7
      },
      "valueRange": {
        "end": 42,
        "start": 15
      },
      "parent": ["Circular"],
      "properties": [
        {
          "key": 0,
          "parent": ["Circular"],
          "type": "string",
          "value": "string",
          "valueRange": {
            "end": 30,
            "start": 24
          }
        },
        {
          "key": 1,
          "parent": ["Circular"],
          "type": "number",
          "value": "123",
          "valueRange": {
            "end": 36,
            "start": 33
          }
        }
      ]
    }
  ]
}



// 字符串索引路径访问node
console.log(visitor.get('array.0').value); // output: 'string'

// 访问不存在的node，返回undefined
console.log(visitor.get('xxx').value);     // output: undefined

// 返回根node
console.log(visitor.get() === visitor.body);  // output: true
```  
<br/>

## Node定义
```ts
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


```  
<br/>

## 错误json提示
```js
import { parse } from '@zyrong/json-parser'

const json = `{"key":"value",}`  // 多了一个尾部逗号
const visitor = parse(json) // 抛出异常
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
const selectedString = packageJson.slice(range.start, range.end) // ts-node
// -------------------


import jsonParse from '@zyrong/json-parser'
const visitor = parse(packageJson)
const node = visitor.get('dependencies')
const depRange = node.valueRange
if(range.start >= depRange.start && range.end <= depRange.end){
  console.log(selectedString+'在dependencies的范围内')
}else{
  console.log(selectedString+'不在dependencies的范围内')
}
```
> 对应项目地址: https://github.com/zyrong/vscode-node-modules
