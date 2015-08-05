goog.provide('uibench.actions');
goog.require('uibench.state');

/**
 * Switch To different location
 *
 * @param {!uibench.state.AppState} state
 * @param {string} location
 * @return {!uibench.state.AppState}
 */
uibench.actions.switchTo = function(state, location) {
  if (state.location === location) {
    return state;
  } else {
    return new uibench.state.AppState(
        location,
        state.home,
        state.table,
        state.anim,
        state.tree
    );
  }
};

/**
 * Filter table
 *
 * @param {!uibench.state.AppState} state
 * @param {?number} nth
 * @return {!uibench.state.AppState}
 */
uibench.actions.tableFilterBy = function(state, nth) {
  return new uibench.state.AppState(
      state.location,
      state.home,
      new uibench.state.TableState(nth, state.table.sort, state.table.items),
      state.anim,
      state.tree
  );
};

/**
 * Sort table
 *
 * @param {!uibench.state.AppState} state
 * @param {?number} i
 * @return {!uibench.state.AppState}
 */
uibench.actions.tableSortBy = function(state, i) {
  return new uibench.state.AppState(
      state.location,
      state.home,
      new uibench.state.TableState(state.table.filter, i, state.table.items),
      state.anim,
      state.tree
  );
};

/**
 * Activate each nth item in table
 *
 * @param {!uibench.state.AppState} state
 * @param {?number} nth
 * @return {!uibench.state.AppState}
 */
uibench.actions.tableActivateEach = function(state, nth) {
  var items = state.table.items;
  var newItems = [];
  for (var i = 0; i < items.length; i++) {
    if (i % nth == 0) {
      newItems.push(new uibench.state.TableItemState(items[i].id, true, items[i].props));
    } else {
      newItems.push(items[i]);
    }
  }

  return new uibench.state.AppState(
      state.location,
      state.home,
      new uibench.state.TableState(state.table.filter, state.table.sort, newItems),
      state.anim,
      state.tree
  );
};

/**
 * Activate each nth item in table
 *
 * @param {!uibench.state.AppState} state
 * @param {?number} nth
 * @return {!uibench.state.AppState}
 */
uibench.actions.animAdvanceEach = function(state, nth) {
  var items = state.anim.items;

  var newItems = [];
  for (var i = 0; i < items.length; i++) {
    if (i % nth == 0) {
      newItems.push(new uibench.state.AnimBoxState(items[i].id, items[i].time + 1));
    } else {
      newItems.push(items[i]);
    }
  }

  return new uibench.state.AppState(
      state.location,
      state.home,
      state.table,
      new uibench.state.AnimState(newItems),
      state.tree
  );
};

/**
 * Create Tree hierarchy
 *
 * @param {!uibench.state.AppState} state
 * @param {!Array<number>} hierarchy
 * @return {!uibench.state.AppState}
 */
uibench.actions.treeCreate = function(state, hierarchy) {
  return new uibench.state.AppState(
      state.location,
      state.home,
      state.table,
      state.anim,
      uibench.state.TreeState.create(hierarchy)
  );
};

/**
 * Transform Tree
 * @param {!uibench.state.AppState} state
 * @param {!Array<!function(Array<!uibench.state.TreeNodeState>): !Array<!uibench.state.TreeNodeState>>} transformers
 * @return {!uibench.state.AppState}
 */
uibench.actions.treeTransform = function(state, transformers) {
  /**
   *
   * @param {!uibench.state.TreeNodeState} node
   * @param {number} depth
   * @return {!uibench.state.TreeNodeState}
   */
  function transform(node, depth) {
    var t = transformers[depth];
    var children = t(node.children);
    if (depth < (transformers.length - 1)) {
      for (var i = 0; i < children.length; i++) {
        children[i] = transform(children[i], depth + 1);
      }
    }
    return new uibench.state.TreeNodeState(node.id, node.container, children);
  }
  return new uibench.state.AppState(
      state.location,
      state.home,
      state.table,
      state.anim,
      new uibench.state.TreeState(transform(state.tree.root, 0))
  );
};
