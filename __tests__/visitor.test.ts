import jsonParse from '../src/index'

const json = `{
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
const visitor = jsonParse(json)
if (!visitor) {
  throw new Error('parse error')
}


it('visitor.get Nonexistent node', () => {
  const node = visitor.get('object.1')
  expect(node).toBe(undefined)
})

it('visitor.get StringPath base', () => {
  const node = visitor.get('object.b')
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('string')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get StringPath number', () => {
  const node = visitor.get('object.2')
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get StringPath emptyKey', () => {
  const node = visitor.get('object..c')
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get ArrayPath base', () => {
  let node = visitor.get(["object", "", "c"])
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get ArrayPath dotKey', () => {
  const node = visitor.get(["object", ".d"])
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('number')
    expect(node.value).toBe('123')
  } else {
    error()
  }
})

it('visitor.get stringPath Array', () => {
  const node = visitor.get("array.0")
  if (visitor.isSimpleNode(node)) {
    expect(node.type).toBe('string')
    expect(node.value).toBe('2')
  } else {
    error()
  }
})




function error() {
  throw new Error('get Node Error')
}
