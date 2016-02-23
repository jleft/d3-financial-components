import d3 from 'd3';
import polygonSvg from '../../svg/polygon';
import dataJoinUtil from '../../util/dataJoin';
import {noop} from '../../util/fn';

export default function() {

    var root = function(d) { return d.voronoi; },
        decorate = noop;

    var polygonData = polygonSvg()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    var dataJoin = dataJoinUtil()
        .selector('path.voronoi-cell')
        .element('path')
        .attr('class', 'voronoi-cell');

    var voronoi = function(selection) {
        selection.each(function(data, index) {
            var path = dataJoin(this, data);
            path.attr('d', function(d, i) { return polygonData(root(d), i); });
            decorate(path, data, index);
        });
    };

    voronoi.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return voronoi;
    };
    voronoi.root = function(x) {
        if (!arguments.length) {
            return root;
        }
        root = x;
        return voronoi;
    };
    // To stop multi/cartesian chart blowing up
    voronoi.xScale = noop;
    voronoi.yScale = noop;

    d3.rebind(voronoi, dataJoin, 'key');

    return voronoi;
}
