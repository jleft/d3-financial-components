(function(d3, fc) {
    'use strict';

    fc.utilities.resizeDispatcher = function() {

        var chartLayout;


        var resize = function() {
            fc.utilities.dispatch.on('resize.resize', function() {
                console.log(chartLayout.height());
            });
        };

        resize.chartLayout = function(value) {
            if (!arguments.length) {
                return chartLayout;
            }
            chartLayout = value;
            return resize;
        };

        return resize;
    };
}(d3, fc));