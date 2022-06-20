const NodeInfo = Symbol('NodeInfo');

type NodeTemplate<Type, R = {}> = {
  [NodeInfo]: {
    type: Type,
    range: {
      start: number,
      end: number
    },
    code: string,
  } & R,
  [key: string]: ValueNode
};
type KeyNode = NodeTemplate<'key', {
  parent: ValueNode
}>;
type ValueNode = NodeTemplate<'value', {
  key: KeyNode | number,
  parent: ValueNode | null
}>;
type Nodes = KeyNode | ValueNode;

function createKeyNode(parent: ValueNode): KeyNode {
  return {
    [NodeInfo]: {
      type: 'key',
      range: {
        start: -1,
        end: -1
      },
      code: '',
      parent
    }
  };
}

function createValueNode(): ValueNode {
  return {
    [NodeInfo]: {
      type: 'value',
      range: {
        start: -1,
        end: -1
      },
      code: '',
      parent: null,
      key: null
    }
  } as any;
}




enum FrameTypes {
  CurlyBracket = 1,
  Key,
  SquareBracket,
  Close,
  Comma,
  Colon
}
interface CurlyBracketFrame {
  type: FrameTypes.CurlyBracket,
  // key: KeyFrame | null
  range: {
    start: number,
    end: number
  },
  node: ValueNode
}
interface KeyFrame {
  type: FrameTypes.Key,
  value: string,
  node: KeyNode
}
interface SquareBracketFrame {
  type: FrameTypes.SquareBracket,
  index: number,
  range: {
    start: number,
    end: number
  },
  node: ValueNode
}
interface CloseFrame {
  type: FrameTypes.Close,
  startFrame: CurlyBracketFrame | SquareBracketFrame
}
interface CommaFrame {
  type: FrameTypes.Comma
}
interface ColonFrame {
  type: FrameTypes.Colon
}

type StackFrame = CurlyBracketFrame | KeyFrame | SquareBracketFrame | CloseFrame | CommaFrame | ColonFrame;

namespace CreateStackFrame_Args {
  export interface Close {
    type: FrameTypes.Close,
    startFrame: CurlyBracketFrame | SquareBracketFrame
  };

  export interface Key {
    type: FrameTypes.Key,
    value: string,
    parent: ValueNode
  };

  export interface Bracket {
    type: FrameTypes.SquareBracket | FrameTypes.CurlyBracket,
    current: number
  };

  export interface Colon {
    type: FrameTypes.Colon
  }

  export interface Comma {
    type: FrameTypes.Comma
  }
}
function createStackFrame(args: CreateStackFrame_Args.Close): CloseFrame;
function createStackFrame(args: CreateStackFrame_Args.Key): KeyFrame;
function createStackFrame(args: CreateStackFrame_Args.Bracket): SquareBracketFrame;
function createStackFrame(args: CreateStackFrame_Args.Bracket): CurlyBracketFrame;
function createStackFrame(args: CreateStackFrame_Args.Colon): ColonFrame;
function createStackFrame(args: CreateStackFrame_Args.Comma): CommaFrame;
function createStackFrame(args: CreateStackFrame_Args.Colon | CreateStackFrame_Args.Comma | CreateStackFrame_Args.Close | CreateStackFrame_Args.Key | CreateStackFrame_Args.Bracket): any {
  switch (args.type) {
    case FrameTypes.CurlyBracket:
      return {
        type: FrameTypes.CurlyBracket,
        range: { start: args.current, end: -1 },
        node: createValueNode()
      };

    case FrameTypes.SquareBracket:
      return {
        type: FrameTypes.SquareBracket,
        index: 0,
        range: {
          start: args.current,
          end: -1
        },
        node: createValueNode()
      };

    case FrameTypes.Key:
      return {
        type: FrameTypes.Key,
        value: args.value,
        node: createKeyNode(args.parent)
      };

    case FrameTypes.Close:
      return {
        type: FrameTypes.Close,
        startFrame: args.startFrame
      };

    case FrameTypes.Comma:
      return {
        type: FrameTypes.Comma,
      };

    case FrameTypes.Colon:
      return {
        type: FrameTypes.Colon,
      };

    default:
      throw new Error('不存在对应的类型');
  }
}

function getParentBracketIndex(stack: StackFrame[]) {
  let i = stack.length - 1;
  while (i >= 0) {
    const frame = stack[i--];
    if (frame.type === FrameTypes.CurlyBracket || frame.type === FrameTypes.SquareBracket) {
      return i;
    }
  }
  return -1;
}


type linkParent_Key_Args = { type: FrameTypes.Key, frame: KeyFrame, node: ValueNode };
type linkParent_SquareBracket_Args = { type: FrameTypes.SquareBracket, frame: SquareBracketFrame, node: ValueNode };
function linkParent(args: linkParent_Key_Args): void;
function linkParent(args: linkParent_SquareBracket_Args): void;
function linkParent(args: linkParent_Key_Args | linkParent_SquareBracket_Args) {
  if (args.type === FrameTypes.Key) {
    const { frame, node } = args;
    const keyNode = frame.node;
    const keyInfo = keyNode[NodeInfo];
    const parentNode = keyInfo.parent;
    parentNode[frame.value] = node;
    const info = node[NodeInfo];
    info.parent = parentNode;
    info.key = keyNode;
  } else if (args.type === FrameTypes.SquareBracket) {
    // as the value of the array
    const { frame, node } = args;
    const parentNode = frame.node;
    const idx = frame.index++;
    parentNode[idx] = node;
    const info = node[NodeInfo];
    info.parent = parentNode;
    info.key = idx;
  }
}

function findRecentBracket(stack: StackFrame[], type: FrameTypes.CurlyBracket | FrameTypes.SquareBracket) {
  let i = stack.length;
  while (i--) {
    if (stack[i].type === type) {
      return i;
    }
  }
  return -1;
}


function closeBracket(type: FrameTypes.SquareBracket | FrameTypes.CurlyBracket, stack: StackFrame[], json: string, current: number) {
  const idx = findRecentBracket(stack, type);
  if (idx === -1) {
    throw new Error('error');
  }
  const startFrame = stack[idx] as SquareBracketFrame | CurlyBracketFrame;
  const info = startFrame.node[NodeInfo];
  startFrame.range.end = current;
  info.range = startFrame.range;
  info.code = json.slice(info.range.start, info.range.end + 1);
  stack.splice(idx, stack.length - idx);
  // stack.push(createStackFrame({ type: FrameTypes.Close, startFrame }));
}



const WHITESPACE = /\s/;



function jsonParser(json: string) {
  let root = {};

  const stack: StackFrame[] = [];
  let current = 0;

  function fristPick() {
    return stack[stack.length - 1];
  }
  function getString() {
    let string = '';

    while (current < json.length) {
      const char = json[++current];
      if (char === '"' && json[current - 1] !== '\\') {
        break;
      }
      string += char;
    }

    if (current >= json.length) {
      throw new Error('json存在问题');
    }


    return string;
  }

  while (current < json.length) {
    let char = json[current];

    if (char === '{') {
      if (stack.length === 0) {
        // root {}
        const frame = createStackFrame({ type: FrameTypes.CurlyBracket, current });
        root = frame.node;
        stack.push(frame);
      } else {
        const stackTop = fristPick();
        const frame = createStackFrame({ type: FrameTypes.CurlyBracket, current });
        const node = frame.node;
        if (stackTop.type === FrameTypes.Key) {
          //  const this = {}; {"xxx":this}
          linkParent({ type: FrameTypes.Key, frame: stackTop, node: node });
        } else if (stackTop.type === FrameTypes.SquareBracket) {
          // const this = {}; [this]
          linkParent({ type: FrameTypes.SquareBracket, frame: stackTop, node: node });
        } else {
          throw new Error('error');
        }
        stack.push(frame);
      }
      current++;
      continue;
    }
    if (char === '}') {
      closeBracket(FrameTypes.CurlyBracket, stack, json, current);

      current++;
      continue;
    }

    if (char === '"') {
      const string = getString();
      const stackTop = fristPick();
      if (stackTop.type === FrameTypes.CurlyBracket) {
        // { "this": xxx }
        const frame = createStackFrame({ type: FrameTypes.Key, value: string, parent: stackTop.node });
        const node = frame.node;
        const info = node[NodeInfo];
        info.code = `"${string}"`;
        // 带引号的范围，如: "this"
        info.range.start = current - string.length - 1;
        info.range.end = current;

        stack.push(frame);
      } else {
        const node = createValueNode();

        if (stackTop.type === FrameTypes.Key) {
          // { "xxx": "this" }
          linkParent({ type: FrameTypes.Key, frame: stackTop, node });
        } else if (stackTop.type === FrameTypes.SquareBracket) {
          // ["this"]
          linkParent({ type: FrameTypes.SquareBracket, frame: stackTop, node });
        } else {
          throw new Error('error');
        }

        const info = node[NodeInfo];
        info.code = `"${string}"`;
        // 带引号的范围，如: "this"
        info.range.start = current - string.length - 1;
        info.range.end = current;
      }
      current++;
      continue;
    }

    if (char === '[') {
      const stackTop = fristPick();
      const node = createValueNode();
      const frame: SquareBracketFrame = {
        type: FrameTypes.SquareBracket,
        index: 0,
        range: {
          start: current,
          end: -1
        },
        node
      };
      if (stackTop.type === FrameTypes.Key) {
        // const this = []; { "xxx": this }
        linkParent({ type: FrameTypes.Key, frame: stackTop, node });
      } else if (stackTop.type === FrameTypes.SquareBracket) {
        // const this = []; [this]
        linkParent({ type: FrameTypes.SquareBracket, frame: stackTop, node });
      } else {
        throw new Error('error');
      }
      stack.push(frame);
      current++;
      continue;
    }
    if (char === ']') {
      closeBracket(FrameTypes.SquareBracket, stack, json, current);

      current++;
      continue;
    }

    if (char === ':') {
      const stackTop = fristPick();
      if (stackTop.type !== FrameTypes.Key) {
        throw new Error('error');
      }
      current++;
      continue;
    }

    if (char === ',') {
      let stackTop = fristPick();
      if (stackTop.type === FrameTypes.CurlyBracket || stackTop.type === FrameTypes.SquareBracket) {
        throw new Error('error');
      }
      while (stackTop = fristPick()) {
        if (stackTop.type === FrameTypes.CurlyBracket || stackTop.type === FrameTypes.SquareBracket) {
          break;
        }
        stack.pop();
      }
      if (!stackTop) {
        throw new Error('error');
      }

      current++;
      continue;
    }


    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
  }

  return root;
}




const json = `{
  "a": [],
  "b": {},
  "c": "",
  "deep": {
    "child": {}
  },
  "array": [
    ["111"],
    {
      "attr": "1"
    },
    "string"
  ],
  "complex_key_\\"}{][": ""
}
`;
console.log(json);

const obj = jsonParser(json);
console.log(obj);