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

/** @type {boolean} */
uibench.mobile = false;

/**
 * Disable shouldComponentUpdate optimization.
 *
 * @type {boolean}
 */
uibench.disableSCU = false;

/**
 * @param {string} name
 * @param {string} version
 * @returns {{disableSCU: boolean}}
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
  if (qs['mobile'] !== void 0) {
    uibench.mobile = true;
  }
  if (qs['disableSCU'] !== void 0) {
    uibench.disableSCU = true;
  }

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
      if (uibench.disableSCU) {
        c = c.clone();
      }
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
    if (uibench.disableSCU) {
      state = state.clone();
    }
    var r = [];
    while (n > 0) {
      r.push(state);
      n--;
    }
    return r;
  }

  var initial = new uibench.state.AppState(
    'home',
    new uibench.state.HomeState(),
    uibench.state.TableState.create(0, 0),
    uibench.state.AnimState.create(uibench.mobile ? 30 : 100),
    uibench.state.TreeState.create([0])
  );
  var initialTable = uibench.actions.switchTo(initial, 'table');
  var initialAnim = uibench.actions.switchTo(initial, 'anim');
  var initialTree = uibench.actions.switchTo(initial, 'tree');

  if (uibench.disableSCU) {
    initialTable = initialTable.clone();
    initialAnim = initialAnim.clone();
    initialTree = initialTree.clone();
  }

  if (uibench.mobile) {
    var table30_4 = uibench.actions.tableCreate(initialTable, 30, 4);
    var table15_4 = uibench.actions.tableCreate(initialTable, 15, 4);
    var table30_2 = uibench.actions.tableCreate(initialTable, 30, 2);
    var table15_2 = uibench.actions.tableCreate(initialTable, 15, 2);

    var tree50 = uibench.actions.treeCreate(initialTree, [50]);
    var tree5_10 = uibench.actions.treeCreate(initialTree, [5, 10]);
    var tree10_5 = uibench.actions.treeCreate(initialTree, [10, 5]);

    if (uibench.disableSCU) {
      table30_4 = table30_4.clone();
      table15_4 = table15_4.clone();
      table30_2 = table30_2.clone();
      table15_2 = table15_2.clone();

      tree50 = tree50.clone();
      tree5_10 = tree5_10.clone();
      tree10_5 = tree10_5.clone();
    }

    uibench.tests = [
      new uibench.Group('table/[30,4]/render', initialTable, dupe(table30_4, 3)),
      new uibench.Group('table/[15,4]/render', initialTable, dupe(table15_4, 3)),
      new uibench.Group('table/[30,2]/render', initialTable, dupe(table30_2, 3)),
      new uibench.Group('table/[15,2]/render', initialTable, dupe(table15_2, 3)),

      new uibench.Group('table/[30,4]/sort/0', table30_4, dupe(uibench.actions.tableSortBy(table30_4, 0), 3)),
      new uibench.Group('table/[15,4]/sort/0', table15_4, dupe(uibench.actions.tableSortBy(table15_4, 0), 3)),
      new uibench.Group('table/[30,2]/sort/0', table30_2, dupe(uibench.actions.tableSortBy(table30_2, 0), 3)),
      new uibench.Group('table/[15,2]/sort/0', table15_2, dupe(uibench.actions.tableSortBy(table15_2, 0), 3)),

      new uibench.Group('table/[30,4]/sort/1', table30_4, dupe(uibench.actions.tableSortBy(table30_4, 1), 3)),
      new uibench.Group('table/[15,4]/sort/1', table15_4, dupe(uibench.actions.tableSortBy(table15_4, 1), 3)),
      new uibench.Group('table/[30,2]/sort/1', table30_2, dupe(uibench.actions.tableSortBy(table30_2, 1), 3)),
      new uibench.Group('table/[15,2]/sort/1', table15_2, dupe(uibench.actions.tableSortBy(table15_2, 1), 3)),

      new uibench.Group('table/[30,4]/filter/32', table30_4, dupe(uibench.actions.tableFilterBy(table30_4, 32), 3)),
      new uibench.Group('table/[15,4]/filter/32', table15_4, dupe(uibench.actions.tableFilterBy(table15_4, 32), 3)),
      new uibench.Group('table/[30,2]/filter/32', table30_2, dupe(uibench.actions.tableFilterBy(table30_2, 32), 3)),
      new uibench.Group('table/[15,2]/filter/32', table15_2, dupe(uibench.actions.tableFilterBy(table15_2, 32), 3)),

      new uibench.Group('table/[30,4]/filter/16', table30_4, dupe(uibench.actions.tableFilterBy(table30_4, 16), 3)),
      new uibench.Group('table/[15,4]/filter/16', table15_4, dupe(uibench.actions.tableFilterBy(table15_4, 16), 3)),
      new uibench.Group('table/[30,2]/filter/16', table30_2, dupe(uibench.actions.tableFilterBy(table30_2, 16), 3)),
      new uibench.Group('table/[15,2]/filter/16', table15_2, dupe(uibench.actions.tableFilterBy(table15_2, 16), 3)),

      new uibench.Group('table/[30,4]/filter/8', table30_4, dupe(uibench.actions.tableFilterBy(table30_4, 8), 3)),
      new uibench.Group('table/[15,4]/filter/8', table15_4, dupe(uibench.actions.tableFilterBy(table15_4, 8), 3)),
      new uibench.Group('table/[30,2]/filter/8', table30_2, dupe(uibench.actions.tableFilterBy(table30_2, 8), 3)),
      new uibench.Group('table/[15,2]/filter/8', table15_2, dupe(uibench.actions.tableFilterBy(table15_2, 8), 3)),

      new uibench.Group('table/[30,4]/filter/4', table30_4, dupe(uibench.actions.tableFilterBy(table30_4, 4), 3)),
      new uibench.Group('table/[15,4]/filter/4', table15_4, dupe(uibench.actions.tableFilterBy(table15_4, 4), 3)),
      new uibench.Group('table/[30,2]/filter/4', table30_2, dupe(uibench.actions.tableFilterBy(table30_2, 4), 3)),
      new uibench.Group('table/[15,2]/filter/4', table15_2, dupe(uibench.actions.tableFilterBy(table15_2, 4), 3)),

      new uibench.Group('table/[30,4]/filter/2', table30_4, dupe(uibench.actions.tableFilterBy(table30_4, 2), 3)),
      new uibench.Group('table/[15,4]/filter/2',  table15_4,  dupe(uibench.actions.tableFilterBy(table15_4, 2), 3)),
      new uibench.Group('table/[30,2]/filter/2', table30_2, dupe(uibench.actions.tableFilterBy(table30_2, 2), 3)),
      new uibench.Group('table/[15,2]/filter/2',  table15_2,  dupe(uibench.actions.tableFilterBy(table15_2, 2), 3)),

      new uibench.Group('table/[30,4]/activate/32', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 32), 3)),
      new uibench.Group('table/[15,4]/activate/32', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 32), 3)),
      new uibench.Group('table/[30,2]/activate/32', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 32), 3)),
      new uibench.Group('table/[15,2]/activate/32', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 32), 3)),

      new uibench.Group('table/[30,4]/activate/16', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 16), 3)),
      new uibench.Group('table/[15,4]/activate/16', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 16), 3)),
      new uibench.Group('table/[30,2]/activate/16', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 16), 3)),
      new uibench.Group('table/[15,2]/activate/16', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 16), 3)),

      new uibench.Group('table/[30,4]/activate/8', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 8), 3)),
      new uibench.Group('table/[15,4]/activate/8', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 8), 3)),
      new uibench.Group('table/[30,2]/activate/8', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 8), 3)),
      new uibench.Group('table/[15,2]/activate/8', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 8), 3)),

      new uibench.Group('table/[30,4]/activate/4', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 4), 3)),
      new uibench.Group('table/[15,4]/activate/4', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 4), 3)),
      new uibench.Group('table/[30,2]/activate/4', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 4), 3)),
      new uibench.Group('table/[15,2]/activate/4', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 4), 3)),

      new uibench.Group('table/[30,4]/activate/2', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 2), 3)),
      new uibench.Group('table/[15,4]/activate/2', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 2), 3)),
      new uibench.Group('table/[30,2]/activate/2', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 2), 3)),
      new uibench.Group('table/[15,2]/activate/2', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 2), 3)),

      new uibench.Group('table/[30,4]/activate/1', table30_4, dupe(uibench.actions.tableActivateEach(table30_4, 1), 3)),
      new uibench.Group('table/[15,4]/activate/1', table15_4, dupe(uibench.actions.tableActivateEach(table15_4, 1), 3)),
      new uibench.Group('table/[30,2]/activate/1', table30_2, dupe(uibench.actions.tableActivateEach(table30_2, 1), 3)),
      new uibench.Group('table/[15,2]/activate/1', table15_2, dupe(uibench.actions.tableActivateEach(table15_2, 1), 3)),

      new uibench.Group('anim/30/8', initialAnim, animate(initialAnim, 8, 3)),
      new uibench.Group('anim/30/4', initialAnim, animate(initialAnim, 4, 3)),
      new uibench.Group('anim/30/2', initialAnim, animate(initialAnim, 2, 3)),
      new uibench.Group('anim/30/1', initialAnim, animate(initialAnim, 1, 3)),

      new uibench.Group('tree/[50]/render', initialTree, dupe(tree50, 3)),
      new uibench.Group('tree/[5,10]/render', initialTree, dupe(tree5_10, 3)),
      new uibench.Group('tree/[10,5]/render', initialTree, dupe(tree10_5, 3)),

      new uibench.Group('tree/[50]/[reverse]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.reverse]), 3)),
      new uibench.Group('tree/[5,10]/[reverse]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.reverse]), 3)),
      new uibench.Group('tree/[10,5]/[reverse]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.reverse]), 3)),

      new uibench.Group('tree/[50]/[insertFirst(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.insertFirst(1)]), 3)),
      new uibench.Group('tree/[5,10]/[insertFirst(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.insertFirst(1)]), 3)),
      new uibench.Group('tree/[10,5]/[insertFirst(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.insertFirst(1)]), 3)),

      new uibench.Group('tree/[50]/[insertLast(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.insertLast(1)]), 3)),
      new uibench.Group('tree/[5,10]/[insertLast(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.insertLast(1)]), 3)),
      new uibench.Group('tree/[10,5]/[insertLast(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.insertLast(1)]), 3)),

      new uibench.Group('tree/[50]/[removeFirst(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.removeFirst(1)]), 3)),
      new uibench.Group('tree/[5,10]/[removeFirst(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.removeFirst(1)]), 3)),
      new uibench.Group('tree/[10,5]/[removeFirst(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.removeFirst(1)]), 3)),

      new uibench.Group('tree/[50]/[removeLast(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.removeLast(1)]), 3)),
      new uibench.Group('tree/[5,10]/[removeLast(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.removeLast(1)]), 3)),
      new uibench.Group('tree/[10,5]/[removeLast(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.removeLast(1)]), 3)),

      new uibench.Group('tree/[50]/[moveFromEndToStart(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.moveFromEndToStart(1)]), 3)),
      new uibench.Group('tree/[5,10]/[moveFromEndToStart(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.moveFromEndToStart(1)]), 3)),
      new uibench.Group('tree/[10,5]/[moveFromEndToStart(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.moveFromEndToStart(1)]), 3)),

      new uibench.Group('tree/[50]/[moveFromStartToEnd(1)]', tree50, dupe(uibench.actions.treeTransform(tree50, [uibench.tree_transformers.moveFromStartToEnd(1)]), 3)),
      new uibench.Group('tree/[5,10]/[moveFromStartToEnd(1)]', tree5_10, dupe(uibench.actions.treeTransform(tree5_10, [uibench.tree_transformers.moveFromStartToEnd(1)]), 3)),
      new uibench.Group('tree/[10,5]/[moveFromStartToEnd(1)]', tree10_5, dupe(uibench.actions.treeTransform(tree10_5, [uibench.tree_transformers.moveFromStartToEnd(1)]), 3)),
    ];
  } else {
    var table100_4 = uibench.actions.tableCreate(initialTable, 100, 4);
    var table50_4 = uibench.actions.tableCreate(initialTable, 50, 4);
    var table100_2 = uibench.actions.tableCreate(initialTable, 100, 2);
    var table50_2 = uibench.actions.tableCreate(initialTable, 50, 2);

    var tree500 = uibench.actions.treeCreate(initialTree, [500]);
    var tree50_10 = uibench.actions.treeCreate(initialTree, [50, 10]);
    var tree10_50 = uibench.actions.treeCreate(initialTree, [10, 50]);
    var tree5_100 = uibench.actions.treeCreate(initialTree, [5, 100]);

    if (uibench.disableSCU) {
      table100_4 = table100_4.clone();
      table50_4 = table50_4.clone();
      table100_2 = table100_2.clone();
      table50_2 = table50_2.clone();

      tree500 = tree500.clone();
      tree50_10 = tree50_10.clone();
      tree10_50 = tree10_50.clone();
      tree5_100 = tree5_100.clone();
    }

    uibench.tests = [
      new uibench.Group('table/[100,4]/render', initialTable, dupe(table100_4, 5)),
      new uibench.Group('table/[50,4]/render', initialTable, dupe(table50_4, 5)),
      new uibench.Group('table/[100,2]/render', initialTable, dupe(table100_2, 5)),
      new uibench.Group('table/[50,2]/render', initialTable, dupe(table50_2, 5)),

      new uibench.Group('table/[100,4]/sort/0', table100_4, dupe(uibench.actions.tableSortBy(table100_4, 0), 5)),
      new uibench.Group('table/[50,4]/sort/0', table50_4, dupe(uibench.actions.tableSortBy(table50_4, 0), 5)),
      new uibench.Group('table/[100,2]/sort/0', table100_2, dupe(uibench.actions.tableSortBy(table100_2, 0), 5)),
      new uibench.Group('table/[50,2]/sort/0', table50_2, dupe(uibench.actions.tableSortBy(table50_2, 0), 5)),

      new uibench.Group('table/[100,4]/sort/1', table100_4, dupe(uibench.actions.tableSortBy(table100_4, 1), 5)),
      new uibench.Group('table/[50,4]/sort/1', table50_4, dupe(uibench.actions.tableSortBy(table50_4, 1), 5)),
      new uibench.Group('table/[100,2]/sort/1', table100_2, dupe(uibench.actions.tableSortBy(table100_2, 1), 5)),
      new uibench.Group('table/[50,2]/sort/1', table50_2, dupe(uibench.actions.tableSortBy(table50_2, 1), 5)),

      new uibench.Group('table/[100,4]/sort/2', table100_4, dupe(uibench.actions.tableSortBy(table100_4, 2), 5)),
      new uibench.Group('table/[50,4]/sort/2', table50_4, dupe(uibench.actions.tableSortBy(table50_4, 2), 5)),

      new uibench.Group('table/[100,4]/sort/3', table100_4, dupe(uibench.actions.tableSortBy(table100_4, 3), 5)),
      new uibench.Group('table/[50,4]/sort/3', table50_4, dupe(uibench.actions.tableSortBy(table50_4, 3), 5)),

      new uibench.Group('table/[100,4]/filter/32', table100_4, dupe(uibench.actions.tableFilterBy(table100_4, 32), 5)),
      new uibench.Group('table/[50,4]/filter/32', table50_4, dupe(uibench.actions.tableFilterBy(table50_4, 32), 5)),
      new uibench.Group('table/[100,2]/filter/32', table100_2, dupe(uibench.actions.tableFilterBy(table100_2, 32), 5)),
      new uibench.Group('table/[50,2]/filter/32', table50_2, dupe(uibench.actions.tableFilterBy(table50_2, 32), 5)),

      new uibench.Group('table/[100,4]/filter/16', table100_4, dupe(uibench.actions.tableFilterBy(table100_4, 16), 5)),
      new uibench.Group('table/[50,4]/filter/16', table50_4, dupe(uibench.actions.tableFilterBy(table50_4, 16), 5)),
      new uibench.Group('table/[100,2]/filter/16', table100_2, dupe(uibench.actions.tableFilterBy(table100_2, 16), 5)),
      new uibench.Group('table/[50,2]/filter/16', table50_2, dupe(uibench.actions.tableFilterBy(table50_2, 16), 5)),

      new uibench.Group('table/[100,4]/filter/8', table100_4, dupe(uibench.actions.tableFilterBy(table100_4, 8), 5)),
      new uibench.Group('table/[50,4]/filter/8', table50_4, dupe(uibench.actions.tableFilterBy(table50_4, 8), 5)),
      new uibench.Group('table/[100,2]/filter/8', table100_2, dupe(uibench.actions.tableFilterBy(table100_2, 8), 5)),
      new uibench.Group('table/[50,2]/filter/8', table50_2, dupe(uibench.actions.tableFilterBy(table50_2, 8), 5)),

      new uibench.Group('table/[100,4]/filter/4', table100_4, dupe(uibench.actions.tableFilterBy(table100_4, 4), 5)),
      new uibench.Group('table/[50,4]/filter/4', table50_4, dupe(uibench.actions.tableFilterBy(table50_4, 4), 5)),
      new uibench.Group('table/[100,2]/filter/4', table100_2, dupe(uibench.actions.tableFilterBy(table100_2, 4), 5)),
      new uibench.Group('table/[50,2]/filter/4', table50_2, dupe(uibench.actions.tableFilterBy(table50_2, 4), 5)),

      new uibench.Group('table/[100,4]/filter/2', table100_4, dupe(uibench.actions.tableFilterBy(table100_4, 2), 5)),
      new uibench.Group('table/[50,4]/filter/2',  table50_4,  dupe(uibench.actions.tableFilterBy(table50_4, 2), 5)),
      new uibench.Group('table/[100,2]/filter/2', table100_2, dupe(uibench.actions.tableFilterBy(table100_2, 2), 5)),
      new uibench.Group('table/[50,2]/filter/2',  table50_2,  dupe(uibench.actions.tableFilterBy(table50_2, 2), 5)),

      new uibench.Group('table/[100,4]/activate/32', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 32), 5)),
      new uibench.Group('table/[50,4]/activate/32', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 32), 5)),
      new uibench.Group('table/[100,2]/activate/32', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 32), 5)),
      new uibench.Group('table/[50,2]/activate/32', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 32), 5)),

      new uibench.Group('table/[100,4]/activate/16', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 16), 5)),
      new uibench.Group('table/[50,4]/activate/16', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 16), 5)),
      new uibench.Group('table/[100,2]/activate/16', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 16), 5)),
      new uibench.Group('table/[50,2]/activate/16', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 16), 5)),

      new uibench.Group('table/[100,4]/activate/8', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 8), 5)),
      new uibench.Group('table/[50,4]/activate/8', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 8), 5)),
      new uibench.Group('table/[100,2]/activate/8', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 8), 5)),
      new uibench.Group('table/[50,2]/activate/8', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 8), 5)),

      new uibench.Group('table/[100,4]/activate/4', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 4), 5)),
      new uibench.Group('table/[50,4]/activate/4', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 4), 5)),
      new uibench.Group('table/[100,2]/activate/4', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 4), 5)),
      new uibench.Group('table/[50,2]/activate/4', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 4), 5)),

      new uibench.Group('table/[100,4]/activate/2', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 2), 5)),
      new uibench.Group('table/[50,4]/activate/2', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 2), 5)),
      new uibench.Group('table/[100,2]/activate/2', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 2), 5)),
      new uibench.Group('table/[50,2]/activate/2', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 2), 5)),

      new uibench.Group('table/[100,4]/activate/1', table100_4, dupe(uibench.actions.tableActivateEach(table100_4, 1), 5)),
      new uibench.Group('table/[50,4]/activate/1', table50_4, dupe(uibench.actions.tableActivateEach(table50_4, 1), 5)),
      new uibench.Group('table/[100,2]/activate/1', table100_2, dupe(uibench.actions.tableActivateEach(table100_2, 1), 5)),
      new uibench.Group('table/[50,2]/activate/1', table50_2, dupe(uibench.actions.tableActivateEach(table50_2, 1), 5)),

      new uibench.Group('anim/100/32', initialAnim, animate(initialAnim, 32, 5)),
      new uibench.Group('anim/100/16', initialAnim, animate(initialAnim, 16, 5)),
      new uibench.Group('anim/100/8', initialAnim, animate(initialAnim, 8, 5)),
      new uibench.Group('anim/100/4', initialAnim, animate(initialAnim, 4, 5)),
      new uibench.Group('anim/100/2', initialAnim, animate(initialAnim, 2, 5)),
      new uibench.Group('anim/100/1', initialAnim, animate(initialAnim, 1, 5)),

      new uibench.Group('tree/[500]/render', initialTree, dupe(tree500, 5)),
      new uibench.Group('tree/[50,10]/render', initialTree, dupe(tree50_10, 5)),
      new uibench.Group('tree/[10,50]/render', initialTree, dupe(tree10_50, 5)),
      new uibench.Group('tree/[5,100]/render', initialTree, dupe(tree5_100, 5)),

      new uibench.Group('tree/[500]/[reverse]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.reverse]), 5)),
      new uibench.Group('tree/[50,10]/[reverse]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.reverse]), 5)),
      new uibench.Group('tree/[10,50]/[reverse]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.reverse]), 5)),
      new uibench.Group('tree/[5,100]/[reverse]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.reverse]), 5)),

      new uibench.Group('tree/[500]/[insertFirst(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.insertFirst(1)]), 5)),
      new uibench.Group('tree/[50,10]/[insertFirst(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.insertFirst(1)]), 5)),
      new uibench.Group('tree/[10,50]/[insertFirst(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.insertFirst(1)]), 5)),
      new uibench.Group('tree/[5,100]/[insertFirst(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.insertFirst(1)]), 5)),

      new uibench.Group('tree/[500]/[insertLast(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.insertLast(1)]), 5)),
      new uibench.Group('tree/[50,10]/[insertLast(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.insertLast(1)]), 5)),
      new uibench.Group('tree/[10,50]/[insertLast(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.insertLast(1)]), 5)),
      new uibench.Group('tree/[5,100]/[insertLast(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.insertLast(1)]), 5)),

      new uibench.Group('tree/[500]/[removeFirst(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.removeFirst(1)]), 5)),
      new uibench.Group('tree/[50,10]/[removeFirst(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.removeFirst(1)]), 5)),
      new uibench.Group('tree/[10,50]/[removeFirst(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.removeFirst(1)]), 5)),
      new uibench.Group('tree/[5,100]/[removeFirst(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.removeFirst(1)]), 5)),

      new uibench.Group('tree/[500]/[removeLast(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.removeLast(1)]), 5)),
      new uibench.Group('tree/[50,10]/[removeLast(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.removeLast(1)]), 5)),
      new uibench.Group('tree/[10,50]/[removeLast(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.removeLast(1)]), 5)),
      new uibench.Group('tree/[5,100]/[removeLast(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.removeLast(1)]), 5)),

      new uibench.Group('tree/[500]/[moveFromEndToStart(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
      new uibench.Group('tree/[50,10]/[moveFromEndToStart(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
      new uibench.Group('tree/[10,50]/[moveFromEndToStart(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),
      new uibench.Group('tree/[5,100]/[moveFromEndToStart(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.moveFromEndToStart(1)]), 5)),

      new uibench.Group('tree/[500]/[moveFromStartToEnd(1)]', tree500, dupe(uibench.actions.treeTransform(tree500, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
      new uibench.Group('tree/[50,10]/[moveFromStartToEnd(1)]', tree50_10, dupe(uibench.actions.treeTransform(tree50_10, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
      new uibench.Group('tree/[10,50]/[moveFromStartToEnd(1)]', tree10_50, dupe(uibench.actions.treeTransform(tree10_50, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5)),
      new uibench.Group('tree/[5,100]/[moveFromStartToEnd(1)]', tree5_100, dupe(uibench.actions.treeTransform(tree5_100, [uibench.tree_transformers.moveFromStartToEnd(1)]), 5))
    ];
  }

  return {'disableSCU': uibench.disableSCU};
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