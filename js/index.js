let uluru, map, marker
let ws
let players = {}
let nick = '1'

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

    players[nick] = marker;

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
    marker.setPosition(coords)
}

function geoFail(err) {
    console.log(err)
}

function addKeyboardEvents() {
    window.addEventListener('keydown', moveMarker)
}
function moveMarker(ev) {
    let lat = marker.getPosition().lat()
    let lng = marker.getPosition().lng()

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
        id: nick
    }
    marker.setPosition(position)
    ws.send(JSON.stringify(wsData))
}

function startWebSocket() {
    let url = 'ws://91.121.6.192:8010'
    ws = new WebSocket(url)
    
    ws.addEventListener('open', onWSOpen)
    ws.addEventListener('message', onWSMessage)
}

function onWSOpen(data) {
    console.log(data)
}

function onWSMessage(e) {
    let data = JSON.parse(e.data)

    if (!players[data.id]) {
        players[data.id] = new google.maps.Marker({
            position: { lat: data.lat, lng: data.lng },
            map: map,
            animation: google.maps.Animation.DROP
        })
    } else {
        players[data.id].setPosition({
            lat: data.lat,
            lng: data.lng
        })
    }
}