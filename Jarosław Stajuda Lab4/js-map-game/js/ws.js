import * as Game from './game.js';
import * as Player from './player.js';
import * as Map from './map.js';

export const wsServers = [
    { id: 0, name: 'Local 2', ip: 'ws://127.0.0.1:31337'},
    { id: 1, name: 'Local', ip: 'ws://192.168.2.12:31337'},
    { id: 2, name: 'Wsei-1', ip: 'ws://91.121.6.192:8010'},
    { id: 3, name: 'Wsei-2', ip: 'ws://91.121.66.175:8010'}
];


export function startWebSocket(ip) {
    return new Promise( (resolve, reject) => {
        let server = new WebSocket(ip);
        server.onopen = function() {
            registerWSEventHandlers(server);
            resolve(server);
        };
        server.onerror = function(err) {
            reject(err);
        };
    });
}

export function registerWSEventHandlers(ws) {
    // ws.addEventListener('open', onWSOpen);
    ws.addEventListener('message', onWSMessage);
    // ws.addEventListener('error', onWSError);
}

function onWSOpen(data) {
    console.log("Web Socket started!");
}

function onWSError(error) {
    console.log('WS ERROR!!! ' + error);
    const errSpan = document.querySelector('#selectWsError');
    errSpan.style.color = '#aa0000';
    errSpan.innerHTML = "Can't connect to selected server. Please try another one.";
}

function onWSMessage(e) {
    let data = JSON.parse(e.data);
    let players = Game.getPlayers();

    //filter data
    if(data.channel == 'JS1337') {
        switch(data.request) {
            case 'revealPosition':
                Game.broadcastPosition(Game.getCurrentPlayer());
                break;
            case 'updatePosition':
                updatePlayerPosition(data, players);
                break;
            case 'leaving':
                deletePlayer(data, players);
                break;
            default:
                break;
        }
    }
}

function updatePlayerPosition(data, players) {

    if(data.uid == undefined) return;
    if(data.uid == Game.getCurrentPlayer().id) return;
    
    //check if player exists
    if(players[data.uid] == undefined) {

        //if not
        //create player and add to players table
        let newPlayer = Player.createPlayer(data.uid, data.nick);
        players[newPlayer.id] = newPlayer;

        //set marker
        let markerIcon = Map.createMarkerIcon('http://image.flaticon.com/icons/svg/252/252025.svg');
        let marker = Map.createMarker(newPlayer.nickname, markerIcon);
        newPlayer.marker = marker;

        //set position
        newPlayer.marker.setPosition({
            lat: data.lat,
            lng: data.lng
        });

        //todo - display notification
        console.log(`Player ${players[data.uid].nickname} entered!`);

    } else {
        //otherwise just update player's position
        players[data.uid].marker.setPosition({
            lat: data.lat,
            lng: data.lng
        });
    }

}

function deletePlayer(data, players) {
    //unset marker
    players[data.uid].marker.setMap(null);

    //display notification
    console.log(`Player ${players[data.uid].nickname} left the game!`);

    //remove player from players table
    players[data.uid] = undefined;
}