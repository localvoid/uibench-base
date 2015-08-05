goog.provide('uibench.tree_transformers');
goog.require('uibench.state');

/**
 * Skip Transformation
 *
 * @param {Array} children
 * @return {!Array<!uibench.state.TreeNodeState>}
 */
uibench.tree_transformers.skip = function(children) {
  return children.slice();
};

/**
 * Reverse Transformation
 *
 * @param {Array} children
 * @return {!Array<!uibench.state.TreeNodeState>}
 */
uibench.tree_transformers.reverse = function(children) {
  var r = children.slice();
  r.reverse();
  return r;
};

/**
 * Insert n nodes at the beginning
 *
 * @param {number} n
 * @return {Function}
 */
uibench.tree_transformers.insertFirst = function(n) {
  /**
   * @param {Array} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.unshift(new uibench.state.TreeNodeState(false, null));
    }
    return children;
  }

  return ret;
};

/**
 * Insert n nodes at the end
 *
 * @param {number} n
 * @return {Function}
 */
uibench.tree_transformers.insertLast = function(n) {
  /**
   * @param {Array} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.push(new uibench.state.TreeNodeState(false, null));
    }
    return children;
  }

  return ret;
};

/**
 * Remove n nodes from the beginning
 *
 * @param {number} n
 * @returns {Function}
 */
uibench.tree_transformers.removeFirst = function(n) {
  /**
   * @param {Array} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.shift();
    }
    return children;
  }

  return ret;
};

/**
 * Remove n nodes from the end
 *
 * @param {number} n
 * @returns {Function}
 */
uibench.tree_transformers.removeLast = function(n) {
  /**
   * @param {Array} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.pop();
    }
    return children;
  }

  return ret;
};

/**
 * Move n nodes from the end to the beginning
 *
 * @param {number} n
 * @return {Function}
 */
uibench.tree_transformers.moveFromEndToStart = function(n) {
  /**
   * @param {!Array<!uibench.state.TreeNodeState>} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.unshift(children.pop());
    }
    return children;
  }

  return ret;
};

/**
 * Move n nodes from the beginning to the end
 *
 * @param {number} n
 * @return {function(!Array<!uibench.state.TreeNodeState>):!Array<!uibench.state.TreeNodeState>}
 */
uibench.tree_transformers.moveFromStartToEnd = function(n) {
  /**
   * @param {!Array<!uibench.state.TreeNodeState>} children
   * @return {!Array<!uibench.state.TreeNodeState>}
   */
  function ret(children) {
    children = children.slice();
    for (var i = 0; i < n; i++) {
      children.push(children.shift());
    }
    return children;
  }
  return ret;
};
