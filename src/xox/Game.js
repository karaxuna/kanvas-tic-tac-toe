(function (ns) {
    var Board = ns.Board,
        Scene = kanvas.Scene,
        EventTarget = kanvas.EventTarget,
        utils = kanvas.utils;

    function Game(options) {
        var self = this;
        EventTarget.call(self);

        self.options = options;
        self.turn = options.turn || 'x';
        self.me = options.me;
        self.winner;
        self.winningScore = options.winningScore || 3;

        var board = self.board = new Board(options.width || 3, options.height || 3, 1, 10);
        var scene = self.scene = new Scene(options.context);

        scene.mouse.on('click', function () {
            var block = board.getBlockByAbsPosition(scene.mouse.curr);
            if (block) {
                self.fill(block.i, block.j);
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
            self.turn = self.options.turn || 'x';
            self.scene.redraw();
        }),

        fill: utils.chain(function (i, j) {
            var self = this,
                turn = self.turn,
                me = self.me,
                board = self.board,
                scene = self.scene;

            if (self.winner) {
                throw new Error('Game is over');
            }

            if (me && me !== turn) {
                throw new Error('Not your turn');
            }

            board.fill(i, j, turn);
            scene.redraw();

            self.trigger('filled', {
                i: i,
                j: j,
                type: turn
            });

            var over = self.check(i, j, turn);
            if (over) {
                self.winner = turn;
                self.trigger('over');
            } else if (turn === 'x') {
                self.turn = 'o';
            } else if (turn === 'o') {
                self.turn = 'x';
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
                        if (block.type === turn) {
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