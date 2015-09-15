(function (ns) {
    var Text = kanvas.Text,
        Font = kanvas.Font,
        Figure = kanvas.Figure,
        utils = kanvas.utils,
        Point = kanvas.Point,
        Vector = kanvas.Vector;

    function Block(parent, i, j, size, letter, padding, lineWidth) {
        var self = this;
        var position = new Point(i * size.width, j * size.height);
        Figure.call(self, parent, position);
        self.i = i;
        self.j = j;
        self.size = size;
        self.letter = letter;
        self.padding = padding;
        self.lineWidth = lineWidth;
    };

    utils.extend(Block.prototype, [Figure.prototype, {
        draw: utils.chain(function (scene) {
            var self = this,
                letter = self.letter,
                padding = self.padding,
                lineWidth = self.lineWidth,
                pw = self.size.width, 
                ph = self.size.height,
                min,
                position;

            if (pw === ph) {
                min = ph;
                position = new Vector(min / 2, padding);
            } else if (pw > ph) {
                min = ph;
                position = new Vector((pw - min) / 2 + padding, padding);
            } else {
                min = pw;
                position = new Vector(padding, (ph - min) / 2 + padding);
            }

            if (letter) {
                var font = new Font('normal', min - 2 * padding, 'Arial');
                var text = new Text(self, position, letter, font, 'center');
                text.draw(scene);
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