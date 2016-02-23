import d3 from 'd3';
import merge from '../../indicator/algorithm/merge';
import calculator from './calculator/voronoi';

export default function() {

    var voronoiAlgorithm = calculator();

    var mergedAlgorithm = merge()
        .algorithm(voronoiAlgorithm)
        .merge(function(datum, polygons) { datum.voronoi = polygons; });

    var voronoi = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(voronoi, mergedAlgorithm, 'merge');
    d3.rebind(voronoi, voronoiAlgorithm, 'x', 'y', 'clipExtent');

    return voronoi;
}
