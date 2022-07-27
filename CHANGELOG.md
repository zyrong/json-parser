# json-parser

## 0.4.0

### Minor Changes

- [`a2f5393c`](https://github.com/zyrong/json-parser/commit/a2f5393c87a4128baab615b4e2e7735f5894fd6e) Thanks [@zyrong](https://github.com/zyrong)! - parse default export change to Named export

## 0.3.0

### Minor Changes

- [#3](https://github.com/zyrong/json-parser/pull/3) [`c8e8081b`](https://github.com/zyrong/json-parser/commit/c8e8081b3d2f4556f9a129232dd739a62983d512) Thanks [@zyrong](https://github.com/zyrong)! - The coderange range is changed to end+1, Easier to use `string.slice(start, end)`
  visitor.isSimpleNode/isComplexNode change to export
  Fix the problem that the empty key node through visitor.get ('') cannot be obtained
  Change the original visitor.get("") to visitor.get() to obtain the visitor.body node

## 0.2.0

### Minor Changes

- [`29be165f`](https://github.com/zyrong/json-parser/commit/29be165fadd7c8e396fa7b412a2e0fea1a5e3047) Thanks [@zyrong](https://github.com/zyrong)! - visitor get logic refactor

### Node Definition breaking change

- node.value.code => node.value
- delete node.value.code
- node.value.range => node.valueRange
- node.key.value => node.key
- node.key.range => node.keyRange
- node.properties change to pure array

## 0.1.1

### Patch Changes

- fix package.json main entry path

## 0.1.0

### Minor Changes

- [`a7ded04`](https://github.com/zyrong/json-parser/commit/a7ded041af2370aae18eb3e75922f5b67201605f) Thanks [@zyrong](https://github.com/zyrong)! - complete json-parse featrue
