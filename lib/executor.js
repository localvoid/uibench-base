goog.provide('uibench.Executor');
goog.require('uibench.Group');

/**
 * Benchmark Executor
 *
 * @param {number} iterations
 * @param {Array<!uibench.Group>} groups
 * @param {function(!uibench.state.AppState)} onUpdate
 * @param {function(Object<string, Array<number>>)} onFinish
 * @constructor
 * @struct
 * @final
 */
uibench.Executor = function(iterations, groups, onUpdate, onFinish) {
  this.iterations = iterations;
  this.groups = groups;
  this.onUpdate = onUpdate;
  this.onFinish = onFinish;

  /**
   * @type {Object<string, Array<number>>}
   * @private
   */
  this._samples = {};
  this._currentGroup = 0;
  this._currentGroupState = -1;
  this._currentIteration = 0;
  this._iter = this._iter.bind(this);
};

/**
 * @private
 */
uibench.Executor.prototype._iter = function() {
  if (this._currentGroupState === -1) {
    this.onUpdate(this.groups[this._currentGroup].from);
    this._currentGroupState++;
    setTimeout(this._iter, 0);
  } else if (this._currentGroupState < this.groups[this._currentGroup].to.length) {
    var group = this.groups[this._currentGroup];

    this.onUpdate(group.from);

    var t = window.performance.now();
    this.onUpdate(group.to[this._currentGroupState]);
    t = window.performance.now() - t;

    var samples = this._samples[group.name];
    if (samples === void 0) {
      samples = this._samples[group.name] = [];
    }
    samples.push(t);

    this._currentGroupState++;
    setTimeout(this._iter, 0);
  } else {
    this._currentGroup++;
    this._currentGroupState = -1;
    if (this._currentGroup < this.groups.length) {
      this._iter();
    } else if (this._currentIteration < (this.iterations - 1)) {
      this._currentGroup = 0;
      this._currentIteration++;
      this._iter();
    } else {
      this.onFinish(this._samples);
    }
  }
};

/**
 * Run
 */
uibench.Executor.prototype.run = function() {
  this._iter();
};
