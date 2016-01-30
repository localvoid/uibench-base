goog.provide('uibench.Executor');
goog.require('uibench.Group');

/**
 * Benchmark Executor
 *
 * @param {number} iterations
 * @param {Array<!uibench.Group>} groups
 * @param {function(!uibench.state.AppState, string=, {disableSCU: boolean}=)} onUpdate
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
  this._state = 'init';
  this._currentGroup = 0;
  this._currentGroupState = 0;
  this._currentIteration = 0;
  this._iter = this._iter.bind(this);

  this._options = {
    'disableSCU': uibench.disableSCU
  };
};

/**
 * @private
 */
uibench.Executor.prototype._iter = function() {
  var group;
  if (this._state === 'init') {
    group = this.groups[this._currentGroup];
    this.onUpdate(group.from, 'init', this._options);
    this._state = 'update';
    //this._iter();
    //setTimeout(this._iter, 0);
    requestAnimationFrame(this._iter);
  } else if (this._state === 'update') {
    group = this.groups[this._currentGroup];

    var t = window.performance.now();
    this.onUpdate(group.to[this._currentGroupState++], 'update', this._options);
    t = window.performance.now() - t;

    var samples = this._samples[group.name];
    if (samples === void 0) {
      samples = this._samples[group.name] = [];
    }
    samples.push(t);

    this._state = 'init';
    if (this._currentGroupState < group.to.length) {
      //this._iter();
      //setTimeout(this._iter, 0);
      requestAnimationFrame(this._iter);
    } else {
      this._currentGroup++;
      if (this._currentGroup < this.groups.length) {
        this._currentGroupState = 0;
        //setTimeout(this._iter, 0);
        requestAnimationFrame(this._iter);
      } else {
        this._currentIteration++;
        if (this._currentIteration < this.iterations) {
          this._currentGroup = 0;
          this._currentGroupState = 0;
          //setTimeout(this._iter, 0);
          requestAnimationFrame(this._iter);
        } else {
          this.onFinish(this._samples);
        }
      }
    }
  }
};

/**
 * Run
 */
uibench.Executor.prototype.run = function() {
  this._iter();
};
