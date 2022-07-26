---
'@zyrong/json-parser': minor
---

The coderange range is changed to end+1, Easier to use `string.slice(start, end)`
visitor.isSimpleNode/isComplexNode change to export
Fix the problem that the empty key node through visitor.get ('') cannot be obtained
Change the original visitor.get("") to visitor.get() to obtain the visitor.body node