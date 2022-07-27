import { parse, isSimpleNode } from '../src/index'

const json = `{
  "": "empty_key",
  "object": {
    "2": 123,
    "b": "123",
    "": {
      "c": 123
    },
    ".d": 123
  },
  "array": ["2"]
}`
const visitor = parse(json)
if (!visitor) {
  throw new Error('parse error')
}

it('visitor.get body', () => {
  const node = visitor.get()
  expect(node).toBe(visitor.body)
})

it('visitor.get empty_key', () => {
  const node = visitor.get("")
  if (isSimpleNode(node)) {
    expect(node.value).toBe("empty_key")
  }
})

it('visitor.get Nonexistent node', () => {
  const node = visitor.get('object.1')
  expect(node).toBe(undefined)
})

it('visitor.get StringPath base', () => {
  const node = visitor.get('object.b')
  if (isSimpleNode(node)) {
    expect(node.type).toBe('string')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get StringPath number', () => {
  const node = visitor.get('object.2')
  if (isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get StringPath emptyKey', () => {
  const node = visitor.get('object..c')
  if (isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get ArrayPath base', () => {
  let node = visitor.get(["object", "", "c"])
  if (isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get ArrayPath dotKey', () => {
  const node = visitor.get(["object", ".d"])
  if (isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get stringPath Array', () => {
  const node = visitor.get("array.0")
  if (isSimpleNode(node)) {
    expect(node.type).toBe('string')
    expect(node.value).toBe('2')
  } else {
    error()
  }
})




function error() {
  throw new Error('get Node Error')
}
