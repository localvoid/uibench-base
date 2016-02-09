goog.provide('uibench.run');
goog.require('uibench.Executor');
goog.require('uibench.init');
goog.require('uibench.recycling_test');
goog.require('uibench.scu_test');

/**
 * @param {function(!uibench.state.AppState)} onUpdate
 * @param {function(Object<string, Array<number>>)} onFinish
 * @param {string=} filter
 */
uibench.run = function(onUpdate, onFinish, filter) {
  uibench.scu_test.run(onUpdate, function(scuSupported) {
    uibench.recycling_test.run(onUpdate, function(recyclingEnabled) {
      var tests = uibench.tests;
      var name = uibench.name;
      if (recyclingEnabled) {
        name += '+r';
      }
      if (scuSupported && !uibench.disableSCU) {
        name += '+s';
      }

      if (filter !== void 0) {
        var filteredTests = [];
        for (var i = 0; i < tests.length; i++) {
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
              'name': name,
              'version': uibench.version,
              'samples': samples
            }
          }, '*');
        }
      });
      e.run();
    });
  });
};