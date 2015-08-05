goog.provide('uibench.Group');
goog.require('uibench.state');

/**
 * Group of state transitions
 *
 * @param {string} name
 * @param {!uibench.state.AppState} from
 * @param {!Array<!uibench.state.AppState>} to
 * @constructor
 * @struct
 * @final
 */
uibench.Group = function(name, from, to) {
  this.name = name;
  this.from = from;
  this.to = to;
};
