(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345');

    var data = dataGenerator.generate(50);

    var chart = d3.select('#indicators-combined'),
        chartLayout = fc.utilities.chartLayout(),
        chartBuilder = fc.utilities.chartBuilder(chartLayout);

    chart.call(chartBuilder);

    var plotArea = chartLayout.getPlotArea();

    // Create scale for x axis
    var dateScale = d3.time.scale()
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
        .orient('bottom');

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right');

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    // plotArea.append('g')
    //     .attr('class', 'series')
    //     .datum(data)
    //     .call(ohlc);

    // Create the Bollinger bands component
    var bollinger = fc.indicators.bollingerBands()
        .xScale(dateScale)
        .yScale(priceScale)
        .movingAverage(4)
        .standardDeviations(2);

    // Add it to the chart
    // plotArea.append('g')
    //     .attr('class', 'bollinger-band')
    //     .datum(data)
    //     .call(bollinger);

    // Create the moving average component
    var movingAverage = fc.indicators.movingAverage()
        .xScale(dateScale)
        .yScale(priceScale)
        .averagePoints(10);

    // Add it to the chart
    // plotArea
    //     .datum(data)
    //     .call(movingAverage);

    // Add the axes to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('right', priceAxis);

    // Add components to plot area
    chartBuilder.addToPlotArea([movingAverage]);

    // Set data and render
    chartBuilder.setData(data);
    chartBuilder.render();

    // Create the RSI chart
    var rsiChart = d3.select('#indicators-combined-rsi'),
        rsiLayout = fc.utilities.chartLayout().height(150);

    rsiChart.call(rsiLayout);

    // Create RSI scale for y axis
    var percentageScale = fc.scale.linear()
        .domain([0, 100]) // Perctange scale
        .range([rsiLayout.getPlotAreaHeight(), 0])
        .nice();

    rsiLayout.getAxisContainer('bottom').call(dateAxis);

    // Create the RSI component
    var rsi = fc.indicators.rsi()
        .xScale(dateScale)
        .yScale(percentageScale)
        .lambda(0.94);

    // Add it to the chart
    rsiLayout.getPlotArea().append('g')
        .attr('class', 'rsi')
        .datum(data)
        .call(rsi);

    // Update the charts for new data
    function update() {
        function updateChart() {
            // Update scales
            dateScale.domain(fc.utilities.extent(data, 'date'))
                .range([0, chartLayout.getPlotAreaWidth()]);
            priceScale.domain(fc.utilities.extent(data, ['high', 'low']))
                .range([chartLayout.getPlotAreaHeight(), 0]);
            chartBuilder.setData(data);
            chartBuilder.render();
        }

        function updateRSI() {
            // Create the RSI component
            var rsi = fc.indicators.rsi()
                .xScale(dateScale);
            rsiLayout.getPlotArea().select('.rsi')
                .datum(data)
                .call(rsi);
            rsiLayout.getAxisContainer('bottom').call(dateAxis);
        }

        data.push(dataGenerator.generate(1)[0]);
        data.shift();
        updateChart();
        updateRSI();
    }

    setInterval(update, 1000);

})(d3, fc);