# kanvas-tic-tac-toe
Tic tac toe game with kanvas library ([demo](http://karaxuna.github.io/kanvas-tic-tac-toe/))

Include js file:

    <script type="text/javascript src="./dist/xox.min.js"></script>
    
Add canvas in html:

    <canvas width="400" height="400" id="canvas"></canvas>
    
Initialize game:

```javascript
var game = new xox.Game({
    context: document.getElementById('canvas').getContext('2d')
});
```
    
`xox.Game` class parameters:

* `context` (required) - canvas 2d context;
* `winningScore` (default 3) - scores needed to win the game
* `width` - count of horizontal blocks on board
* `height` - count of vertical blocks on board
* `turn` - Who's turn is now? "x" or "o"
* `me` - used when playing in network. When indicated user plays with only one type: "x" or "o". When left empty, two users can play with same instance.
 
Events:

* `over` - triggers when one of the player wins. check `game.winner` to find out winner.

```javascript
game.on('over', function () {
    alert('winner is ' + game.winner);
});
```
