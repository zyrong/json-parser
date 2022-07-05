# json-parser

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
