(function (ns) {
    var Circle = kanvas.Circle,
        Line = kanvas.Line,
        Figure = kanvas.Figure,
        utils = kanvas.utils,
        Point = kanvas.Point,
        Size = kanvas.Size,
        Matrix = ns.Matrix,
        Block = ns.Block;

    function Board(width, height, lineWidth, padding) {
        var self = this;
        var position = new Point(0, 0);
        Figure.call(self, null, position);
        var matrix = self.matrix = new Matrix(width, height);
        self.lineWidth = lineWidth;
        self.padding = padding;

        matrix.iterate(function (i, j) {
            matrix.set(i, j, new Block(
                self,
                i,
                j,
                new Size(0, 0),
                null,
                padding,
                5
            ));
        });
    };

    utils.extend(Board.prototype, [Figure.prototype, {

        clean: utils.chain(function () {
            var self = this;
            self.matrix.iterate(function (i, j, block) {
                block.letter = null;
            });
        }),

        getBlockByAbsPosition: function (point) {
            var self = this,
                matrix = self.matrix,
                result;

            matrix.iterate(function (i, j, block) {
                if (block.pointInside(point)) {
                    result = block;
                }
            });

            return result;
        },

        fill: utils.chain(function (i, j, letter) {
            var self = this,
                width = self.matrix.width,
                height = self.matrix.height;

            if (i > width || i < 0 || j > height || j < 0) {
                throw new Error('Invalid parameters');
            }

            var block = self.matrix.get(i, j);

            if (block.letter) {
                throw new Error('Block is already filled');
            }

            block.letter = letter;
        }),

        draw: utils.chain(function (scene) {
            var self = this,
                matrix = self.matrix,
                width = self.matrix.width,
                height = self.matrix.height,
                lineWidth = self.lineWidth,
                canvas = scene.context.canvas,
                padding = self.padding;

            matrix.iterate(function (i, j, block) {
                var size = block.size = new Size(canvas.width / width, canvas.height / height);
                block.position = new Point(i * size.width, j * size.height);
                block.draw(scene);
            });

            var i, j, line;
            for (i = 0; i <= width; i++) {
                line = new Line(
                    self,
                    new Point(0, 0),
                    new Point(i * canvas.width / width, 0),
                    new Point(i * canvas.width / width, canvas.height),
                    lineWidth
                );
                line.draw(scene);
            }

            for (j = 0; j <= height; j++) {
                line = new Line(self,
                    new Point(0, 0),
                    new Point(0, j * canvas.height / height),
                    new Point(canvas.width, j * canvas.height / height),
                    lineWidth
                );
                line.draw(scene);
            }
        }),

        pointInside: function (pt) {
            return false;
        }
    }]);

    ns.Board = Board;

})(window.xox = (window.xox || {}));