let map;
let currentPlayer = {};
let ws = {};
export const initLocation = { lat: 50.065, lng: 19.945 };

export function initMap(_currentPlayer, _ws) {
    currentPlayer = _currentPlayer;
    ws = _ws;
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
    addKeyboardEvents()
}

export function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)
}

export function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    map.setCenter(coords)
    currentPlayer.marker.setPosition(coords)
}

export function geoFail(err) {
    console.log(err)
}

export function addKeyboardEvents() {
    window.addEventListener('keydown', moveMarker)
}

export function moveMarker(ev) {
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