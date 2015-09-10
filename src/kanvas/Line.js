(function (global) {
    var utils = global.utils,
        Figure = global.Figure,
        Point = global.Point,
        Vector = global.Vector;

    var Line = global.Line = function (parent, position, start, end, width) {
        var self = this;
        Figure.call(self, parent, position);
        self.start = start;
        self.end = end;
        self.width = width;
    };

    utils.extend(Line.prototype, [Figure.prototype, {
        draw: utils.chain(function (scene) {
            var self = this,
                context = scene.context,
                absPosition = self.getAbsPosition(),
                absStart = absPosition.copy().move(self.start),
                absEnd = absPosition.copy().move(self.end),
                width = self.width;

            context.beginPath();
            context.lineWidth = width;
            context.moveTo(absStart.x, absStart.y);
            context.lineTo(absEnd.x, absEnd.y);
            context.stroke();
        }),

        pointInside: function () {
            return false;
        }
    }]);

})(window.kanvas = (window.kanvas || {}));
