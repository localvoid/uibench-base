goog.provide('uibench.spec_tests');
goog.require('uibench.actions');
goog.require('uibench.state');

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 */
uibench.spec_tests.run = function(onUpdate) {
  var state = new uibench.state.AppState(
      'table',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(0, 0),
      uibench.state.AnimState.create(0),
      uibench.state.TreeState.create([0])
  );
  onUpdate(state, 'init');
  var mainTag = document.getElementsByClassName('Main');
  if (mainTag.length !== 1) {
    throw new Error('Spec test failed: div tag with Main className doesn\'t exists');
  }

  uibench.spec_tests.run_table_tests(onUpdate);
  uibench.spec_tests.run_anim_tests(onUpdate);
  uibench.spec_tests.run_tree_tests(onUpdate);
};

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 */
uibench.spec_tests.run_table_tests = function(onUpdate) {
  var state = new uibench.state.AppState(
      'table',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(2, 2),
      uibench.state.AnimState.create(0),
      uibench.state.TreeState.create([0])
  );
  state.table.items[0].id = 300;
  state.table.items[1].id = 301;
  onUpdate(state, 'update');
  var table = document.getElementsByClassName('Table');
  if (table.length !== 1) {
    throw new Error('Spec test failed: table with Table className doesn\'t exists');
  }
  var rows = document.getElementsByClassName('TableRow');
  if (rows.length !== 2) {
    throw new Error('Spec test failed: invalid number of TableRows');
  }
  if (/** @type {Element} */(rows[0]).getAttribute('data-id') !== '300') {
    throw new Error('Spec test failed: invalid data-id attribute in the TableRow');
  }

  var cells = document.getElementsByClassName('TableCell');
  if (cells.length !== 6) {
    throw new Error('Spec test failed: invalid number of TableCells');
  }
  if (/** @type {Element} */(cells[0]).textContent !== '#300') {
    throw new Error('Spec test failed: invalid textContent in the id TableCell');
  }
  if (/** @type {Element} */(cells[1]).textContent !== '0') {
    throw new Error('Spec test failed: invalid textContent in the data TableCell');
  }
  if (/** @type {Element} */(cells[2]).textContent !== '3') {
    throw new Error('Spec test failed: invalid textContent in the data TableCell');
  }
  var logFn = console.log;
  var clicked = false;
  console.log = function() {
    clicked = true;
  };
  /** @type {Element} */(cells[1]).click();
  console.log = logFn;
  if (clicked === false) {
    throw new Error('Spec test failed: TableCell doesn\'t have onClick event listener that prints to the console');
  }
};

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 */
uibench.spec_tests.run_anim_tests = function(onUpdate) {
  var state = new uibench.state.AppState(
      'anim',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(0, 0),
      uibench.state.AnimState.create(2),
      uibench.state.TreeState.create([0])
  );
  state.anim.items[0].id = 100;
  state.anim.items[1].id = 101;
  state = uibench.actions.animAdvanceEach(state, 2);
  onUpdate(state, 'update');
  var anim = document.getElementsByClassName('Anim');
  if (anim.length !== 1) {
    throw new Error('Spec test failed: div with Anim className doesn\'t exists');
  }
  var boxes = document.getElementsByClassName('AnimBox');
  if (boxes.length !== 2) {
    throw new Error('Spec test failed: invalid number of AnimBoxes');
  }
  if (/** @type {Element} */(boxes[0]).getAttribute('data-id') !== '100') {
    throw new Error('Spec test failed: invalid data-id attribute in the AnimBox');
  }
  if (/** @type {Element} */(boxes[0]).style.borderRadius !== '1px') {
    throw new Error('Spec test failed: invalid borderRadius style in the AnimBox');
  }
  if (/** @type {Element} */(boxes[1]).style.borderRadius !== '0px') {
    throw new Error('Spec test failed: invalid borderRadius style in the AnimBox');
  }
  if (!/** @type {Element} */(boxes[0]).style.background) {
    throw new Error('Spec test failed: invalid background style in the AnimBox');
  }
};

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 */
uibench.spec_tests.run_tree_tests = function(onUpdate) {
  var state = new uibench.state.AppState(
      'tree',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(0, 0),
      uibench.state.AnimState.create(0),
      uibench.state.TreeState.create([1, 2])
  );
  state.tree.root.children[0].children[0].id = '2081';
  state.tree.root.children[0].children[1].id = '2082';
  onUpdate(state, 'update');
  var tree = document.getElementsByClassName('Tree');
  if (tree.length !== 1) {
    throw new Error('Spec test failed: div with Tree className doesn\'t exists');
  }
  var treeNodes = document.getElementsByClassName('TreeNode');
  if (treeNodes.length !== 2) {
    throw new Error('Spec test failed: invalid number of TreeNodes');
  }

  var treeLeafs = document.getElementsByClassName('TreeLeaf');
  if (treeLeafs.length !== 2) {
    throw new Error('Spec test failed: invalid number of TreeLeafs');
  }
  if (/** @type {Element} */(treeLeafs[0]).textContent !== '2081') {
    throw new Error('Spec test failed: invalid textContent in the TreeLeaf');
  }
  if (/** @type {Element} */(treeLeafs[1]).textContent !== '2082') {
    throw new Error('Spec test failed: invalid textContent in the TreeLeaf');
  }
};
