(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#crosshairs'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(ohlc);

    // Create an invisible overlay
    var overlay = d3.svg.area()
      .x(function(d) { return dateScale(d.date); })
      .y0(0)
      .y1(chartLayout.getPlotAreaHeight());

    // Create the crosshairs
    var crosshairs = fc.tools.crosshairs()
        .target(chartLayout.getPlotArea())
        .series(data)
        .xScale(dateScale)
        .yScale(priceScale)
        .formatH(function(data) { return crosshairs.highlightedField() + ': ' + d3.format('.1f')(data); })
        .formatV(function(data) { return d3.time.format('%b %e')(data); });

    // Add the crosshairs on top of the overlay
    chart.plotArea.append('path')
        .attr('class', 'overlay')
        .attr('d', overlay(data))
        .call(crosshairs);

})(d3, fc);