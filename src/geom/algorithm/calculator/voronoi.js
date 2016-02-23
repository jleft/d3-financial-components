import d3 from 'd3';
import {rebind} from '../../../util/rebind';

export default function() {

    var voronoiAlgorithm = d3.geom.voronoi();

    var voronoi = function(data) {
        var polygons = voronoiAlgorithm(data);
        return polygons;
    };

    d3.rebind(voronoi, voronoiAlgorithm, 'x', 'y', 'clipExtent');

    return voronoi;
}
