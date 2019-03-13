export function getLocalPlayerCredentials() {
    let playerId;
    let nick;

    if( localStorage.getItem('currentPlayerId') !== null ) {
        playerId = localStorage.getItem('currentPlayerId');
        nick = localStorage.getItem('currentPlayerNickName');
        return {id: playerId, nickname: nick};
    }
    return -1;
}

export function generatePlayerUID() {
    return "Player " + Math.round(Math.random(0, 10) * 100);
}

export function createCurrentPlayer(nick) {
    let playerId = setLocalPlayerCredentials(nick);
    return createPlayer(playerId, nick);
}

export function createPlayer(playerId, nick) {   
    return {
        id: playerId,
        nickname: nick,
        marker: {}
    }
}

function setLocalPlayerCredentials(nick) {
    let playerId;

    // player already has generated id
    if( localStorage.getItem('currentPlayerId') !== null ) {
        playerId = localStorage.getItem('currentPlayerId');
    } else {
        // plays for the first time
        let currentdate = new Date();
        playerId = currentdate.valueOf();
        localStorage.setItem('currentPlayerId', playerId);
    }
    localStorage.setItem('currentPlayerNickName', nick);
    
    return playerId;
}