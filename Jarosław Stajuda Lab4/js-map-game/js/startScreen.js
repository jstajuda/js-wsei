import * as player from "./player.js";

export function initStartScreen() {
    const playerName = document.querySelector('#inputPlayerName');
    playerName.value = "Player " + Math.round(Math.random(0, 10) * 100);

    const wsServers = [
        { id: 0, name: 'Local', ip: 'ws://127.0.0.1:31337'},
        { id: 1, name: 'Wsei-1', ip: 'ws://91.121.6.192:8010'},
        { id: 2, name: 'Wsei-2', ip: 'ws://91.121.66.175:8010'}
    ];
    initWsSelect(wsServers);

    const startForm = document.querySelector('#startForm');
    startForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        currentPlayer = createCurrentPlayer(playerName.value);
        let selectedServer = getSelectedServer(wsServers);
        ws.startWebSocket(selectedServer.ip).then(ws.registerWSEventHandlers);
    });
} 

function hideStartScreen() {
    const startScreen = document.querySelector('#startScreen');
    startScreen.style.display = 'none';
}

function initWsSelect(wsServers) {
    const wsSelect = document.querySelector('#selectWsServer');
    for(let i = 0; i < wsServers.length; i++) {
        let option = document.createElement('option');
        option.value = wsServers[i].id;
        option.innerHTML = wsServers[i].name;
        wsSelect.appendChild(option);
    }
}

function getSelectedServer(wsServers) {
    const wsSelect = document.querySelector('#selectWsServer');
    const selectedServer = wsSelect.options[wsSelect.selectedIndex].value;
    return wsServers[selectedServer];
}