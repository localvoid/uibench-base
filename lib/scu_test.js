goog.provide('uibench.scu_test');
goog.require('uibench.actions');
goog.require('uibench.state');

/**
 * @param {!function(!uibench.state.AppState, string)} onUpdate
 * @param {!function(boolean)} onFinish
 */
uibench.scu_test.run = function(onUpdate, onFinish) {
  var node;
  var state = new uibench.state.AppState(
      'table',
      new uibench.state.HomeState(),
      uibench.state.TableState.create(1, 1),
      uibench.state.AnimState.create(0),
      uibench.state.TreeState.create([0])
  );

  state.table.items[0].props[0] = 'a';
  onUpdate(state, 'init');
  node = /** @type {Element} */(document.getElementsByClassName('TableCell')[1]);
  if (!node || node.textContent !== 'a') {
    throw new Error('SCU test failed');
  }
  state.table.items[0].props[0] = 'b';
  onUpdate(state, 'update');
  node = /** @type {Element} */(document.getElementsByClassName('TableCell')[1]);
  if (!node) {
    throw new Error('SCU test failed');
  }

  var result = true;
  if (node.textContent !== 'a') {
    if (node.textContent === 'b') {
      result = false;
    } else {
      throw new Error('SCU test failed');
    }
  }

  window.requestAnimationFrame(function() {
    onFinish(result);
  });
};
