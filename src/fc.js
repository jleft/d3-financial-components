(function() {
    'use strict';

    // Needs to be defined like this so that the grunt task can update it
    var version = '0.1.1';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.fc = {
        version: version,
        charts: {},
        indicators: {
            algorithms: {}
        },
        scale: {
            discontinuity: {}
        },
        series: {},
        svg: {},
        tools: {},
        utilities: {}
    };
}());
