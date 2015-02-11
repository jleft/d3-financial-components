(function(d3) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // TODO: Tidy this...

        // Use local storage to track if the iframes should be shown
        var visualsDisplay = localStorage.getItem('visuals-display');
        if (visualsDisplay === null) {
            localStorage.setItem('visuals-display', 'block');
        }

        var visualsCheckbox = d3.select('#visuals-toggle-check');

        // Init checkbox and iframes
        var checked = visualsDisplay === 'none' ? false : true;
        visualsCheckbox.property('checked', checked);
        d3.selectAll('iframe').style('display', visualsDisplay);

        // Allow iframes' display to be toggled between shown and hidden
        visualsCheckbox.on('change', function() {
            var display = this.checked ? 'block' : 'none';
            localStorage.setItem('visuals-display', display);
            d3.selectAll('iframe')
                .style('display', display);
        });

        // Only show the option to toggle the iframes display once the script has loaded
        d3.select('#visuals-toggle')
            .style('visibility', 'visible');
    });

}(d3));