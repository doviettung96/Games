/**
 * Created by tung on 17/01/2017.
 */

$(document).ready(function () {

    var canvas = document.getElementById("area");
    var ctx = canvas.getContext("2d");
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var ballRadius = 10;
    var barWidth = 100;
    var barHeight = 10;
    var barX = (canvas.width - barWidth) / 2;
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 40;
    var brickHeight = 10;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var relativeX;
    var c, r;
    var bricks = [];
    var score = 0;
    var lives = 3;
    var snd = new Audio("bup.mp3");

    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: 1};
        }
    }

    $("#area").mousemove(function (event) {
        // relativeX = event.pageX - canvas.offsetLeft;
        relativeX = event.pageX - 370;
        if (relativeX > 0 && relativeX < canvas.width)
            barX = relativeX - barWidth / 2;
    });


    function collision() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1)
                    if (x > bricks[c][r].x && x < bricks[c][r].x + brickWidth
                        && y > bricks[c][r].y && y < bricks[c][r].y + brickHeight) {
                        dy = -dy;
                        bricks[c][r].status = 0;
                        score++;
                        snd.play();
                        // barWidth -= 5;
                    }
                if (score == brickRowCount * brickColumnCount) {
                    alert("YOU WIN!!!");
                    document.location.reload();
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#adff2f";
        ctx.fill();
        ctx.closePath();
    }

    function drawBar() {
        ctx.beginPath();
        ctx.rect(barX, canvas.height - barHeight, barWidth, barHeight);
        ctx.fillStyle = "#d3d3d3";
        ctx.fill();
        ctx.closePath();
    }

    function drawBrick() {

        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {

                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#b22222";
                    ctx.fill();
                    ctx.closePath();
                }

            }
        }

    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Lives: " + lives, canvas.width - 60, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBrick();
        drawBall();
        drawBar();
        drawScore();
        drawLives();
        collision();

        if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
            dx = -dx;
            snd.play();
        }
        if (y + dy < ballRadius) {
            dy = -dy;
            snd.play();
        }
        else if (y + dy > canvas.height - ballRadius)
            if (x > barX && x < barX + barWidth) {
                dy = -dy;
                snd.play();
            }
            else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    barX = (canvas.width - barWidth) / 2;
                }

            }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);

    }
    draw();
});


