(function (ns) {
    var Circle = kanvas.Circle,
        Line = kanvas.Line,
        Figure = kanvas.Figure,
        utils = kanvas.utils,
        Point = kanvas.Point,
        Vector = kanvas.Vector;

    function Block(parent, i, j, size, type, padding, lineWidth) {
        var self = this;
        var position = new Point(i * size.width, j * size.height);
        Figure.call(self, parent, position);
        self.i = i;
        self.j = j;
        self.size = size;
        self.type = type;
        self.padding = padding;
        self.lineWidth = lineWidth;
    };

    utils.extend(Block.prototype, [Figure.prototype, {
        draw: utils.chain(function (scene) {
            var self = this,
                type = self.type,
                padding = self.padding,
                lineWidth = self.lineWidth,
                pw = self.size.width, 
                ph = self.size.height,
                min,
                move;

            if (pw === ph) {
                min = ph;
                move = new Vector(padding, padding);
            } else if (pw > ph) {
                min = ph;
                move = new Vector((pw - min) / 2 + padding, padding);
            } else {
                min = pw;
                move = new Vector(padding, (ph - min) / 2 + padding);
            }

            var position = (new Point(0, 0)).move(move);
            if (type === 'o') {
                var radius = min / 2 - padding;
                var circle = new Circle(self, position, radius, lineWidth);
                circle.draw(scene);
            } else if (type === 'x') {
                var line1 = new Line(
                    self,
                    position,
                    new Point(0, 0),
                    new Point(min - 2 * padding, min - 2 * padding),
                    lineWidth
                );

                var line2 = new Line(
                    self,
                    position,
                    new Point(0, min - 2 * padding),
                    new Point(min - 2 * padding, 0),
                    lineWidth
                );

                line1.draw(scene);
                line2.draw(scene);
            }
        }),

        pointInside: function (pt) {
            var self = this,
                pos = self.getAbsPosition(),
                size = self.size;

            return pt.x >= pos.x && pt.x <= pos.x + size.width &&
                pt.y >= pos.y && pt.y <= pos.y + size.height;
        }
    }]);

    ns.Block = Block;

})(window.xox = (window.xox || {}));