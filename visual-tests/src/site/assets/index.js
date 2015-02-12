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


        // Tag filtering
        var filteredTags = d3.set();
        var tagsCheckboxes = d3.selectAll('#tags input[type=checkbox]').property('checked', false);
        // Bind the data-tags attributes to the tests
        var tests = d3.selectAll('#tests > article')
            .datum(function() {
                return this.dataset.tags.split(',');
            });

        var tagFilterChange = function() {
            var tag = this.value;
            var element = d3.select(this.parentNode);

            // Filtered tags contains every tag selected by the user
            if (this.checked) {
                element.classed('active', true);
                filteredTags.add(tag);
            } else {
                element.classed('active', false);
                filteredTags.remove(tag);
            }

            if (filteredTags.empty()) {
                // No tags have been selected, so list all tests
                tests.style('display', 'block');
            } else {
                // Check every test's tags
                tests.each(function(d) {
                    var test = d3.select(this);
                    var tags = d3.set(d);

                    // If the test doesn't contain every tag in filteredTags, hide it;
                    // otherwise, display it
                    var display = 'block';
                    filteredTags.forEach(function(value) {
                        if (!tags.has(value)) {
                            display = 'none';
                        }
                    });
                    test.style('display', display);
                });
            }
        };

        tagsCheckboxes.on('change', tagFilterChange);
    });

}(d3));