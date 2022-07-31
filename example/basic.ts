import { parse, isSimpleNode } from "../src/index";

const json = `{
  "": "empty_key",
  "empty_string": "",
  "string": "string",
  "number": 0,
  "null": null,
  "false":false,
  "true": true,
  "array": [],
  "object": {},
  "deep": [
    {
      "empty_string": "",
      "string": "string",
      "number": 0,
      "null": null,
      "false":false,
      "true": true
    },
    [1,"2",null,false,true],
    1,"2",null,false,true
  ]
}`;

try {
  const startTime = Date.now()
  const visitor = parse(json);
  console.log('耗时:', Date.now() - startTime, '\n');

  if (visitor) {
    const node = visitor.get('deep.0.string')
    if (isSimpleNode(node)) {
      console.log(node.value);
    }
  }
} catch (error) {
  console.log(error);
}

