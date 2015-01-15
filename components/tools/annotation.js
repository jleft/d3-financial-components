(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {

            selection.each(function(data) {
                var x = annotation.xScale.value,
                    y = annotation.yScale.value,
                    yValue = annotation.yValue.value;

                var container = fc.utilities.simpleDataJoin(d3.select(this), 'annotation', data);

                var line = container.selectAll('line.marker').data(data);

                line.enter().append('line')
                    .attr('class', 'marker');

                line.attr('x1', x.range()[0])
                    .attr('y1', function(d) { return y(yValue(d)); })
                    .attr('x2', x.range()[1])
                    .attr('y2', function(d) { return y(yValue(d)); });

                line.exit().remove();

                // var label = container.selectAll('text.callout').data(data);

                // label.enter().append('text')
                //     .attr('class', 'callout');

                // label.attr('x', x.range()[1])
                //     .attr('y', y(yValue))
                //     .attr('style', 'text-anchor: end;')
                //     .text(annotation.formatLabel.value(yValue));

                // label.exit().remove();

                annotation.decorate.value(container);
            });

        };

        annotation.xScale = fc.utilities.property(d3.time.scale());

        annotation.yScale = fc.utilities.property(d3.scale.linear());

        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);

        annotation.formatLabel = fc.utilities.property(d3.scale.linear());

        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };
}(d3, fc));