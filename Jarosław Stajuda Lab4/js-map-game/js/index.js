let map;
let ws;
let players = [];
let currentPlayer= {};

// #region start screen
//websocket-broadcast --noid -p 31337
function initStartScreen() {
    const playerName = document.querySelector('#inputPlayerName');``
    let playerCred = getLocalPlayerCredentials();
    if( playerCred !== -1) {
        playerName.value = playerCred.nickname;
    } else {
        playerName.value = "Player " + Math.round(Math.random(0, 10) * 100);
    }

    const wsServers = [
        { id: 0, name: 'Local', ip: 'ws://192.168.2.12:31337'},
        { id: 1, name: 'Wsei-1', ip: 'ws://91.121.6.192:8010'},
        { id: 2, name: 'Wsei-2', ip: 'ws://91.121.66.175:8010'}
    ];
    initWsSelect(wsServers);

    const startForm = document.querySelector('#startForm');
    startForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        currentPlayer = createCurrentPlayer(playerName.value);
        let selectedServer = getSelectedServer(wsServers);
        startWebSocket(selectedServer.ip).then(registerWSEventHandlers);
    });
} 

function hideStartScreen() {
    startScreen = document.querySelector('#startScreen');
    startScreen.style.display = 'none';
}

function startWebSocket(url) {
    return new Promise( (resolve, reject) => {
        ws = new WebSocket(url);
        registerWSEventHandlers(ws);
        resolve(ws);
    });
}

function registerWSEventHandlers(ws) {
    ws.addEventListener('open', onWSOpen);
    ws.addEventListener('message', onWSMessage);
    ws.addEventListener('error', onWSError);
}

function initWsSelect(wsServers) {
    const wsSelect = document.querySelector('#selectWsServer');
    console.log(wsSelect);
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
// #endregion

//#region ws event handlers
function onWSOpen(data) {
    hideStartScreen();
    initMap();
    newPlayerNotificationSend();
    console.log(data)
}

function onWSError(error) {
    console.log('WS ERROR!!!' + error);
    const errSpan = document.querySelector('#selectWsError');
    errSpan.style.color = '#aa0000';
    errSpan.innerHTML = "Can't connect to selected server. Please try another one.";
}

function onWSMessage(e) {
    let data = JSON.parse(e.data)

    // catch data with player uid
    if(data.uid !== undefined) {

        // player not registered in current app
        if(players[data.uid] == undefined) {
            let newPlayer = createPlayer(data.uid, data.nick);

            let markerIcon = {
                url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
                scaledSize: new google.maps.Size(40, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(32,65),
                labelOrigin: new google.maps.Point(20,50)
            };
        
            let marker = new google.maps.Marker({
                position: initLocation,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: markerIcon,
                label: {
                    text: newPlayer.nickname, 
                    color: "#a00",
                    fontSize: "16px",
                    fontWeight: "bold"
                }
            });
            newPlayer.marker = marker;

            newPlayer.marker.setPosition({
                lat: data.lat,
                lng: data.lng
            });
        } 
        else
        // discard message from current player
        if(players[data.uid].id !== currentPlayer.id) {
            players[data.uid].marker.setPosition({
                lat: data.lat,
                lng: data.lng
            });
        }

        if(data.request == 'showYourselves') {
            broadcastPosition();
        }

        if(data.left == true) {
            players[data.uid].marker.setMap(null);
            console.log(`Player ${players[data.uid].nickname} has left the game!`);
        }
    }
}
//#endregion

//#region map related stuff
function initMap() {
    initLocation = { lat: 50.065, lng: 19.945 };
    const mapEl = document.getElementById('map');
    map = new google.maps.Map(mapEl, {
        zoom: 8,
        center: initLocation,
        keyboardShortcuts: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    let markerIcon = {
        url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32,65),
        labelOrigin: new google.maps.Point(20,50)
    };

    let marker = new google.maps.Marker({
        position: initLocation,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: markerIcon,
        label: {
            text: currentPlayer.nickname, 
            color: "#a00",
            fontSize: "16px",
            fontWeight: "bold"
        }
    });

    currentPlayer.marker = marker;

    getLocalization()
    addKeyboardEvents()
    mapEl.parentElement.style.display = 'block';
    mapEl.style.display = 'block';

}

function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)
}

function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    map.setCenter(coords)
    currentPlayer.marker.setPosition(coords)
}

function geoFail(err) {
    console.log(err)
}

function addKeyboardEvents() {
    window.addEventListener('keydown', moveMarker)
}
function moveMarker(ev) {
    let lat = currentPlayer.marker.getPosition().lat()
    let lng = currentPlayer.marker.getPosition().lng()

    switch (ev.code) {
        case 'ArrowUp':
            lat += 0.1
            break;
        case 'ArrowDown':
            lat -= 0.1
            break;
        case 'ArrowLeft':
            lng -= 0.1
            break;
        case 'ArrowRight':
            lng += 0.1
            break;
    }
    let position = {
        lat,
        lng
    }
    let wsData = {
        lat: lat,
        lng: lng,
        uid: currentPlayer.id,
        nick: currentPlayer.nickname
    }
    currentPlayer.marker.setPosition(position)
    ws.send(JSON.stringify(wsData))
}
//#endregion 

//#region player
function createCurrentPlayer(nick) {
    let currentdate = new Date();

    // player already has generated id
    if( localStorage.getItem('currentPlayerId') !== null ) {
        playerId = localStorage.getItem('currentPlayerId');
    } else {
        // plays for the first time
        playerId = currentdate.valueOf();
        localStorage.setItem('currentPlayerId', playerId);
        localStorage.setItem('currentPlayerNickName', nick)
    }

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}

function getLocalPlayerCredentials() {
    if( localStorage.getItem('currentPlayerId') !== null ) {
        playerId = localStorage.getItem('currentPlayerId');
        nick = localStorage.getItem('currentPlayerNickName');
        return {id: playerId, nickname: nick};
    }
    return -1;
}

function createPlayer(playerId, nick) {
    let currentdate = new Date();

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}

function newPlayerNotificationSend() {
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

function playerQuitNotificationSend() {
    let lat = currentPlayer.marker.getPosition().lat();
    let lng = currentPlayer.marker.getPosition().lng();
    let wsData = {
        lat: lat,
        lng: lng,
        uid: currentPlayer.id,
        nick: currentPlayer.nickname,
        left: true
    }
    ws.send(JSON.stringify(wsData));
}

window.addEventListener('beforeunload', playerQuitNotificationSend);

function broadcastPosition() {
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

//#endregion


initStartScreen();