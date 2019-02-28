export class Player {

    constructor(obj) {
        id = obj.id || -1;
        nickname = obj.nickname || "Player";
        marker = {};
    }

}

export function createCurrentPlayer(nick) {
    let playerId = 0;
    // player already has generated id
    if( localStorage.getItem('currentPlayerId') !== null ) {
        playerId = localStorage.getItem('currentPlayerId');
    } else {
        // plays for the first time
        playerId = currentdate.valueOf();
        localStorage.setItem('currentPlayerId', playerId);
    }

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}

export function createPlayer(playerId, nick) {
    let currentdate = new Date();

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}

export function newPlayerNotificationSend() {
    let lat = currentPlayer.marker.getPosition().lat();
    let lng = currentPlayer.marker.getPosition().lng();
    let wsData = {
        lat: lat,
        lng: lng,
        uid: currentPlayer.id,
        nick: currentPlayer.nickname,
        request: 'showYourselves'
    }
    ws.send(JSON.stringify(wsData))
}

export function broadcastPosition() {
    let lat = currentPlayer.marker.getPosition().lat();
    let lng = currentPlayer.marker.getPosition().lng();
    let wsData = {
        lat: lat,
        lng: lng,
        uid: currentPlayer.id,
        nick: currentPlayer.nickname
    }
    ws.send(JSON.stringify(wsData))
}


