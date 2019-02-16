let uluru, map
let ws
let players = []


function createPlayer(playerId, nick) {
    let currentdate = new Date();

    // if local app player
    if(playerId == -1) {
        // player already has generated id
        if( localStorage.getItem('currentPlayerId') !== null ) {
            playerId = localStorage.getItem('currentPlayerId');
        } else {
            // plays for the first time
            playerId = currentdate.valueOf();
            localStorage.setItem('currentPlayerId', playerId);
        }
    }

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}

let currentPlayer = createPlayer(-1, "Player " + Math.round(Math.random(0, 10) * 100));

function initMap() {
    initLocation = { lat: 50.065, lng: 19.945 };
    map = new google.maps.Map(document.getElementById('map'), {
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
    startWebSocket()
    addKeyboardEvents()
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

function startWebSocket() {
    //let url = 'ws://91.121.66.175:8010'
    // let url = 'ws://91.121.6.192:8010'
    // let url = 'wss://echo.websocket.org/'
    let url = 'ws:127.0.0.1:31337'; //websocket-broadcast --noid -p 31337
    ws = new WebSocket(url)
    
    ws.addEventListener('open', onWSOpen)
    ws.addEventListener('message', onWSMessage)
}

function onWSOpen(data) {
    newPlayerNotificationSend()
    console.log(data)
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
    }
}