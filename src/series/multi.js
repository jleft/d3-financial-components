import {context, index, noop} from '../util/fn';
import d3 from 'd3';
import _dataJoin from '../util/dataJoin';

// The multi series does some data-join gymnastics to ensure we don't -
// * Create unnecessary intermediate DOM nodes
// * Manipulate the data specified by the user
// This is achieved by data joining the series array to the container but
// overriding where the series value is stored on the node (__series__) and
// forcing the node datum (__data__) to be the user supplied data (via mapping).

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        series = [],
        mapping = context,
        key = index,
        decorate = noop;

    var dataJoin = _dataJoin()
        .selector('g.multi')
        .children(true)
        .attr('class', 'multi')
        .element('g')
        .key(function(d, i) {
            // This function is invoked twice, the first pass is to pull the key
            // value from the DOM nodes and the second pass is to pull the key
            // value from the data values.
            // As we store the series as an additional property on the node, we
            // look for that first and if we find it assume we're being called
            // during the first pass. Otherwise we assume it's the second pass
            // and pull the series from the data value.
            var series = this.__series__ || d;
            return key.call(this, series, i);
        });

    var multi = function(selection) {

        selection.each(function(data) {

            var g = dataJoin(this, series);

            g.each(function(series, i) {
                // We must always assign the series to the node, as the order
                // may have changed. N.B. in such a case the output is most
                // likely garbage (containers should not be re-used) but by
                // doing this we at least make it debuggable garbage :)
                this.__series__ = series;

                (series.xScale || series.x).call(series, xScale);
                (series.yScale || series.y).call(series, yScale);

                d3.select(this)
                    .datum(mapping.call(data, series, i))
                    .call(series);
            });

            g.order();

            decorate(g);
        });
    };

    multi.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return multi;
    };
    multi.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return multi;
    };
    multi.series = function(x) {
        if (!arguments.length) {
            return series;
        }
        series = x;
        return multi;
    };
    multi.mapping = function(x) {
        if (!arguments.length) {
            return mapping;
        }
        mapping = x;
        return multi;
    };
    multi.key = function(x) {
        if (!arguments.length) {
            return key;
        }
        key = x;
        return multi;
    };
    multi.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return multi;
    };

    return multi;
}
