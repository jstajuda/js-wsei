let uluru, map
let ws
let players = []


function createPlayer(playerId, nick) {
    let currentdate = new Date();

    if(playerId == -1) {
        playerId = currentdate.valueOf();
    }

    let player = {
        id: playerId,
        nickname: nick,
        marker: {}
    }

    players[player.id] = player;
    return player;
}
let currentPlayer = createPlayer(-1, "Player 1");

function initMap() {
    heaven = { lat: 55.752, lng: 37.616 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: heaven,
        keyboardShortcuts: false
    });
    
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    marker = new google.maps.Marker({
        position: heaven,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image
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
    console.log(data)
}

function onWSMessage(e) {
    let data = JSON.parse(e.data)

    if(data.uid !== undefined) {
        if(players[data.uid] == undefined) {
            let newPlayer = createPlayer(data.uid, data.nick);
            newPlayer.marker = new google.maps.Marker({
                position: heaven,
                map: map,
                animation: google.maps.Animation.DROP,
                //icon: image
            });
            newPlayer.marker.setPosition({
                lat: data.lat,
                lng: data.lng
            });
        } 
        else
        if(players[data.uid].id !== currentPlayer.id) {
            players[data.uid].marker.setPosition({
                lat: data.lat,
                lng: data.lng
            });
        }
    }
}