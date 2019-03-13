import {getLocalPlayerCredentials, generatePlayerUID} from './player.js';
import {wsServers} from './ws.js';
import {startGame} from './game.js';

const startScreen = document.querySelector('#startScreen');
const startForm = document.querySelector('#startForm');
const wsSelect = document.querySelector('#selectWsServer');
const msgSpan = document.querySelector('#connectionMsg');
const playerName = document.querySelector('#inputPlayerName');
const playerCred = getLocalPlayerCredentials();

export function initStartScreen() { 
    playerName.value = (playerCred == -1) ? generatePlayerUID() : playerCred.nickname;
    initWsSelect(wsServers);
    startForm.addEventListener('submit', start);
}

function start(ev) {
    ev.preventDefault();
    let selectedServer = getSelectedServer(wsServers);
    connectionPending();
    startGame(selectedServer.ip, playerName.value).then(hideStartScreen).catch(connectionError);
}

function connectionPending() {
    msgSpan.style.color = '#00aa00';
    msgSpan.innerHTML = 'Connecting...';
}

function connectionError(err) {
    msgSpan.style.color = '#aa0000';
    msgSpan.innerHTML = "Can't connect to selected server. Please try another one.";
}

function initWsSelect(wsServers) {
    for(let i = 0; i < wsServers.length; i++) {
        let option = document.createElement('option');
        option.value = wsServers[i].id;
        option.innerHTML = wsServers[i].name;
        wsSelect.appendChild(option);
    }
}

function getSelectedServer(wsServers) {
    let selectedServer = wsSelect.options[wsSelect.selectedIndex].value;
    return wsServers[selectedServer];
}

function hideStartScreen() {
    startScreen.style.display = 'none';
}