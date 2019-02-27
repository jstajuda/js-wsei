// leading zeros
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

const ball = document.getElementById("ball");
console.log(ball);

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
        paused = false;
    } else {
        clearInterval(timer);
        paused = true;
        buttonPause.innerHTML = "resume";
    }
}

function restartGame() {
    paused = false;
    buttonPause.innerHTML = "pause";
    clearTime();
    resetTimer();
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


    }, function(error) {
        //error starting game
        alert(error);
        document.exitFullscreen();
        cleanGame();
    });
}

function endGame() {
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