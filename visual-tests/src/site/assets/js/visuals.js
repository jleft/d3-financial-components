(function(d3) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        var tests = d3.selectAll('#tests > article')
            .datum(function() {
                return this.dataset;
            });

        // iframe...
        var showTestVisuals = function() {
            tests.each(function(d) {
                var test = d3.select(this);
                test = test.selectAll('iframe').data([0]);
                test.enter().append('iframe');
                test.exit().remove();
                test.attr('src', d.visuals);
            });
        };

        var hideTestVisuals = function() {
            tests.selectAll('iframe').remove();
        };

        // Use local storage to track if the iframes should be shown
        var visualsDisplay = localStorage.getItem('visuals-display');
        if (visualsDisplay === null) {
            localStorage.setItem('visuals-display', 'true');
        }

        var visualsCheckbox = d3.select('#visuals-toggle-check');

        // Init checkbox and iframes

        if (visualsDisplay === 'true') {
            showTestVisuals();
            visualsCheckbox.property('checked', 'checked');
        } else {
            hideTestVisuals();
            visualsCheckbox.property('checked', '');
        }

        // Allow iframes' display to be toggled between shown and hidden
        visualsCheckbox.on('change', function() {
            var show = this.checked ? 'true' : 'false';
            localStorage.setItem('visuals-display', show);

            if (show === 'true') {
                showTestVisuals();
            } else {
                hideTestVisuals();
            }
        });

        // Only show the option to toggle the iframes display once the script has loaded
        d3.select('#visuals-toggle')
            .style('visibility', 'visible');

    });

}(d3));
