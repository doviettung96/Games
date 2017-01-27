/**
 * Created by tung on 27/01/2017.
 */
    //Read more about physics- http://phaser.io/docs/2.6.2/index#physics
var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
    });

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var textScrore;
var score = 0;
var lives = 3;
var livesText;
var livesLostText;
var dx = 120, dy = -120;
var music, failsound, winsound;
var playing = false;
var startButton;


function preload() {
    //SHOW_ALL — scales the canvas, but keeps the aspect ratio untouched,
    //so images won't be skewed like in the previous mode. ' +
    //'There might be black stripes visible on the edges of the screen, but we can live with that.
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //it is always centered on screen regardless of size.
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = '#eee';

    game.load.image('ball', 'dragonball.png');
    game.load.image('paddle', 'bathtub.png');
    game.load.image('brick', 'brick.png');
    game.load.audio('hit', 'hit.mp3');
    game.load.audio('fail', 'fail.mp3');
    game.load.audio('win', 'youwin.mp3');
    game.load.spritesheet('button', 'button.png', 120, 40);
}

function create() {
    //initialize the Arcade Physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //where you load the music
    music = game.add.audio('hit');
    failsound = game.add.audio('fail');
    winsound = game.add.audio('win');


    //2 first params are x, y coordinates
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 50, 'ball');
    //set anchor to the middle (place exactly what we want)
    ball.anchor.set(0.5, 1);

    //set the paddle
    paddle = game.add.sprite(game.world.width * 0.5, game.world.height -1, 'paddle');
    //set the anchor to the middle of the paddle's width
    paddle.anchor.set(0.5, 1);

    //enable our ball, paddle for the physics system
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);


    //set bounded off the wall
    ball.body.collideWorldBounds = true;
    //1 for enable
    ball.body.bounce.set(1);

    //after bouncing to keep the paddle stay
    paddle.body.immovable = true;

    //Add check bound to 3 edge except the bottom
    ball.checkWorldBounds = true;

    //when life is lost
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    game.physics.arcade.checkCollision.down = false;

    //draw the brick
    initBricks();

    //show the score
    scoreText = game.add.text(5, 5, 'Your score: ', {
        font: '18px Arial',
        fill: '#0095DD'
    });

    //show the lives
    livesText = game.add.text(game.world.width - 5, 5, 'Your lives: ' + lives, {
        font: '18px Arial',
        fill: '#ff0000'
    });
    livesText.anchor.set(1, 0);

    //show lives lost
    livesLostText = game.add.text(game.world.width * 0.5,
        game.world.height * 0.5, 'Life lost, click to continue', {
            font: '18px Arial',
            fill: '#ff0000'
        });

    livesLostText.anchor.set(0.5, 1);
    livesLostText.visible = false;



    //when hit button, invoking the startGame function
    startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5,
        'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}


function update() {
    //add collide physics
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);


    //add collision with bricks
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    //add controller for paddle, set default position
    if (playing)
        paddle.x = game.input.x || game.world.width * 0.5;

}


function initBricks() {
    brickInfo = {
        width: 50,
        height: 21,
        //number of bricks
        count: {
            row: 7,
            col: 3
        },

        // the location on the canvas where we shall start to draw the bricks
        offset: {
            top: 50,
            left: 60
        },

        // padding between each row and column of bricks.
        padding: 10
    };

    bricks = game.add.group();

    for (c = 0; c < brickInfo.count.col; ++c)
        for (r = 0; r < brickInfo.count.row; ++r) {
            //update each brick position
            var brickX = r * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
            var brickY = c * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5, 1);
            bricks.add(newBrick);
        }
}

function ballHitBrick(ball, brick) {
    music.play();
    //make the brick smoothly dispappear
    //scale x, y slowly resize to 0
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();

    score += 1;
    scoreText.setText('Your score: ' + score);

    //number of brick remaining
    var brick_rem = -1;

    for(var i = 0; i < bricks.children.length; ++i)
        if(bricks.children[i].alive == true)
            brick_rem++;
    console.log(bricks.children.length, brick_rem);

    if (brick_rem == 0) {
        winsound.play();
        alert('You win');
        location.reload();
    }
}

function ballLeaveScreen() {
    lives--;
    if (lives) {
        //when one life is lost
        livesText.setText('Your lives: ' + lives);
        livesLostText.visible = true;
        music.stop();
        failsound.play();

        //reset all the object
        ball.reset(game.world.width * 0.5, game.world.height - 50);
        paddle.reset(game.world.width * 0.5, game.world.height - 1);

        //when mousemove, new play is ready
        //addOnce ...
        game.input.onDown.addOnce(function () {
            livesLostText.visible = false;
            ball.body.velocity.set(dx, dy);
        }, this);
    }

    else {
        failsound.play();
        alert('Game over - ' +
            'You score: ' + score);
        location.reload();
    }
}

function ballHitPaddle() {
    music.play();
    ball.body.velocity.x = -2 * (paddle.x - ball.x);
}

function startGame() {
    startButton.destroy();
    ball.body.velocity.set(dx, dy);
    playing = true;
}