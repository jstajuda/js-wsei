import {startWebSocket, registerWSEventHandlers} from './ws.js';
import {createCurrentPlayer} from './player.js';
import {initMap} from './map.js';

let ws = {};
let players = [];
let currentPlayer = {};

export function startGame(ip, playerName) {
    
    return new Promise( (resolve, reject) => {
        startWebSocket(ip).then((server) => {
            
            //get WS client instance
            ws = server;

            //create local player
            currentPlayer = createCurrentPlayer(playerName);

            //create map, set players
            initMap(currentPlayer);
            enterMap(currentPlayer);

            resolve();
        }).catch((err) => {
            console.log('WS ERROR!!!' + err);
            reject();
        });
    });
    
}

export function enterMap(player) {
    broadcastPosition(player);
    requestPositions();
}

export function leavingGame() {
    let data = {
        uid: currentPlayer.id,
        request: 'leaving'
    }
    wsSend(data);
}

export function broadcastPosition(player) {
    let lat = player.marker.getPosition().lat();
    let lng = player.marker.getPosition().lng();
    let data = {
        lat: lat,
        lng: lng,
        uid: player.id,
        nick: player.nickname,
        request: 'updatePosition'
    }
    wsSend(data);
}

export function requestPositions() {
    let data = {
        request: 'revealPosition'
    }
    wsSend(data);
}

export function wsSend(data) {
    data.channel = "JS1337";
    ws.send(JSON.stringify(data));
}

export function getPlayers() {
    return players;
}

export function getCurrentPlayer() {
    return currentPlayer;
}

