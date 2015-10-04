function createSeriesSpy() {
    var series = jasmine.createSpy('series');
    series.xScale = jasmine.createSpy('xScale').and.returnValue(series);
    series.yScale = jasmine.createSpy('yScale').and.returnValue(series);
    return series;
}

describe('multi', function() {

    var multi, element, container, data;

    beforeEach(function() {
        multi = fc.series.multi();
        element = document.createElement('svg');
        container = d3.select(element);
        data = [0, 2, 4, 8, 16];

        container.datum(data);
    });

    it('should support n series', function() {

        var series = createSeriesSpy();

        multi.series([series, series]);

        container.call(multi);

        expect(series.calls.count()).toBe(2);
        expect(element.childNodes.length).toBe(2);
    });

    it('should support adding a series', function() {

        var series = createSeriesSpy();

        multi.series([series, series]);

        container.call(multi);

        expect(series.calls.count()).toBe(2);
        expect(element.childNodes.length).toBe(2);

        series.calls.reset();

        multi.series([series, series, series]);

        container.call(multi);

        expect(series.calls.count()).toBe(3);
        expect(element.childNodes.length).toBe(3);
    });

    it('should support removing a series', function() {

        var series = createSeriesSpy();

        multi.series([series, series]);

        container.call(multi);

        expect(series.calls.count()).toBe(2);
        expect(element.childNodes.length).toBe(2);

        series.calls.reset();

        multi.series([series]);

        container.call(multi);

        expect(series.calls.count()).toBe(1);
        expect(element.childNodes.length).toBe(1);
    });

    it('should support re-ordering with key', function() {

        var seriesA = createSeriesSpy();
        seriesA.id = 'seriesA';

        var seriesB = createSeriesSpy();
        seriesB.id = 'seriesB';

        multi.key(function(series) {
            return series.id;
        });

        multi.series([seriesA, seriesB]);

        container.call(multi);

        expect(seriesA.calls.count()).toBe(1);
        expect(seriesB.calls.count()).toBe(1);
        expect(element.childNodes.length).toBe(2);

        var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
            seriesBContainer = seriesB.calls.mostRecent().args[0].node();

        seriesA.calls.reset();
        seriesB.calls.reset();

        multi.series([seriesB, seriesA]);

        container.call(multi);

        expect(seriesA.calls.count()).toBe(1);
        expect(seriesB.calls.count()).toBe(1);
        expect(element.childNodes.length).toBe(2);

        expect(seriesA.calls.mostRecent().args[0].node()).toBe(seriesAContainer);
        expect(seriesB.calls.mostRecent().args[0].node()).toBe(seriesBContainer);
    });

    describe('ordering of series containers', function() {

        var seriesA, seriesB, seriesC;

        beforeEach(function() {
            seriesA = createSeriesSpy();
            seriesA.id = 'seriesA';

            seriesB = createSeriesSpy();
            seriesB.id = 'seriesB';

            seriesC = createSeriesSpy();
            seriesC.id = 'seriesC';

            multi.key(function(series) {
                return series.id;
            });
        });


        it('should order series containers in an order consistent with the series', function() {

            multi.series([seriesA, seriesB]);

            container.call(multi);

            var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
                seriesBContainer = seriesB.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(2);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesBContainer);
        });

        it('should insert new series containers in an order consistent with the series', function() {

            multi.series([seriesA, seriesB]);

            container.call(multi);

            var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
                seriesBContainer = seriesB.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(2);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesBContainer);

            multi.series([seriesA, seriesC, seriesB]);

            container.call(multi);

            seriesAContainer = seriesA.calls.mostRecent().args[0].node();
            seriesBContainer = seriesB.calls.mostRecent().args[0].node();
            var seriesCContainer = seriesC.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesCContainer);
            expect(element.childNodes[2]).toBe(seriesBContainer);
        });

        it('should order series containers in an order consistent with the series when removing a series', function() {

            multi.series([seriesA, seriesB, seriesC]);

            container.call(multi);

            var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
                seriesBContainer = seriesB.calls.mostRecent().args[0].node(),
                seriesCContainer = seriesC.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesBContainer);
            expect(element.childNodes[2]).toBe(seriesCContainer);

            multi.series([seriesA, seriesC]);

            container.call(multi);

            seriesAContainer = seriesA.calls.mostRecent().args[0].node();
            seriesCContainer = seriesC.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(2);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesCContainer);
        });

        it('should re-order series containers in an order consistent with the series array', function() {

            multi.series([seriesA, seriesB, seriesC]);

            container.call(multi);

            var seriesAContainer = seriesA.calls.mostRecent().args[0].node(),
                seriesBContainer = seriesB.calls.mostRecent().args[0].node(),
                seriesCContainer = seriesC.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0]).toBe(seriesAContainer);
            expect(element.childNodes[1]).toBe(seriesBContainer);
            expect(element.childNodes[2]).toBe(seriesCContainer);

            multi.series([seriesC, seriesA, seriesB]);

            container.call(multi);

            seriesAContainer = seriesA.calls.mostRecent().args[0].node();
            seriesBContainer = seriesB.calls.mostRecent().args[0].node();
            seriesCContainer = seriesC.calls.mostRecent().args[0].node();

            expect(element.childNodes.length).toBe(3);
            expect(element.childNodes[0]).toBe(seriesCContainer);
            expect(element.childNodes[1]).toBe(seriesAContainer);
            expect(element.childNodes[2]).toBe(seriesBContainer);
        });

    });
});
