goog.provide('uibench.run');
goog.require('uibench.Executor');
goog.require('uibench.init');

/**
 * @param {function(!uibench.state.AppState)} onUpdate
 * @param {function(Object<string, Array<number>>)} onFinish
 */
uibench.run = function(onUpdate, onFinish) {
  var e = new uibench.Executor(uibench.iterations, uibench.tests, onUpdate, function(samples) {
    onFinish(samples);
    if (uibench.report) {
      window.opener.postMessage({
        'type': 'report',
        'data': {
          'name': uibench.name,
          'version': uibench.version,
          'samples': samples
        }
      }, '*');
    }
  });
  e.run();
};