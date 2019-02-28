window.addEventListener('keydown', function(e){
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing');
    audioEl = audio;
    console.log(audioEl);
});

function removeTransition(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));

const channelSelect = document.getElementById('audioChannel');
let selectedChannel = channelSelect.options[channelSelect.options.selectedIndex].value;

channelSelect.addEventListener('change', function(e){
    selectedChannel = e.target.options[e.target.options.selectedIndex].value;
}); 

let record = document.getElementById('recordingRecord');
let stop = document.getElementById('recordingStop');

function clearChannel(channel) {
    while (channel.firstChild) {
        channel.removeChild(channel.firstChild);
    }
}

navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];
        let container = {};

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('start', event => {
            audioChunks = [];
        });

        mediaRecorder.addEventListener('stop', event => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const recordedAudio = new Audio(audioUrl);
            
            recordedAudio.controls = true;
            recordedAudio.onloadeddata = function() {
                if(recordedAudio.readyState == 4) {
                    container.appendChild(recordedAudio);

                }
            }
        });

        record.addEventListener('click', event => {
            if(mediaRecorder.state == 'recording') {
                mediaRecorder.stop();
                record.innerHTML = 'Start recording';
            } else {
                container = document.getElementById(selectedChannel + '-container');
                clearChannel(container);
                record.innerHTML = 'Stop recording';
                mediaRecorder.start();
            }
        })
    });