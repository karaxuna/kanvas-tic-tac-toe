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