# kanvas-tic-tac-toe
Tic tac toe game with kanvas library

Include js file:

    <script type="text/javascript src="./dist/xox.min.js"></script>
    
Add canvas in html:

    <canvas width="400" height="400" id="canvas"></canvas>
    
Initialize game:

    var game = new xox.Game({
        context: document.getElementById('canvas').getContext('2d')
    });
    
Notify winner when game is over:

    game.on('over', function () {
        alert('winner is ' + game.winner);
    });
    
`xox.Game` class parameters:

* `context` (required) - canvas 2d context;
* `winningScore` (default 3) - scores needed to win the game
* `width` - count of horizontal blocks on board
* `height` - count of vertical blocks on board
* `turn` - Who's turn is now? "x" or "o"
* `me` - used when playing in network. When indicated user plays with only one type: "x" or "o". When left empty, two users can play with same instance.
