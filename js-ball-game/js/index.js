let buttonStart = document.getElementById("buttonStart");
let buttonPause = document.getElementById("buttonPause");
let buttonRestart = document.getElementById("buttonRestart");
let buttonExit = document.getElementById("buttonExit");

let msg = document.getElementById("msg");



buttonStart.addEventListener("click", function(){
    startGame();
});

document.addEventListener("fullscreenchange", function() {
    if(!document.fullscreenElement) {
        buttonStart.removeAttribute("disabled");
    }
});

function startGame() {

    if(!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then({}).catch(err => {
            alert('Cant get to full screen mode!');
        });
    } else {
        document.exitFullscreen();
    }

    screen.orientation.lock("portrait-primary").then(null, function(error) {
        document.exitFullscreen();
    });

    buttonStart.setAttribute("disabled", "disabled");
    buttonPause.removeAttribute("disabled");
    buttonRestart.removeAttribute("disabled");
    buttonExit.removeAttribute("disabled");
}