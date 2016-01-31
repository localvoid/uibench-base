goog.provide('uibench.recycling_test');
goog.require('uibench.actions');
goog.require('uibench.state');

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 * @param {!function(boolean)} onFinish
 */
uibench.recycling_test.run = function(onUpdate, onFinish) {
  var initialState = new uibench.state.AppState(
      'tree',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(0, 0),
      uibench.state.AnimState.create(uibench.mobile ? 30 : 100),
      uibench.state.TreeState.create([0])
  );
  var toState = uibench.actions.treeCreate(initialState, [1]);

  onUpdate(initialState, 'init');
  onUpdate(toState, 'update');
  /** @type {Element} */
  var a = document.getElementsByClassName('TreeLeaf')[0];
  onUpdate(initialState, 'init');
  onUpdate(toState, 'update');
  /** @type {Element} */
  var b = document.getElementsByClassName('TreeLeaf')[0];

  if (!a || !b) {
    console.error('recycling test failed');
  }
  var result = (a === b);

  window.requestAnimationFrame(function() {
    onFinish(result);
  });
};