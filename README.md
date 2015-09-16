# kanvas-tic-tac-toe
Tic tac toe game with kanvas library ([demo](http://karaxuna.github.io/kanvas-tic-tac-toe/))

Install with bower:

    bower install kanvas-tic-tac-toe

Include js file:

```html
<script type="text/javascript src="./dist/xox.js"></script>
```
    
Add canvas in html:

```html
<canvas width="400" height="400" id="canvas"></canvas>
```
    
Initialize game:

```javascript
var game = new xox.Game({
    context: document.getElementById('canvas').getContext('2d')
});
```
    
`xox.Game` class parameters:

* `context` (required) - canvas 2d context;
* `winningScore` (default 3) - scores needed to win the game
* `width` (default 3) - count of horizontal blocks on board
* `height` (default 3) - count of vertical blocks on board
* `turnIndex` (default 0) - Who's turn is now? Index of the player
* `meIndex` - used when playing in network.
 
Events:

* `over` - triggers when one of the player wins. check `game.winner` to find out winner (null if draw).

```javascript
game.on('over', function () {
    if (game.winner) {
        alert('Winner is ' + game.winner);
    } else {
        alert('Draw');
    }
});
```

To build js file under `/dist` folder, run:

    gulp build
