import {TreeNodeState} from "./state";

export type TreeTransformer = (children: TreeNodeState[]) => TreeNodeState[];

export function skip(children: TreeNodeState[]): TreeNodeState[] {
  return children.slice();
}

export function reverse(children: TreeNodeState[]): TreeNodeState[] {
  const r = children.slice();
  r.reverse();
  return r;
}

export function insertFirst(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.unshift(TreeNodeState.create(false, null));
    }
    return children;
  };
}

export function insertLast(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.push(TreeNodeState.create(false, null));
    }
    return children;
  };
}

export function removeFirst(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.shift();
    }
    return children;
  };
}

export function removeLast(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.pop();
    }
    return children;
  };
}

export function moveFromEndToStart(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.unshift(children.pop()!);
    }
    return children;
  };
}

export function moveFromStartToEnd(n: number): TreeTransformer {
  return function(children: TreeNodeState[]): TreeNodeState[] {
    children = children.slice();
    for (let i = 0; i < n; i++) {
      children.push(children.shift()!);
    }
    return children;
  };
}
