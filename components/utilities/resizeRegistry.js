(function(d3, fc) {
    'use strict';

    fc.utilities.resizeRegistry = function() {

        var resize = function() { };

        fc.utilities.dispatch.on('resize.resize', function() {
            console.log('resize');
        });

        resize.marginTop = function(value) {
            if (!arguments.length) {

            }
            return resize;
        };

        return resize;
    };
}(d3, fc));