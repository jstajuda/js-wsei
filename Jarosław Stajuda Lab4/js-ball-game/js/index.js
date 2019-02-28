// leading zeros
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

const ball = document.getElementById("ball");
console.log(ball);

function createBall() {
    ball.setAttribute('cx', 20);
    ball.setAttribute('cy', 20);
    ball.style.display = "block";
}

function ballMoveX(pixels) {
    let cx = ball.cx;
    if(ball.cx - pixels < 0) {
        pixels = ball.cx;
    }
    //rozmiary planszy
    //odleglosci
}

let buttonStart = document.getElementById("buttonStart");
let buttonPause = document.getElementById("buttonPause");
let buttonRestart = document.getElementById("buttonRestart");
let buttonExit = document.getElementById("buttonExit");

let msg = document.getElementById("msg");
let time = {};
let timer = {};
let timerEl = document.getElementById('timer');
let paused = false;

let beta = 0;
let gamma = 0;
let anim = {};

buttonStart.addEventListener("click", startGame);
buttonExit.addEventListener("click", endGame);
buttonPause.addEventListener("click", pauseGame);
buttonRestart.addEventListener("click", restartGame);

document.addEventListener("fullscreenchange", function() {
    if(!document.fullscreenElement) {
        buttonStart.removeAttribute("disabled");
    }
});

function pauseGame() {
    if(paused) {
        timer = setInterval( function(){
            time.setSeconds(time.getSeconds() + 1);
            timerEl.innerHTML = `${printTime()}`;
        }, 1000);
        buttonPause.innerHTML = "pause";
        startAnimation();
        paused = false;
    } else {
        clearInterval(timer);
        stopAnimation();
        paused = true;
        buttonPause.innerHTML = "resume";
    }
}

function restartGame() {
    paused = false;
    buttonPause.innerHTML = "pause";
    resetBoard();
    clearTime();
    resetTimer();
    stopAnimation();
    startAnimation();
}


function startGame() {
    if(!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then({}).catch(err => {
            alert('Cant get to full screen mode!');
        });
    } else {
        document.exitFullscreen();
    }

    screen.orientation.lock("portrait-primary").then(function() {

        //game started
        
        //set available buttons
        buttonStart.setAttribute("disabled", "disabled");
        buttonPause.removeAttribute("disabled");
        buttonRestart.removeAttribute("disabled");
        buttonExit.removeAttribute("disabled");



        //start timer
        resetTimer();

        //show the ball
        resetBoard();
        createBall();

        //start moving
        startAnimation();

    }, function(error) {
        //error starting game
        alert(error);
        document.exitFullscreen();
        cleanGame();
    });
}

function endGame() {
    stopAnimation();
    alert(`Game ended with time: ${printTime()}`);
    clearTime();
    document.exitFullscreen();
    cleanGame();
}

function cleanGame() {
    paused = false;
    buttonStart.removeAttribute("disabled");
    buttonPause.setAttribute("disabled", "disabled");
    buttonPause.innerHTML = 'pause';
    buttonRestart.setAttribute("disabled", "disabled");
    buttonExit.setAttribute("disabled", "disabled");
}

function printTime() {
    return `${time.getMinutes().valueOf().pad()}:${time.getSeconds().valueOf().pad()}`;
}

function clearTime() {
    clearInterval(timer);
    time = new Date(0);
    timerEl.innerHTML = `${printTime()}`;
}

function resetTimer() {
    time = new Date(0);
    timer = setInterval( function(){
        time.setSeconds(time.getSeconds() + 1);
        timerEl.innerHTML = `${printTime()}`;
    }, 1000);
}


const zSpan = document.getElementById('z');
const xSpan = document.getElementById('x');
const ySpan = document.getElementById('y');



window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(event) {
    beta     = event.beta;
    gamma    = event.gamma;
  
    // xSpan.innerHTML = beta.toFixed(0);
    // ySpan.innerHTML = gamma.toFixed(0);

    yAdj = (beta / 18).toFixed(0);
    xAdj = (gamma / 9).toFixed(0);

    xSpan.innerHTML = yAdj;
    ySpan.innerHTML = xAdj;

    //movement
    // beta > 0 && gamma > 0 => down - right
    // beta < 0 && gamma > 0 => up - right
    // beta < 0 && gamma < 0 => up - left
    // beta > 0 && gamma < 0 => down - left

}

function moveBall() {
    let x = ball.cx.baseVal.value;
    let y = ball.cy.baseVal.value;

    if(beta > 10) {
        ball.setAttribute('cy', y + 1);
    } 
    else if(beta < -10) {
        ball.setAttribute('cy', y - 1);
    }

    if(gamma > 10) {
        ball.setAttribute('cx', x + 1);
    } 
    else if (gamma < -10) {
        ball.setAttribute('cx', x - 1);
    }

    anim = window.requestAnimationFrame(moveBall);
}

function startAnimation() {
    anim = requestAnimationFrame(moveBall);
}

function stopAnimation() {
    cancelAnimationFrame(anim);
}

function resetBoard() {
    ball.setAttribute('cx', 20);
    ball.setAttribute('cy', 20);
}