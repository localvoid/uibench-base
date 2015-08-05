goog.provide('uibench.init');
goog.require('uibench.state');
goog.require('uibench.actions');
goog.require('uibench.tree_transformers');
goog.require('uibench.Group');

/** @const {number} */
uibench.TABLE_ROWS = 100;

/** @const {number} */
uibench.TABLE_COLS = 4;

/** @const {number} */
uibench.ANIM_COUNT = 100;

/** @type {Array<!uibench.Group>} */
uibench.tests = null;

/** @type {number} */
uibench.iterations = 3;

/** @type {string} */
uibench.name = 'unnamed';

/** @type {string} */
uibench.version = '0.0.0';

/** @type {boolean} */
uibench.report = false;

/**
 * @param {string} name
 * @param {string} version
 */
uibench.init = function(name, version) {
  uibench.name = name;
  uibench.version = version;

  /**
   * @param {!Array<string>} a
   * @return {Object<string,string>}
   */
  function parseQueryString(a) {
    if (a.length === 0) return {};
    /** @type {Object<string,string>} */
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1) {
        b[p[0]] = "";
      } else {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  }

  var qs = parseQueryString(window.location.search.substr(1).split('&'));

  if (qs['i'] !== void 0) {
    uibench.iterations = parseInt(qs['i'], 10);
  }
  if (qs['name'] !== void 0) {
    uibench.name = qs['name'];
  }
  if (qs['version'] !== void 0) {
    uibench.version = qs['version'];
  }
  if (qs['report'] !== void 0) {
    uibench.report = true;
  }

  var initial = new uibench.state.AppState(
      'home',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(uibench.TABLE_ROWS, uibench.TABLE_COLS),
      uibench.state.AnimState.create(uibench.ANIM_COUNT),
      uibench.state.TreeState.create([0])
  );
  var initialTable = uibench.actions.switchTo(initial, 'table');
  var initialAnim = uibench.actions.switchTo(initial, 'anim');
  var initialTree = uibench.actions.switchTo(initial, 'tree');

  var tree500 = uibench.actions.treeCreate(initialTree, [500]);
  var tree50_10 = uibench.actions.treeCreate(initialTree, [50, 10]);
  var tree10_50 = uibench.actions.treeCreate(initialTree, [10, 50]);
  var tree5_100 = uibench.actions.treeCreate(initialTree, [5, 100]);

  /**
   * @param {!uibench.state.AppState} from
   * @param {number} nth
   * @param {number} t
   * @return {!Array<!uibench.state.AppState>}
   */
  function animate(from, nth, t) {
    var c = from;
    var r = [];

    for (var i = 0; i < t; i++) {
      c = uibench.actions.animAdvanceEach(c, nth);
      r.push(c);
    }

    return r;
  }

  /**
   * @param {!uibench.state.AppState} state
   * @param {number} n
   * @return {!Array<uibench.state.AppState>}
   */
  function dupe(state, n) {
    var r = [];
    while (n > 0) {
      r.push(state);
      n--;
    }
    return r;
  }

  uibench.tests = [
    new uibench.Group('table/render', initial, dupe(initialTable, 5)),
    new uibench.Group('table/sort/0', initialTable, dupe(uibench.actions.tableSortBy(initialTable, 0), 5)),
    new uibench.Group('table/activate/32', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 32), 5)),
    new uibench.Group('table/activate/16', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 16), 5)),
    new uibench.Group('table/activate/8', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 8), 5)),
    new uibench.Group('table/activate/4', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 4), 5)),
    new uibench.Group('table/activate/2', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 2), 5)),
    new uibench.Group('table/activate/1', initialTable, dupe(uibench.actions.tableActivateEach(initialTable, 1), 5)),
    new uibench.Group('anim/32', initialAnim, animate(initialAnim, 32, 5)),
    new uibench.Group('anim/16', initialAnim, animate(initialAnim, 16, 5)),
    new uibench.Group('anim/8', initialAnim, animate(initialAnim, 8, 5)),
    new uibench.Group('anim/4', initialAnim, animate(initialAnim, 4, 5)),
    new uibench.Group('anim/2', initialAnim, animate(initialAnim, 2, 5)),
    new uibench.Group('anim/1', initialAnim, animate(initialAnim, 1, 5)),
    new uibench.Group('tree/render/[500]', initial, dupe(tree500, 5)),
    new uibench.Group('tree/render/[50, 10]', initial, dupe(tree50_10, 5)),
    new uibench.Group('tree/render/[10, 50]', initial, dupe(tree10_50, 5)),
    new uibench.Group('tree/render/[5, 100]', initial, dupe(tree5_100, 5)),
    new uibench.Group('tree/update/[500]/[reverse]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.reverse]), 5)),
    new uibench.Group('tree/update/[50, 10]/[reverse]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.reverse]), 5)),
    new uibench.Group('tree/update/[10, 50]/[reverse]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.reverse]), 5)),
    new uibench.Group('tree/update/[5, 100]/[reverse]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.reverse]), 5)),
    new uibench.Group('tree/update/[500]/[insertFirst(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.insertFirst(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[insertFirst(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.insertFirst(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[insertFirst(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.insertFirst(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[insertFirst(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.insertFirst(1)]), 5)),
    new uibench.Group('tree/update/[500]/[insertLast(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.insertLast(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[insertLast(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.insertLast(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[insertLast(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.insertLast(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[insertLast(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.insertLast(1)]), 5)),
    new uibench.Group('tree/update/[500]/[removeFirst(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.removeFirst(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[removeFirst(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.removeFirst(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[removeFirst(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.removeFirst(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[removeFirst(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.removeFirst(1)]), 5)),
    new uibench.Group('tree/update/[500]/[removeLast(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.removeLast(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[removeLast(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.removeLast(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[removeLast(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.removeLast(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[removeLast(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.removeLast(1)]), 5)),
    new uibench.Group('tree/update/[500]/[moveFromEndToStart(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[moveFromEndToStart(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[moveFromEndToStart(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[moveFromEndToStart(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
    new uibench.Group('tree/update/[500]/[moveFromStartToEnd(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
    new uibench.Group('tree/update/[50, 10]/[moveFromStartToEnd(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
    new uibench.Group('tree/update/[10, 50]/[moveFromStartToEnd(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
    new uibench.Group('tree/update/[5, 100]/[moveFromStartToEnd(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5))
  ];
};

// performance.now() polyfill
// https://gist.github.com/paulirish/5438650
// prepare base perf object
if (typeof window.performance === 'undefined') {
  window.performance = /** @type {Performance} */({});
}
if (!window.performance.now){
  var nowOffset = Date.now();
  if (window.performance.timing && window.performance.timing.navigationStart) {
    nowOffset = window.performance.timing.navigationStart;
  }
  window.performance.now = function now(){
    return Date.now() - nowOffset;
  };
}