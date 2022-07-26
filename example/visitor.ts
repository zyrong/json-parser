import jsonParse, { isSimpleNode } from "../src/index";

const json = `{
  "a": {
    "": {
      "b": "123"
    },
    ".c": 123
  }
}`
const visitor = jsonParse(json)
if (visitor) {
  const node1 = visitor.get('a..b')

  if (isSimpleNode(node1)) {
    console.log(node1.type === 'string');
    console.log(node1.value === '123');
  }

  const node2 = visitor.get(['a','.c'])
  if (isSimpleNode(node2)) {
    console.log(node2.type === 'number');
    console.log(node2.value === '123');
  }
}


