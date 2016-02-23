(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#voronoi')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields('date').pad(0.05)(data))
        .range([0, width]);

    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low']).pad(0.05)(data))
        .range([height, 0]);

    var voronoiComputer = fc.geom.algorithm.voronoi()
        .x(function(d) { return dateScale(d.date); })
        .y(function(d) { return priceScale(d.close); })
        .clipExtent([
            [0, 0],
            [width, height]
        ]);
    voronoiComputer(data);

    var point = fc.series.point()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; });

    var colour = d3.scale.category10();
    var voronoiRenderer = fc.geom.renderer.voronoi()
        .decorate(function(path) {
            path.style({
                'fill': function(d, i) { return colour(i); },
                'fill-opacity': 0.5
            });
        });

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([point, voronoiRenderer]);

    container.datum(data)
        .call(multi);

})(d3, fc);
