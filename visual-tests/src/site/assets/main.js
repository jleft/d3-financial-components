(function(d3) {
    'use strict';

    // Allow iframes' display to be toggled between shown and hidden
    d3.select('#displayExamples').on('change', function() {
        var display = this.checked ? 'block' : 'none';
        d3.selectAll('iframe')
            .style('display', display);
    });

    // Only show the option to toggle the iframes display once the script has loaded
    d3.select('#menu-option')
        .style('visibility', 'visible');
}(d3));