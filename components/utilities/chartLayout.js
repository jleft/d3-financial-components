(function(d3, fc) {
    'use strict';

    /**
    * Based on the [Margin Convention]{@link http://bl.ocks.org/mbostock/3019563},
    * the Chart Layout component is responsible for defining the chart area.
    *
    * It attempts to simplify the repetitive process of constructing the chart's layout and associated elements:
    * <ul>
    *   <li>Define the margins, height and width</li>
    *   <li>Calculate the inner height and inner width</li>
    *   <li>Create an SVG</li>
    *   <li>Create a group for all chart elements; translate it based on the margins</li>
    *   <li>Create a clipping path for the plot area; add it to the group</li>
    *   <li>Create groups for the axes</li>
    * </ul>
    * Given a div:
    * <pre><code>
    * &lt;div id=&quot;chart&quot;&gt;&lt;/div&gt;
    * </pre></code>
    *
    * The following code:
    * <pre><code>
    * // Setup the chart layout
    * var layout = fc.utilities.chartLayout();
    *
    * // Setup the chart
    * var setupArea = d3.select('#chart')
    *     .call(layout);
    * </code></pre>
    *
    * Will produce the following elements:
    * <pre><code>
    * &lt;div id=&quot;chart&quot;&gt;
    *     &lt;svg width=&quot;1330&quot; height=&quot;440&quot;&gt;
    *         &lt;g class=&quot;chartArea&quot; transform=&quot;translate(20,20)&quot;&gt;
    *             &lt;defs&gt;
    *                 &lt;clipPath id=&quot;plotAreaClip&quot;&gt;
    *                     &lt;rect width=&quot;1290&quot; height=&quot;400&quot;&gt;&lt;/rect&gt;
    *                 &lt;/clipPath&gt;
    *             &lt;/defs&gt;
    *             &lt;rect class=&quot;background&quot; width=&quot;1290&quot; height=&quot;400&quot;&gt;&lt;/rect&gt;
    *             &lt;g clip-path=&quot;url(#plotAreaClip)&quot; class=&quot;plotArea&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis bottom&quot; transform=&quot;translate(0,400)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis top&quot; transform=&quot;translate(0, 0)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis left&quot; transform=&quot;translate(0, 0)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis right&quot; transform=&quot;translate(1290, 0)&quot;&gt;&lt;/g&gt;
    *         &lt;/g&gt;
    *     &lt;/svg&gt;
    * &lt;/div&gt;
    * </code></pre>
    *
    * @type {object}
    * @memberof fc.utilities
    * @namespace fc.utilities.chartLayout
    */
    fc.utilities.chartLayout = function() {

        // Default values
        var margin = {top: 20, right: 40, bottom: 20, left: 40},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        // The elements created for the chart
        var chartElements = {};

        /**
         * Constructs a new instance of the chartLayout component.
         *
         * Applies the chartLayout to a [D3 selection]{@link https://github.com/mbostock/d3/wiki/Selections)}.
         * (Commonly  a <code>div</code>.)
         * The chartLayout component can only be applied to the first element in a selection,
         * all other elements will be ignored.
         *
         * @memberof fc.indicators.chartLayout
         * @method chartLayout
         * @param {selection} selection a D3 selection
         */
        var chartLayout = function(selection) {
            // Select the first element in the selection
            // If the selection contains more than 1 element,
            // only the first will be used, the others will be ignored
            var element = selection.node(),
                style = getComputedStyle(element);

            d3.select(element).selectAll('svg').data([1]);

            // Attempt to automatically size the chart to the selected element
            if (defaultWidth === true) {
                // Set the width of the chart to the width of the selected element,
                // excluding any margins, padding or borders
                var paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                width = element.clientWidth - paddingWidth;

                // If the new width is too small, use a default width
                if (chartLayout.getPlotAreaWidth() < 1) {
                    width = 800 + margin.left + margin.right;
                }
            }

            if (defaultHeight === true) {
                // Set the height of the chart to the height of the selected element,
                // excluding any margins, padding or borders
                var paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
                height = element.clientHeight - paddingHeight;

                // If the new height is too small, use a default height
                if (chartLayout.getPlotAreaHeight() < 1) {
                    height = 400 + margin.top + margin.bottom;
                }
            }

            // Create svg
            chartElements.svg = d3.select(element).append('svg')
                .attr('width', width)
                .attr('height', height);

            // Create group for the chart
            var chart = chartElements.svg.append('g')
                .attr('class', 'chartArea')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            chartElements.chartArea = chart;

            // Clipping path
            chart.append('defs').append('clipPath')
                .attr('id', 'fcPlotAreaClip')
                .append('rect')
                .attr({width: chartLayout.getPlotAreaWidth(), height: chartLayout.getPlotAreaHeight()});

            // Create a background element
            chartElements.plotAreaBackground = chart.append('rect')
                .attr('class', 'background')
                .attr('width', chartLayout.getPlotAreaWidth())
                .attr('height', chartLayout.getPlotAreaHeight());

            // Create plot area, using the clipping path
            chartElements.plotArea = chart.append('g')
                .attr('clip-path', 'url(#fcPlotAreaClip)')
                .attr('class', 'plotArea');

            // Create containers for the axes
            chartElements.axisContainer = {};
            chartElements.axisContainer.bottom = chart.append('g')
                .attr('class', 'axis bottom')
                .attr('transform', 'translate(0,' + chartLayout.getPlotAreaHeight() + ')');

            chartElements.axisContainer.top = chart.append('g')
                .attr('class', 'axis top')
                .attr('transform', 'translate(0, 0)');

            chartElements.axisContainer.left = chart.append('g')
                .attr('class', 'axis left')
                .attr('transform', 'translate(0, 0)');

            chartElements.axisContainer.right = chart.append('g')
                .attr('class', 'axis right')
                .attr('transform', 'translate(' + chartLayout.getPlotAreaWidth() + ', 0)');
        };

        /**
         * Gets/sets the size of the top margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginTop
         * @param  {number} [value] The size of the top margin
         * @returns {number|chartLayout} If value is specified, sets the top margin and returns the chartLayout;
         * if value is not specified, returns the top margin.
         */
        chartLayout.marginTop = function(value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        /**
         * Gets/sets the size of the right margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginRight
         * @param  {number} [value] The size of the right margin
         * @returns {number|chartLayout} If value is specified, sets the right margin and returns the chartLayout;
         * if value is not specified, returns the right margin.
         */
        chartLayout.marginRight = function(value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        /**
         * Gets/sets the size of the bottom margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginBottom
         * @param  {number} [value] The size of the bottom margin
         * @returns {number|chartLayout} If value is specified, sets the bottom margin and returns the chartLayout;
         * if value is not specified, returns the bottom margin.
         */
        chartLayout.marginBottom = function(value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        /**
         * Gets/sets the size of the left margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginLeft
         * @param  {number} [value] The size of the left margin
         * @returns {number|chartLayout} If value is specified, sets the left margin and returns the chartLayout;
         * if value is not specified, returns the left margin.
         */
        chartLayout.marginLeft = function(value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        /**
         * Gets/sets the width of the chart.
         *
         * If a width of the set is not explicitly set before calling chartLayout on a selection,
         * the compoenent will attempt to size the chart to the dimensions of its parent
         * (the first element in the selection).
         *
         * @memberof fc.utilities.chartLayout#
         * @method width
         * @param  {number} [value] The width of the chart
         * @returns {number|chartLayout} If value is specified, sets the width and returns the chartLayout;
         * if value is not specified, returns the width.
         */
        chartLayout.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        /**
         * Gets/sets the height of the chart.
         *
         * If a height of the set is not explicitly set before calling chartLayout on a selection,
         * the compoenent will attempt to size the chart to the dimensions of its parent
         * (the first element in the selection).
         *
         * @memberof fc.utilities.chartLayout#
         * @method height
         * @param  {number} [value] The height of the chart
         * @returns {number|chartLayout} If value is specified, sets the height and returns the chartLayout;
         * if value is not specified, returns the height.
         */
        chartLayout.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        /**
         * Gets the width of the plot area. This is the total width of the chart minus the horizontal margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaWidth
         * @returns {number} The width of the plot area.
         */
        chartLayout.getPlotAreaWidth = function() {
            return width - margin.left - margin.right;
        };

        /**
         * Gets the height of the plot area. This is the total height of the chart minus the vertical margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaHeight
         * @returns {number} The height of the plot area.
         */
        chartLayout.getPlotAreaHeight = function() {
            return height - margin.top - margin.bottom;
        };

        /**
         * Gets SVG for the chart (generated by the component).
         *
         * @memberof fc.utilities.chartLayout#
         * @method getSVG
         * @returns {selection} The SVG for the chart.
         */
        chartLayout.getSVG = function() {
            return chartElements.svg;
        };

        /**
         * Gets the chart area group for the chart (generated by the component).
         * Typically axes will be added to the chart area.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getChartArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getChartArea = function() {
            return chartElements.chartArea;
        };

        /**
         * Gets the plot area group for the chart (generated by the component).
         * The plot area has a clipping path, so this is typically where series and indicators will be added.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getPlotArea = function() {
            return chartElements.plotArea;
        };

        /**
         * Gets the group of an axis.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getAxisContainer
         * @param  {string} orientation The orientation of the axis container;
         * valid values are 'top', 'bottom', 'left' or 'right'
         * @returns {selection} The group for the specified axis orientation.
         */
        chartLayout.getAxisContainer = function(orientation) {
            return chartElements.axisContainer[orientation];
        };

        /**
         * Get the plot area's background element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaBackground
         * @returns {selection} The background rect of the plot area.
         */
        chartLayout.getPlotAreaBackground = function() {
            return chartElements.plotAreaBackground;
        };

        return chartLayout;
    };

    fc.utilities.chartLayout.uid = 0;
}(d3, fc));