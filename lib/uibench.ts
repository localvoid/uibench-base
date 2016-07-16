import {AppState, HomeState, TableState, AnimState, TreeState} from "./state";
import {animAdvanceEach, switchTo, tableCreate, treeCreate, tableSortBy, tableFilterBy, tableActivateEach,
  treeTransform} from "./actions";
import {reverse, insertFirst, insertLast, removeFirst, removeLast, moveFromEndToStart,
  moveFromStartToEnd, snabbdomWorstCase} from "./tree_transformers";
import {specTest, scuTest, recyclingTest} from "./tests";

// performance.now() polyfill
// https://gist.github.com/paulirish/5438650
// prepare base perf object
if (typeof window.performance === "undefined") {
  window.performance = {};
}
if (!window.performance.now) {
  let nowOffset = Date.now();
  if (window.performance.timing && window.performance.timing.navigationStart) {
    nowOffset = window.performance.timing.navigationStart;
  }
  window.performance.now = function now() {
    return Date.now() - nowOffset;
  };
}

export class Group {
  name: string;
  from: AppState;
  to: AppState[];

  constructor(name: string, from: AppState, to: AppState[]) {
    this.name = name;
    this.from = from;
    this.to = to;
  }
}

export interface Config {
  tests: Group[] | null;
  iterations: number;
  name: string;
  version: string;
  report: boolean;
  mobile: boolean;
  disableSCU: boolean;
  enableDOMRecycling: boolean;
  filter: string | null;
}

export const config = {
  tests: null,
  iterations: 3,
  name: "unnamed",
  version: "0.0.0",
  report: false,
  mobile: false,
  disableSCU: false,
  enableDOMRecycling: false,
  filter: null,
} as Config;

function parseQueryString(a: string[]): { [key: string]: string } {
  if (a.length === 0) {
    return {};
  }
  const b = {} as { [key: string]: string };
  for (let i = 0; i < a.length; ++i) {
    const p = a[i].split("=", 2);
    if (p.length === 1) {
      b[p[0]] = "";
    } else {
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
  }
  return b;
}

function animate(from: AppState, nth: number, t: number): AppState[] {
  let c = from;
  const r = [] as AppState[];

  for (let i = 0; i < t; i++) {
    c = animAdvanceEach(c, nth);
    if (config.disableSCU) {
      c = c.clone();
    }
    r.push(c);
  }

  return r;
}

function dupe(state: AppState, n: number): AppState[] {
  if (config.disableSCU) {
    state = state.clone();
  }
  const r = [] as AppState[];
  while (n > 0) {
    r.push(state);
    n--;
  }
  return r;
}

export function init(name: string, version: string): Config {
  config.name = name;
  config.version = version;

  const qs = parseQueryString(window.location.search.substr(1).split("&"));
  if (qs["i"] !== undefined) {
    config.iterations = parseInt(qs["i"], 10);
  }
  if (qs["name"] !== undefined) {
    config.name = qs["name"];
  }
  if (qs["version"] !== undefined) {
    config.version = qs["version"];
  }
  if (qs["report"] !== undefined) {
    config.report = true;
  }
  if (qs["mobile"] !== undefined) {
    config.mobile = true;
  }
  if (qs["disableSCU"] !== undefined) {
    config.disableSCU = true;
  }
  if (qs["enableDOMRecycling"] !== undefined) {
    config.enableDOMRecycling = true;
  }
  if (qs["filter"] !== undefined) {
    config.filter = qs["filter"];
  }

  const initial = new AppState(
    "home",
    new HomeState(),
    TableState.create(0, 0),
    AnimState.create(config.mobile ? 30 : 100),
    TreeState.create([0])
  );
  let initialTable = switchTo(initial, "table");
  let initialAnim = switchTo(initial, "anim");
  let initialTree = switchTo(initial, "tree");

  if (config.disableSCU) {
    initialTable = initialTable.clone();
    initialAnim = initialAnim.clone();
    initialTree = initialTree.clone();
  }

  if (config.mobile) {
    let table30_4 = tableCreate(initialTable, 30, 4);
    let table15_4 = tableCreate(initialTable, 15, 4);
    let table30_2 = tableCreate(initialTable, 30, 2);
    let table15_2 = tableCreate(initialTable, 15, 2);

    let tree50   = treeCreate(initialTree, [50]);
    let tree5_10 = treeCreate(initialTree, [5, 10]);
    let tree10_5 = treeCreate(initialTree, [10, 5]);

    if (config.disableSCU) {
      table30_4 = table30_4.clone();
      table15_4 = table15_4.clone();
      table30_2 = table30_2.clone();
      table15_2 = table15_2.clone();

      tree50 = tree50.clone();
      tree5_10 = tree5_10.clone();
      tree10_5 = tree10_5.clone();
    }

    config.tests = [
      new Group("table/[30,4]/render", initialTable, dupe(table30_4, 2)),
      new Group("table/[15,4]/render", initialTable, dupe(table15_4, 2)),
      new Group("table/[30,2]/render", initialTable, dupe(table30_2, 2)),
      new Group("table/[15,2]/render", initialTable, dupe(table15_2, 2)),

      new Group("table/[30,4]/removeAll", table30_4, dupe(initialTable, 2)),
      new Group("table/[15,4]/removeAll", table15_4, dupe(initialTable, 2)),
      new Group("table/[30,2]/removeAll", table30_2, dupe(initialTable, 2)),
      new Group("table/[15,2]/removeAll", table15_2, dupe(initialTable, 2)),

      new Group("table/[30,4]/sort/0", table30_4, dupe(tableSortBy(table30_4, 0), 2)),
      new Group("table/[15,4]/sort/0", table15_4, dupe(tableSortBy(table15_4, 0), 2)),
      new Group("table/[30,2]/sort/0", table30_2, dupe(tableSortBy(table30_2, 0), 2)),
      new Group("table/[15,2]/sort/0", table15_2, dupe(tableSortBy(table15_2, 0), 2)),

      new Group("table/[30,4]/sort/1", table30_4, dupe(tableSortBy(table30_4, 1), 2)),
      new Group("table/[15,4]/sort/1", table15_4, dupe(tableSortBy(table15_4, 1), 2)),
      new Group("table/[30,2]/sort/1", table30_2, dupe(tableSortBy(table30_2, 1), 2)),
      new Group("table/[15,2]/sort/1", table15_2, dupe(tableSortBy(table15_2, 1), 2)),

      new Group("table/[30,4]/filter/32", table30_4, dupe(tableFilterBy(table30_4, 32), 2)),
      new Group("table/[15,4]/filter/32", table15_4, dupe(tableFilterBy(table15_4, 32), 2)),
      new Group("table/[30,2]/filter/32", table30_2, dupe(tableFilterBy(table30_2, 32), 2)),
      new Group("table/[15,2]/filter/32", table15_2, dupe(tableFilterBy(table15_2, 32), 2)),

      new Group("table/[30,4]/filter/16", table30_4, dupe(tableFilterBy(table30_4, 16), 2)),
      new Group("table/[15,4]/filter/16", table15_4, dupe(tableFilterBy(table15_4, 16), 2)),
      new Group("table/[30,2]/filter/16", table30_2, dupe(tableFilterBy(table30_2, 16), 2)),
      new Group("table/[15,2]/filter/16", table15_2, dupe(tableFilterBy(table15_2, 16), 2)),

      new Group("table/[30,4]/filter/8", table30_4, dupe(tableFilterBy(table30_4, 8), 2)),
      new Group("table/[15,4]/filter/8", table15_4, dupe(tableFilterBy(table15_4, 8), 2)),
      new Group("table/[30,2]/filter/8", table30_2, dupe(tableFilterBy(table30_2, 8), 2)),
      new Group("table/[15,2]/filter/8", table15_2, dupe(tableFilterBy(table15_2, 8), 2)),

      new Group("table/[30,4]/filter/4", table30_4, dupe(tableFilterBy(table30_4, 4), 2)),
      new Group("table/[15,4]/filter/4", table15_4, dupe(tableFilterBy(table15_4, 4), 2)),
      new Group("table/[30,2]/filter/4", table30_2, dupe(tableFilterBy(table30_2, 4), 2)),
      new Group("table/[15,2]/filter/4", table15_2, dupe(tableFilterBy(table15_2, 4), 2)),

      new Group("table/[30,4]/filter/2", table30_4, dupe(tableFilterBy(table30_4, 2), 2)),
      new Group("table/[15,4]/filter/2",  table15_4,  dupe(tableFilterBy(table15_4, 2), 2)),
      new Group("table/[30,2]/filter/2", table30_2, dupe(tableFilterBy(table30_2, 2), 2)),
      new Group("table/[15,2]/filter/2",  table15_2,  dupe(tableFilterBy(table15_2, 2), 2)),

      new Group("table/[30,4]/activate/32", table30_4, dupe(tableActivateEach(table30_4, 32), 2)),
      new Group("table/[15,4]/activate/32", table15_4, dupe(tableActivateEach(table15_4, 32), 2)),
      new Group("table/[30,2]/activate/32", table30_2, dupe(tableActivateEach(table30_2, 32), 2)),
      new Group("table/[15,2]/activate/32", table15_2, dupe(tableActivateEach(table15_2, 32), 2)),

      new Group("table/[30,4]/activate/16", table30_4, dupe(tableActivateEach(table30_4, 16), 2)),
      new Group("table/[15,4]/activate/16", table15_4, dupe(tableActivateEach(table15_4, 16), 2)),
      new Group("table/[30,2]/activate/16", table30_2, dupe(tableActivateEach(table30_2, 16), 2)),
      new Group("table/[15,2]/activate/16", table15_2, dupe(tableActivateEach(table15_2, 16), 2)),

      new Group("table/[30,4]/activate/8", table30_4, dupe(tableActivateEach(table30_4, 8), 2)),
      new Group("table/[15,4]/activate/8", table15_4, dupe(tableActivateEach(table15_4, 8), 2)),
      new Group("table/[30,2]/activate/8", table30_2, dupe(tableActivateEach(table30_2, 8), 2)),
      new Group("table/[15,2]/activate/8", table15_2, dupe(tableActivateEach(table15_2, 8), 2)),

      new Group("table/[30,4]/activate/4", table30_4, dupe(tableActivateEach(table30_4, 4), 2)),
      new Group("table/[15,4]/activate/4", table15_4, dupe(tableActivateEach(table15_4, 4), 2)),
      new Group("table/[30,2]/activate/4", table30_2, dupe(tableActivateEach(table30_2, 4), 2)),
      new Group("table/[15,2]/activate/4", table15_2, dupe(tableActivateEach(table15_2, 4), 2)),

      new Group("table/[30,4]/activate/2", table30_4, dupe(tableActivateEach(table30_4, 2), 2)),
      new Group("table/[15,4]/activate/2", table15_4, dupe(tableActivateEach(table15_4, 2), 2)),
      new Group("table/[30,2]/activate/2", table30_2, dupe(tableActivateEach(table30_2, 2), 2)),
      new Group("table/[15,2]/activate/2", table15_2, dupe(tableActivateEach(table15_2, 2), 2)),

      new Group("table/[30,4]/activate/1", table30_4, dupe(tableActivateEach(table30_4, 1), 2)),
      new Group("table/[15,4]/activate/1", table15_4, dupe(tableActivateEach(table15_4, 1), 2)),
      new Group("table/[30,2]/activate/1", table30_2, dupe(tableActivateEach(table30_2, 1), 2)),
      new Group("table/[15,2]/activate/1", table15_2, dupe(tableActivateEach(table15_2, 1), 2)),

      new Group("anim/30/8", initialAnim, animate(initialAnim, 8, 2)),
      new Group("anim/30/4", initialAnim, animate(initialAnim, 4, 2)),
      new Group("anim/30/2", initialAnim, animate(initialAnim, 2, 2)),
      new Group("anim/30/1", initialAnim, animate(initialAnim, 1, 2)),

      new Group("tree/[50]/render", initialTree, dupe(tree50, 2)),
      new Group("tree/[5,10]/render", initialTree, dupe(tree5_10, 2)),
      new Group("tree/[10,5]/render", initialTree, dupe(tree10_5, 2)),

      new Group("tree/[50]/removeAll", tree50, dupe(initialTree, 2)),
      new Group("tree/[5,10]/removeAll", tree5_10, dupe(initialTree, 2)),
      new Group("tree/[10,5]/removeAll", tree10_5, dupe(initialTree, 2)),

      new Group("tree/[50]/[reverse]", tree50, dupe(treeTransform(tree50, [reverse]), 2)),
      new Group("tree/[5,10]/[reverse]", tree5_10, dupe(treeTransform(tree5_10, [reverse]), 2)),
      new Group("tree/[10,5]/[reverse]", tree10_5, dupe(treeTransform(tree10_5, [reverse]), 2)),

      new Group("tree/[50]/[insertFirst(1)]", tree50, dupe(treeTransform(tree50, [insertFirst(1)]), 2)),
      new Group("tree/[5,10]/[insertFirst(1)]", tree5_10, dupe(treeTransform(tree5_10, [insertFirst(1)]), 2)),
      new Group("tree/[10,5]/[insertFirst(1)]", tree10_5, dupe(treeTransform(tree10_5, [insertFirst(1)]), 2)),

      new Group("tree/[50]/[insertLast(1)]", tree50, dupe(treeTransform(tree50, [insertLast(1)]), 2)),
      new Group("tree/[5,10]/[insertLast(1)]", tree5_10, dupe(treeTransform(tree5_10, [insertLast(1)]), 2)),
      new Group("tree/[10,5]/[insertLast(1)]", tree10_5, dupe(treeTransform(tree10_5, [insertLast(1)]), 2)),

      new Group("tree/[50]/[removeFirst(1)]", tree50, dupe(treeTransform(tree50, [removeFirst(1)]), 2)),
      new Group("tree/[5,10]/[removeFirst(1)]", tree5_10, dupe(treeTransform(tree5_10, [removeFirst(1)]), 2)),
      new Group("tree/[10,5]/[removeFirst(1)]", tree10_5, dupe(treeTransform(tree10_5, [removeFirst(1)]), 2)),

      new Group("tree/[50]/[removeLast(1)]", tree50, dupe(treeTransform(tree50, [removeLast(1)]), 2)),
      new Group("tree/[5,10]/[removeLast(1)]", tree5_10, dupe(treeTransform(tree5_10, [removeLast(1)]), 2)),
      new Group("tree/[10,5]/[removeLast(1)]", tree10_5, dupe(treeTransform(tree10_5, [removeLast(1)]), 2)),

      new Group("tree/[50]/[moveFromEndToStart(1)]", tree50,
        dupe(treeTransform(tree50, [moveFromEndToStart(1)]), 2)),
      new Group("tree/[5,10]/[moveFromEndToStart(1)]", tree5_10,
        dupe(treeTransform(tree5_10, [moveFromEndToStart(1)]), 2)),
      new Group("tree/[10,5]/[moveFromEndToStart(1)]", tree10_5,
        dupe(treeTransform(tree10_5, [moveFromEndToStart(1)]), 2)),

      new Group("tree/[50]/[moveFromStartToEnd(1)]", tree50,
        dupe(treeTransform(tree50, [moveFromStartToEnd(1)]), 2)),
      new Group("tree/[5,10]/[moveFromStartToEnd(1)]", tree5_10,
        dupe(treeTransform(tree5_10, [moveFromStartToEnd(1)]), 2)),
      new Group("tree/[10,5]/[moveFromStartToEnd(1)]", tree10_5,
        dupe(treeTransform(tree10_5, [moveFromStartToEnd(1)]), 2)),

      // special use case that should trigger worst case scenario for kivi library
      new Group("tree/[50]/[kivi_worst_case]", tree50, dupe(
        treeTransform(treeTransform(treeTransform(tree50, [removeFirst(1)]), [removeLast(1)]), [reverse]),
        2)),

      // special use case that should trigger worst case scenario for snabbdom library
      new Group("tree/[50]/[snabbdom_worst_case]", tree50, dupe(
        treeTransform(tree50, [snabbdomWorstCase]),
        2)),
    ];
  } else {
    let table100_4 = tableCreate(initialTable, 100, 4);
    let table50_4 = tableCreate(initialTable, 50, 4);
    let table100_2 = tableCreate(initialTable, 100, 2);
    let table50_2 = tableCreate(initialTable, 50, 2);

    let tree500 = treeCreate(initialTree, [500]);
    let tree50_10 = treeCreate(initialTree, [50, 10]);
    let tree10_50 = treeCreate(initialTree, [10, 50]);
    let tree5_100 = treeCreate(initialTree, [5, 100]);

    if (config.disableSCU) {
      table100_4 = table100_4.clone();
      table50_4 = table50_4.clone();
      table100_2 = table100_2.clone();
      table50_2 = table50_2.clone();

      tree500 = tree500.clone();
      tree50_10 = tree50_10.clone();
      tree10_50 = tree10_50.clone();
      tree5_100 = tree5_100.clone();
    }

    config.tests = [
      new Group("table/[100,4]/render", initialTable, dupe(table100_4, 2)),
      new Group("table/[50,4]/render", initialTable, dupe(table50_4, 2)),
      new Group("table/[100,2]/render", initialTable, dupe(table100_2, 2)),
      new Group("table/[50,2]/render", initialTable, dupe(table50_2, 2)),

      new Group("table/[100,4]/removeAll", table100_4, dupe(initialTable, 2)),
      new Group("table/[50,4]/removeAll", table50_4, dupe(initialTable, 2)),
      new Group("table/[100,2]/removeAll", table100_2, dupe(initialTable, 2)),
      new Group("table/[50,2]/removeAll", table50_2, dupe(initialTable, 2)),

      new Group("table/[100,4]/sort/0", table100_4, dupe(tableSortBy(table100_4, 0), 2)),
      new Group("table/[50,4]/sort/0", table50_4, dupe(tableSortBy(table50_4, 0), 2)),
      new Group("table/[100,2]/sort/0", table100_2, dupe(tableSortBy(table100_2, 0), 2)),
      new Group("table/[50,2]/sort/0", table50_2, dupe(tableSortBy(table50_2, 0), 2)),

      new Group("table/[100,4]/sort/1", table100_4, dupe(tableSortBy(table100_4, 1), 2)),
      new Group("table/[50,4]/sort/1", table50_4, dupe(tableSortBy(table50_4, 1), 2)),
      new Group("table/[100,2]/sort/1", table100_2, dupe(tableSortBy(table100_2, 1), 2)),
      new Group("table/[50,2]/sort/1", table50_2, dupe(tableSortBy(table50_2, 1), 2)),

      new Group("table/[100,4]/sort/2", table100_4, dupe(tableSortBy(table100_4, 2), 2)),
      new Group("table/[50,4]/sort/2", table50_4, dupe(tableSortBy(table50_4, 2), 2)),

      new Group("table/[100,4]/sort/3", table100_4, dupe(tableSortBy(table100_4, 3), 2)),
      new Group("table/[50,4]/sort/3", table50_4, dupe(tableSortBy(table50_4, 3), 2)),

      new Group("table/[100,4]/filter/32", table100_4, dupe(tableFilterBy(table100_4, 32), 2)),
      new Group("table/[50,4]/filter/32", table50_4, dupe(tableFilterBy(table50_4, 32), 2)),
      new Group("table/[100,2]/filter/32", table100_2, dupe(tableFilterBy(table100_2, 32), 2)),
      new Group("table/[50,2]/filter/32", table50_2, dupe(tableFilterBy(table50_2, 32), 2)),

      new Group("table/[100,4]/filter/16", table100_4, dupe(tableFilterBy(table100_4, 16), 2)),
      new Group("table/[50,4]/filter/16", table50_4, dupe(tableFilterBy(table50_4, 16), 2)),
      new Group("table/[100,2]/filter/16", table100_2, dupe(tableFilterBy(table100_2, 16), 2)),
      new Group("table/[50,2]/filter/16", table50_2, dupe(tableFilterBy(table50_2, 16), 2)),

      new Group("table/[100,4]/filter/8", table100_4, dupe(tableFilterBy(table100_4, 8), 2)),
      new Group("table/[50,4]/filter/8", table50_4, dupe(tableFilterBy(table50_4, 8), 2)),
      new Group("table/[100,2]/filter/8", table100_2, dupe(tableFilterBy(table100_2, 8), 2)),
      new Group("table/[50,2]/filter/8", table50_2, dupe(tableFilterBy(table50_2, 8), 2)),

      new Group("table/[100,4]/filter/4", table100_4, dupe(tableFilterBy(table100_4, 4), 2)),
      new Group("table/[50,4]/filter/4", table50_4, dupe(tableFilterBy(table50_4, 4), 2)),
      new Group("table/[100,2]/filter/4", table100_2, dupe(tableFilterBy(table100_2, 4), 2)),
      new Group("table/[50,2]/filter/4", table50_2, dupe(tableFilterBy(table50_2, 4), 2)),

      new Group("table/[100,4]/filter/2", table100_4, dupe(tableFilterBy(table100_4, 2), 2)),
      new Group("table/[50,4]/filter/2",  table50_4,  dupe(tableFilterBy(table50_4, 2), 2)),
      new Group("table/[100,2]/filter/2", table100_2, dupe(tableFilterBy(table100_2, 2), 2)),
      new Group("table/[50,2]/filter/2",  table50_2,  dupe(tableFilterBy(table50_2, 2), 2)),

      new Group("table/[100,4]/activate/32", table100_4, dupe(tableActivateEach(table100_4, 32), 2)),
      new Group("table/[50,4]/activate/32", table50_4, dupe(tableActivateEach(table50_4, 32), 2)),
      new Group("table/[100,2]/activate/32", table100_2, dupe(tableActivateEach(table100_2, 32), 2)),
      new Group("table/[50,2]/activate/32", table50_2, dupe(tableActivateEach(table50_2, 32), 2)),

      new Group("table/[100,4]/activate/16", table100_4, dupe(tableActivateEach(table100_4, 16), 2)),
      new Group("table/[50,4]/activate/16", table50_4, dupe(tableActivateEach(table50_4, 16), 2)),
      new Group("table/[100,2]/activate/16", table100_2, dupe(tableActivateEach(table100_2, 16), 2)),
      new Group("table/[50,2]/activate/16", table50_2, dupe(tableActivateEach(table50_2, 16), 2)),

      new Group("table/[100,4]/activate/8", table100_4, dupe(tableActivateEach(table100_4, 8), 2)),
      new Group("table/[50,4]/activate/8", table50_4, dupe(tableActivateEach(table50_4, 8), 2)),
      new Group("table/[100,2]/activate/8", table100_2, dupe(tableActivateEach(table100_2, 8), 2)),
      new Group("table/[50,2]/activate/8", table50_2, dupe(tableActivateEach(table50_2, 8), 2)),

      new Group("table/[100,4]/activate/4", table100_4, dupe(tableActivateEach(table100_4, 4), 2)),
      new Group("table/[50,4]/activate/4", table50_4, dupe(tableActivateEach(table50_4, 4), 2)),
      new Group("table/[100,2]/activate/4", table100_2, dupe(tableActivateEach(table100_2, 4), 2)),
      new Group("table/[50,2]/activate/4", table50_2, dupe(tableActivateEach(table50_2, 4), 2)),

      new Group("table/[100,4]/activate/2", table100_4, dupe(tableActivateEach(table100_4, 2), 2)),
      new Group("table/[50,4]/activate/2", table50_4, dupe(tableActivateEach(table50_4, 2), 2)),
      new Group("table/[100,2]/activate/2", table100_2, dupe(tableActivateEach(table100_2, 2), 2)),
      new Group("table/[50,2]/activate/2", table50_2, dupe(tableActivateEach(table50_2, 2), 2)),

      new Group("table/[100,4]/activate/1", table100_4, dupe(tableActivateEach(table100_4, 1), 2)),
      new Group("table/[50,4]/activate/1", table50_4, dupe(tableActivateEach(table50_4, 1), 2)),
      new Group("table/[100,2]/activate/1", table100_2, dupe(tableActivateEach(table100_2, 1), 2)),
      new Group("table/[50,2]/activate/1", table50_2, dupe(tableActivateEach(table50_2, 1), 2)),

      new Group("anim/100/32", initialAnim, animate(initialAnim, 32, 2)),
      new Group("anim/100/16", initialAnim, animate(initialAnim, 16, 2)),
      new Group("anim/100/8", initialAnim, animate(initialAnim, 8, 2)),
      new Group("anim/100/4", initialAnim, animate(initialAnim, 4, 2)),
      new Group("anim/100/2", initialAnim, animate(initialAnim, 2, 2)),
      new Group("anim/100/1", initialAnim, animate(initialAnim, 1, 2)),

      new Group("tree/[500]/render", initialTree, dupe(tree500, 2)),
      new Group("tree/[50,10]/render", initialTree, dupe(tree50_10, 2)),
      new Group("tree/[10,50]/render", initialTree, dupe(tree10_50, 2)),
      new Group("tree/[5,100]/render", initialTree, dupe(tree5_100, 2)),

      new Group("tree/[500]/removeAll", tree500, dupe(initialTree, 2)),
      new Group("tree/[50,10]/removeAll", tree50_10, dupe(initialTree, 2)),
      new Group("tree/[10,50]/removeAll", tree10_50, dupe(initialTree, 2)),
      new Group("tree/[5,100]/removeAll", tree5_100, dupe(initialTree, 2)),

      new Group("tree/[500]/[reverse]", tree500, dupe(treeTransform(tree500, [reverse]), 2)),
      new Group("tree/[50,10]/[reverse]", tree50_10, dupe(treeTransform(tree50_10, [reverse]), 2)),
      new Group("tree/[10,50]/[reverse]", tree10_50, dupe(treeTransform(tree10_50, [reverse]), 2)),
      new Group("tree/[5,100]/[reverse]", tree5_100, dupe(treeTransform(tree5_100, [reverse]), 2)),

      new Group("tree/[500]/[insertFirst(1)]", tree500, dupe(treeTransform(tree500, [insertFirst(1)]), 2)),
      new Group("tree/[50,10]/[insertFirst(1)]", tree50_10, dupe(treeTransform(tree50_10, [insertFirst(1)]), 2)),
      new Group("tree/[10,50]/[insertFirst(1)]", tree10_50, dupe(treeTransform(tree10_50, [insertFirst(1)]), 2)),
      new Group("tree/[5,100]/[insertFirst(1)]", tree5_100, dupe(treeTransform(tree5_100, [insertFirst(1)]), 2)),

      new Group("tree/[500]/[insertLast(1)]", tree500, dupe(treeTransform(tree500, [insertLast(1)]), 2)),
      new Group("tree/[50,10]/[insertLast(1)]", tree50_10, dupe(treeTransform(tree50_10, [insertLast(1)]), 2)),
      new Group("tree/[10,50]/[insertLast(1)]", tree10_50, dupe(treeTransform(tree10_50, [insertLast(1)]), 2)),
      new Group("tree/[5,100]/[insertLast(1)]", tree5_100, dupe(treeTransform(tree5_100, [insertLast(1)]), 2)),

      new Group("tree/[500]/[removeFirst(1)]", tree500, dupe(treeTransform(tree500, [removeFirst(1)]), 2)),
      new Group("tree/[50,10]/[removeFirst(1)]", tree50_10, dupe(treeTransform(tree50_10, [removeFirst(1)]), 2)),
      new Group("tree/[10,50]/[removeFirst(1)]", tree10_50, dupe(treeTransform(tree10_50, [removeFirst(1)]), 2)),
      new Group("tree/[5,100]/[removeFirst(1)]", tree5_100, dupe(treeTransform(tree5_100, [removeFirst(1)]), 2)),

      new Group("tree/[500]/[removeLast(1)]", tree500, dupe(treeTransform(tree500, [removeLast(1)]), 2)),
      new Group("tree/[50,10]/[removeLast(1)]", tree50_10, dupe(treeTransform(tree50_10, [removeLast(1)]), 2)),
      new Group("tree/[10,50]/[removeLast(1)]", tree10_50, dupe(treeTransform(tree10_50, [removeLast(1)]), 2)),
      new Group("tree/[5,100]/[removeLast(1)]", tree5_100, dupe(treeTransform(tree5_100, [removeLast(1)]), 2)),

      new Group("tree/[500]/[moveFromEndToStart(1)]", tree500,
        dupe(treeTransform(tree500, [moveFromEndToStart(1)]), 2)),
      new Group("tree/[50,10]/[moveFromEndToStart(1)]", tree50_10,
        dupe(treeTransform(tree50_10, [moveFromEndToStart(1)]), 2)),
      new Group("tree/[10,50]/[moveFromEndToStart(1)]", tree10_50,
        dupe(treeTransform(tree10_50, [moveFromEndToStart(1)]), 2)),
      new Group("tree/[5,100]/[moveFromEndToStart(1)]", tree5_100,
        dupe(treeTransform(tree5_100, [moveFromEndToStart(1)]), 2)),

      new Group("tree/[500]/[moveFromStartToEnd(1)]", tree500,
        dupe(treeTransform(tree500, [moveFromStartToEnd(1)]), 2)),
      new Group("tree/[50,10]/[moveFromStartToEnd(1)]", tree50_10,
        dupe(treeTransform(tree50_10, [moveFromStartToEnd(1)]), 2)),
      new Group("tree/[10,50]/[moveFromStartToEnd(1)]", tree10_50,
        dupe(treeTransform(tree10_50, [moveFromStartToEnd(1)]), 2)),
      new Group("tree/[5,100]/[moveFromStartToEnd(1)]", tree5_100,
        dupe(treeTransform(tree5_100, [moveFromStartToEnd(1)]), 2)),

      // special use case that should trigger worst case scenario for kivi library
      new Group("tree/[500]/[kivi_worst_case]", tree500, dupe(
        treeTransform(treeTransform(treeTransform(tree500, [removeFirst(1)]), [removeLast(1)]), [reverse]),
        2)),

      // special use case that should trigger worst case scenario for snabbdom library
      new Group("tree/[500]/[snabbdom_worst_case]", tree500, dupe(
        treeTransform(tree500, [snabbdomWorstCase]),
        2)),
    ];
  }

  return config;
}

export type Result = {[name: string]: number[]};
export type UpdateHandler = (state: AppState, type: "init" | "update") => void;
export type FinishHandler = (result: Result) => void;
export type ProgressHandler = (progress: number) => void;

export class Executor {
  iterations: number;
  groups: Group[];
  onUpdate: UpdateHandler;
  onFinish: FinishHandler;
  onProgress: ProgressHandler;

  private _samples: Result;
  private _state: "init" | "update";
  private _currentGroup: number;
  private _currentGroupState: number;
  private _currentIteration: number;

  constructor(iterations: number, groups: Group[], onUpdate: UpdateHandler, onFinish: FinishHandler,
      onProgress: ProgressHandler) {
    this.iterations = iterations;
    this.groups = groups;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.onProgress = onProgress;

    this._samples = {};
    this._state = "init";
    this._currentGroup = 0;
    this._currentGroupState = 0;
    this._currentIteration = 0;
  }

  run(): void {
    this._next();
  }

  private _next = () => {
    const group = this.groups[this._currentGroup];
    if (this._state === "init") {
      this.onUpdate(group.from, "init");
      this._state = "update";
      requestAnimationFrame(this._next);
    } else if (this._state === "update") {
      let t = window.performance.now();
      this.onUpdate(group.to[this._currentGroupState++], "update");
      t = window.performance.now() - t;

      this.onProgress(
        (this._currentIteration * this.groups.length + this._currentGroup) / (this.groups.length * this.iterations));

      let samples = this._samples[group.name];
      if (samples === undefined) {
        samples = this._samples[group.name] = [];
      }
      samples.push(t);

      this._state = "init";
      if (this._currentGroupState < group.to.length) {
        requestAnimationFrame(this._next);
      } else {
        this._currentGroup++;
        if (this._currentGroup < this.groups.length) {
          this._currentGroupState = 0;
          requestAnimationFrame(this._next);
        } else {
          this._currentIteration++;
          if (this._currentIteration < this.iterations) {
            this._currentGroup = 0;
            this._currentGroupState = 0;
            requestAnimationFrame(this._next);
          } else {
            this.onFinish(this._samples);
            this.onProgress(1);
          }
        }
      }
    }
  }
}

export function run(onUpdate: UpdateHandler, onFinish: FinishHandler, filter?: string | null): void {
  specTest(onUpdate);
  scuTest(onUpdate, (scuSupported) => {
    recyclingTest(onUpdate, (recyclingEnabled) => {
      let tests = config.tests;
      let name = config.name;
      if (recyclingEnabled) {
        name += "+r";
      }
      if (scuSupported && !config.disableSCU) {
        name += "+s";
      }

      filter = filter || config.filter;

      if (tests && filter) {
        tests = tests.filter((t) => t.name.indexOf(filter as string) !== -1);
      }

      const progressBar = document.createElement("div");
      progressBar.className = "ProgressBar";
      const progressBarInner = document.createElement("div");
      progressBarInner.className = "ProgressBar_inner";
      progressBarInner.style.width = "0";
      document.body.appendChild(progressBar);
      progressBar.appendChild(progressBarInner);

      if (tests) {
        const e = new Executor(config.iterations, tests, onUpdate,
          (samples) => {
            onFinish(samples);
            if (config.report) {
              window.opener.postMessage({
                "type": "report",
                "data": {
                  "name": name,
                  "version": config.version,
                  "samples": samples,
                },
              }, "*");
            }
          },
          (progress) => {
            progressBarInner.style.width = `${Math.round(progress * 100)}%`;
          });
        e.run();
      } else {
        onFinish({});
      }
    });
  });
}
