export default function() {

    var x = function(d) { return d.x; },
        y = function(d) { return d.y; };

    // Expects an array of vertices, for example:
    // [[0,2],[4,5]]
    // [{x: 0, y: 2}, {x: 4, y: 5}]
    var polygon = function(data, index) {
        var vertices = data.map(function(d, i) {
            var xValue = x.call(this, d, index || i),
                yValue = y.call(this, d, index || i);
            return xValue + ',' + yValue;
        }, this);
        return 'M' + vertices.join('L') + 'Z';
    };

    polygon.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = _x;
        return polygon;
    };
    polygon.y = function(_x) {
        if (!arguments.length) {
            return y;
        }
        y = _x;
        return polygon;
    };

    return polygon;
}
