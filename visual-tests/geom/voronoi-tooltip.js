(function(d3, fc) {
    'use strict';

    var data = {
        series: fc.data.random.financial().startDate(new Date(2014, 1, 1))(50),
        tooltip: []
    };

    var width = 600, height = 250;

    var container = d3.select('#voronoi')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields('date').pad(0.05)(data.series))
        .range([0, width]);

    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low']).pad(0.05)(data.series))
        .range([height, 0]);

    var voronoiComputer = fc.geom.algorithm.voronoi()
        .x(function(d) { return dateScale(d.date); })
        .y(function(d) { return priceScale(d.close); })
        .clipExtent([
            [0, 0],
            [width, height]
        ]);
    voronoiComputer(data.series);

    var point = fc.series.point()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; });

    var colour = d3.scale.category10();
    var voronoiRenderer = fc.geom.renderer.voronoi()
        .decorate(function(path) {
            path.enter().on('mouseenter', function(d, i) {
                d3.select(this)
                  .style('stroke', 'black')
                  .style('fill', function() { return colour(i); })
                  .style('fill-opacity', 0.5);
                data.tooltip = [d];
                render();
            }).on('mouseleave', function() {
                d3.select(this)
                    .style('stroke', null)
                    .style('fill', null)
                    .style('fill-opacity', null);
                data.tooltip = [];
                render();
            });

        });

    var tooltip = fc.chart.tooltip()
        .items([
            [function(d) { return d3.time.format('%A, %b %e')(d.date); }, ''],
            ['Price', function(d) { return d3.format('.2f')(d.close); }]
        ]);

    var tooltipLayout = fc.layout.rectangles()
        .position([10, 10])
        .size([100, 35])
        .component(tooltip);

    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([point, voronoiRenderer, tooltipLayout])
        .mapping(function(series) {
            switch (series) {
            case point:
            case voronoiRenderer:
                return this.series;
            case tooltipLayout:
                return this.tooltip;
            }
        });

    function render() {
        container.datum(data)
            .call(multi);
    }
    render();

})(d3, fc);
