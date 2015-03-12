(function(d3) {
    'use strict';

    /**
     * A naive approach for searching
     */
    var index = d3.map();
    var tests = d3.selectAll('#tests > article');

    // TODO add tags to terms!
    tests.each(function() {
        var test = d3.select(this);
        var terms = test.selectAll('h2').select('a').text() + ' ' + test.selectAll('p').text();
        terms = terms.trim().toLowerCase();
        index.set(test.attr('id'), terms);
    });

    function search(term) {
        term = term.trim().toLowerCase();
        index.forEach(function(key, value) {
            var terms = index.get(key);
            var test = d3.select('#' + key);
            if (terms.indexOf(term) > -1) {
                test.style('display', 'block');
            } else {
                test.style('display', 'none');
            }
        });
    }

    d3.select().on('click', function() {
        // Button click
    });

    d3.select('#search').on('input', function() {
        search(this.value);
    });

}(d3));
