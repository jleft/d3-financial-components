(function(d3, $) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // TODO: Tidy this...

        // Tag filtering
        var filteredTags = d3.set();
        var tagsCheckboxes = d3.selectAll('#tags input[type=checkbox]').property('checked', false);
        // Bind the data-tags attributes to the tests
        var tests = d3.selectAll('#tests > article')
            .datum(function() {
                return this.dataset;
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
                    var tags = d3.set(d.tags.split(','));

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

        $('#tags label').on('click', function() {
            console.log('change');
        });

        tagsCheckboxes.on('change', tagFilterChange);

    });

}(d3));
