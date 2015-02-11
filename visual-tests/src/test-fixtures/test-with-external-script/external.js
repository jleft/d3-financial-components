(function(d3, fc) {
    'use strict';

    d3.select('#test')
        .append('p')
        .text('This is added through an external script...')
        .style('color', 'white')
        .style('background-color', 'black');

})(d3, fc);