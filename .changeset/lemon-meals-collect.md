---
'@zyrong/json-parser': minor
---

visitor get logic refactor
## Node Definition breaking change
- node.value.code   =>   node.value
- delete node.value.code
- node.value.range  =>   node.valueRange
- node.key.value    =>   node.key
- node.key.range    =>   node.keyRange
- node.properties change to pure array
