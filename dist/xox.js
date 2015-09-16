(function (global) {

    global.utils = {

        extend: function (a, bs, excludeInstances) {
            excludeInstances = excludeInstances || [Array];
            for (var i = 0, b; b = bs[i]; i++)
                for (var prop in b)
                    if (b.hasOwnProperty(prop)) {
                        var isInstanceOfExcluded = false;
                        if (excludeInstances)
                            for (var j = 0; j < excludeInstances.length; j++)
                                if (b[prop] instanceof excludeInstances[j])
                                    isInstanceOfExcluded = true;

                        if (typeof b[prop] === 'object' && b[prop] !== null && !isInstanceOfExcluded) {
                            a[prop] = a[prop] !== undefined ? a[prop] : {};
                            this.extend(a[prop], [b[prop]], excludeInstances);
                        } else
                            a[prop] = b[prop];
                    }
            return a;
        },

        setProp: function (obj, prop, value) {
            var parts = prop.split('.');
            var _ref = obj;
            for (var i = 0, part; part = parts[i]; i++) {
                if (i === parts.length - 1) {
                    _ref[part] = value;
                } else {
                    _ref = (_ref[part] = _ref[part] || {});
                }
            }
        },

        getProp: function (obj, prop) {
            var parts = prop.split('.');
            var _ref = obj;
            for (var i = 0, part; part = parts[i]; i++) {
                if (i === parts.length - 1) {
                    return _ref[part];
                } else {
                    _ref = _ref[part] || {};
                }
            }
        },

        findOne: function (ar, query, fn) {
            for (var i = 0, a; a = ar[i]; i++) {
                var m = this.matchesQuery(a, query);
            }
            if (m) {
                if (fn) {
                    fn(a, i);
                }
                return a;
            }

            if (fn) {
                fn(null);
            }
            return null;
        },

        matchesQuery: function (obj, query) {
            switch (typeof query) {
                case 'object':
                    for (var prop in query) {
                        var val = this.getProp(obj, prop);
                        if (val !== query[prop]) {
                            return false;
                        }
                    }
                    return true;
                case 'function':
                    return query(obj);
            }
        },

        find: function (ar, query, fn) {
            var results = [];
            for (var i = 0, a; a = ar[i]; i++) {
                if (this.matchesQuery(a, query)) {
                    results.push(a);
                }
            }

            if (fn) {
                fn(results);
            }
            return results;
        },

        contains: function (ar, obj, query) {
            for (var i = 0, a; a = ar[i]; i++) {
                if (this.equals(a, obj, query)) {
                    return true;
                }
            }
            return false;
        },

        any: function (items, query) {
            for (var i = 0, item; item = items[i]; i++) {
                if (this.matchesQuery(item, query)) {
                    return true;
                }
            }
            return false;
        },

        union: function (ar1, ar2, query, fn) {
            var results = [];
            for (var i = 0; i < ar1.length; i++)
                results.push(ar1[i]);
            for (var i = 0; i < ar2.length; i++) {
                var isNotInAr1 = !this.contains(ar1, ar2[i], query);
                if (isNotInAr1)
                    results.push(ar2[i]);
            };
            if (fn) {
                fn(results);
            }
            return results;
        },

        except: function (ar1, ar2, query, fn) {
            var results = [];
            for (var i = 0; i < ar1.length; i++) {
                var a = ar1[i];
                if (!this.contains(ar2, a, query))
                    results.push(a);
            }
            if (fn) {
                fn(results);
            }
            return results;
        },

        max: function (ar) {
            var max;
            for (var i = 0; i < ar.length; i++) {
                var a = ar[i];
                if (typeof max === 'undefined' || a > max) {
                    max = a;
                }
            }
            return max;
        },

        equals: function (item1, item2, query) {
            for (var prop in query) {
                var val1 = this.getProp(item1, prop);
                var val2 = this.getProp(item2, prop);
                if (val1 !== val2) {
                    return false;
                }
            }
            return true;
        },

        chain: function (fn) {
            return function () {
                fn.apply(this, arguments);
                return this;
            };
        }

    };

})(window.kanvas = (window.kanvas || {}));

(function (global) {
    var utils = global.utils;

    var EventTarget = global.EventTarget = function () {
        var self = this;
        self._listeners = {};
    };

    EventTarget.prototype = {
        constructor: EventTarget,

        on: utils.chain(function (type, listener) {
            if (typeof this._listeners[type] == "undefined") {
                this._listeners[type] = [];
            }

            this._listeners[type].push(listener);
        }),

        trigger: utils.chain(function (type, data) {
            if (this._listeners[type] instanceof Array) {
                var listeners = this._listeners[type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (data instanceof Array) {
                        listeners[i].apply(this, data);
                    } else {
                        listeners[i].call(this, data);
                    }
                }
            }
        }),

        removeListener: utils.chain(function (type, listener) {
            if (this._listeners[type] instanceof Array) {
                var listeners = this._listeners[type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        })
    };

})(window.kanvas = (window.kanvas || {}));

(function (global) {

    var Vector = global.Vector = function (x, y) {
        var self = this;
        self.x = x;
        self.y = y;
    };

})(window.kanvas = (window.kanvas || {}));

(function (global) {
    var utils = global.utils;

    var Point = global.Point = function (x, y) {
        var self = this;
        self.x = x;
        self.y = y;
    };

    utils.extend(Point.prototype, [{
        move: utils.chain(function (vector) {
            var self = this;
            self.x += vector.x;
            self.y += vector.y;
        }),

        copy: function () {
            var self = this;
            return new Point(self.x, self.y);
        }
    }]);

})(window.kanvas = (window.kanvas || {}));

(function (global) {

    var Size = global.Size = function (width, height) {
        var self = this;
        self.width = width;
        self.height = height;
    };

})(window.kanvas = (window.kanvas || {}));

(function (global) {
    var utils = global.utils,
        EventTarget = global.EventTarget,
        Point = global.Point,
        Vector = global.Vector;

    var Mouse = global.Mouse = function (container) {
        var self = this;
        EventTarget.call(self);

        self.container = container;
        self.down = false;
        self.curr = new Point(null, null);
        self.diff = new Vector(0, 0);

        container.addEventListener('mousemove', function (e) {
            var nx = e.clientX - container.offsetLeft + document.body.scrollLeft;
            var ny = e.clientY - container.offsetTop + document.body.scrollTop;
            self.diff.x = nx - self.curr.x;
            self.diff.y = ny - self.curr.y;
            self.curr.x = nx;
            self.curr.y = ny;
            self.trigger('move', e);
        });

        container.addEventListener('mousedown', function (e) {
            self.down = true;
            self.trigger('down', e);
        });

        container.addEventListener('mouseup', function (e) {
            self.down = false;
            self.trigger('up', e);
        });

        container.addEventListener('click', function (e) {
            self.trigger('click', e);
        });
    };

    utils.extend(Mouse.prototype, [EventTarget.prototype]);

})(window.kanvas = (window.kanvas || {}));

(function (global) {
    var utils = global.utils,
        EventTarget = global.EventTarget;

    var Figure = global.Figure = function (parent, position) {
        var self = this;
        EventTarget.call(self);
        self.parent = parent;
        self.position = position;
    };

    utils.extend(Figure.prototype, [EventTarget.prototype, {

        move: utils.chain(function (vector) {
            var self = this;
            self.position.move(vector);
        }),

        getAbsPosition: function () {
            var self = this;
            return self.parent ? self.parent.getAbsPosition().copy().move(self.position) : self.position;
        }

        /*
        * draw - draw on canvas
        * abstract
        * @param Scene - instance of scene to draw there
        * @returns Figure - self
        */

        /*
        * pointInside - determines whether the point is inside figure or not
        * abstract
        * @param Point - point
        * @returns Boolean - result
        */

    }]);

})(window.kanvas = (window.kanvas || {}));

(function (global) {
    var utils = global.utils;

    var Font = global.Font = function (style, size, family) {
        var self = this;
        self.style = style;
        self.size = size;
        self.family = family;
    };

    utils.extend(Font.prototype, [{
        getCombinedText: function () {
            var self = this,
                style = self.style,
                size = self.size,
                family = self.family,
                result = '';

            if (style) {
                result += style;
            }
            if (size) {
                result += (result ? ' ' : '') + size + 'px';
            }
            if (family) {
                result += (result ? ' ' : '') + family;
            }
            return result;
        }
    }]);

})(window.kanvas = (window.kanvas || {}));
(function (global) {
    var utils = global.utils,
        Figure = global.Figure,
        Size = global.Size;

    var Text = global.Text = function (parent, position, text, font, align) {
        var self = this;
        Figure.call(self, parent, position);
        self.text = text;
        self.font = font;
        self.align = align;
    };

    utils.extend(Text.prototype, [Figure.prototype, {
        draw: utils.chain(function (scene) {
            var self = this,
                absPosition = self.getAbsPosition(),
                text = self.text,
                font = self.font,
                align = self.align,
                context = scene.context;

            context.textBaseline = 'top';
            context.textAlign = align; 
            context.font = font.getCombinedText();
            context.fillText(text, absPosition.x, absPosition.y);
        }),

        getSize: function () {
            var self = this,
                text = self.text,
                font = self.font,
                vctx = document.createElement('canvas').getContext('2d');

            vctx.textBaseline = 'top';
            vctx.font = font.getCombinedText();
            return new Size(vctx.measureText(text).width, font.size);
        },

        pointInside: function (pt) {
            var self = this,
                absPosition = self.getAbsPosition(),
                size = self.getSize();

            return pt.x >= absPosition.x && pt.x <= absPosition.x + size.width &&
                pt.y >= absPosition.y && pt.y <= absPosition.y + size.height;
        }
    }]);

})(window.kanvas = (window.kanvas || {}));

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

(function (global) {
    var utils = global.utils,
        EventTarget = global.EventTarget,
        Mouse = global.Mouse;

    var Scene = global.Scene = function (context) {
        var self = this;
        EventTarget.call(self);
        self.context = context;
        self.figures = [];
        self.mouse = new Mouse(context.canvas);
    };

    utils.extend(Scene.prototype, [EventTarget.prototype, {
        add: utils.chain(function (figure, index) {
            var self = this;
            self.figures.splice(index === undefined ? self.figures.length - 1 : index, 0, figure);
        }),

        draw: utils.chain(function () {
            var self = this;
            for (var i = 0, figure; figure = self.figures[i]; i++) {
                figure.draw(self);
            }
        }),

        redraw: utils.chain(function () {
            var self = this;
            self.clear().draw();
        }),

        clear: utils.chain(function () {
            var self = this;
            self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
        })
    }]);

})(window.kanvas = (window.kanvas || {}));

(function (ns) {
    
    function Matrix(width, height) {
        var self = this,
            values = self.values = {};
        
        self.width = width;
        self.height = height;
    };

    Matrix.prototype.iterate = function (callback) {
        var self = this,
            width = self.width,
            height = self.height,
            values = self.values;

        var i, j;
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                callback(i, j, values[i] ? values[i][j] : null);
            }
        }
    };

    Matrix.prototype.get = function (i, j) {
        var self = this;
        return self.values[i][j];
    };

    Matrix.prototype.set = function (i, j, value) {
        var self = this;
        self.values[i] = self.values[i] || {};
        self.values[i][j] = value;
    };

    ns.Matrix = Matrix;

})(window.xox = (window.xox || {}));
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
(function (ns) {
    var Board = ns.Board,
        Scene = kanvas.Scene,
        EventTarget = kanvas.EventTarget,
        utils = kanvas.utils;

    Game.prototype.defaultOptions = {
        letters: ['X', 'O'],
        turnIndex: 0,
        meIndex: null,
        winningScore: 3,
        width: 3,
        height: 3
    };

    function Game(options) {
        var self = this;
        options = self.options = utils.extend({}, [self.defaultOptions, options], [Array, CanvasRenderingContext2D]);
        EventTarget.call(self);

        self.options = options;
        self.letters = options.letters;
        self.turnIndex = options.turnIndex;
        self.meIndex = options.meIndex;
        self.winningScore = options.winningScore;
        self.winner;

        var board = self.board = new Board(options.width, options.height, 1, 10);
        var scene = self.scene = new Scene(options.context);

        scene.mouse.on('click', function () {
            var block = board.getBlockByAbsPosition(scene.mouse.curr);
            if (block) {
                self.fill(block.i, block.j, true);
            }
        });

        scene.add(board, 0);
        scene.draw();
    };

    utils.extend(Game.prototype, [EventTarget.prototype, {

        restart: utils.chain(function () {
            var self = this;
            self.board.clean();
            self.winner = null;
            self.turnIndex = self.options.turnIndex;
            self.scene.redraw();
        }),

        fill: utils.chain(function (i, j, manually, silent) {
            var self = this,
                letters = self.letters,
                turn = letters[self.turnIndex],
                me = letters[self.meIndex],
                board = self.board,
                scene = self.scene;

            if (self.winner) {
                throw new Error('Game is over');
            }

            if (manually && me && me !== turn) {
                throw new Error('Not your turn');
            }

            board.fill(i, j, turn);
            scene.redraw();

            if (!silent) {
                self.trigger('filled', {
                    i: i,
                    j: j,
                    letter: turn
                });
            }

            var over = self.check(i, j, turn);
            if (over) {
                self.winner = turn;
                self.trigger('over');
            } else if (self.turnIndex < letters.length - 1) {
                self.turnIndex += 1;
            } else {
                self.turnIndex = 0;
            }
        }),

        check: function (i, j, turn) {
            var self = this,
                board = self.board,
                bmatrix = board.matrix,
                bwidth = bmatrix.width,
                bheight = bmatrix.height,
                winningScore = self.winningScore;

            var over = [
                [1, 0],
                [0, 1],
                [1, -1],
                [1, 1]
            ].some(function (difs) {
                var difI = difs[0],
                    curI = i,
                    difJ = difs[1],
                    curJ = j;

                var block, count = 1, negated = false;
                while (true) {
                    curI += difI;
                    curJ += difJ;
                    if (curI < 0 || curI >= bwidth || curJ < 0 || curJ >= bheight) {
                        if (!negated) {
                            curI = i;
                            curJ = j;
                            difI = -difI;
                            difJ = -difJ;
                            negated = true;
                        } else {
                            return false;
                        }
                    } else {
                        block = bmatrix.get(curI, curJ);
                        if (block.letter === turn) {
                            if (++count === winningScore) {
                                return true;
                            }
                        } else if (!negated) {
                            curI = i;
                            curJ = j;
                            difI = -difI;
                            difJ = -difJ;
                            negated = true;
                        } else {
                            return false;
                        }
                    }
                }
            });

            return over;
        }

    }]);

    ns.Game = Game;

})(window.xox = (window.xox || {}));