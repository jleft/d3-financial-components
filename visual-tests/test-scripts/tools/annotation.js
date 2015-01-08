(function(d3, fc) {
    'use strict';

    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#annotation'),
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

    // Create the annotations
    var annotation100 = fc.tools.annotation()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(100)
        .yLabel('Annotation 1');

    var annotation102 = fc.tools.annotation()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(102)
        .padding(10)
        .yLabel('Annotation with more padding');

    var annotationDecimal = fc.tools.annotation()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(100.675)
        .yLabel('Another annotation')
        .formatCallout(function(d) { return d3.format('.3f')(d); })
        .index(1);

    // Add it to the chart
    chartLayout.getPlotArea().call(annotation100);
    chartLayout.getPlotArea().call(annotation102);
    chartLayout.getPlotArea().call(annotationDecimal);

})(d3, fc);