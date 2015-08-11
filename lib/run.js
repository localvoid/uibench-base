goog.provide('uibench.run');
goog.require('uibench.Executor');
goog.require('uibench.init');

/**
 * @param {function(!uibench.state.AppState)} onUpdate
 * @param {function(Object<string, Array<number>>)} onFinish
 * @param {string=} filter
 */
uibench.run = function(onUpdate, onFinish, filter) {
  var tests = uibench.tests;
  if (filter !== void 0) {
    var filteredTests = tests;
    for (var i = 0; i < uibench.tests; i++) {
      var test = tests[i];
      if (test.name.indexOf(filter) !== -1) {
        filteredTests.push(test);
      }
    }
    tests = filteredTests;
  }

  var e = new uibench.Executor(uibench.iterations, tests, onUpdate, function(samples) {
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