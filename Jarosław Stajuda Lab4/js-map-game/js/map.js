import {broadcastPosition} from './game.js';

const mapEl = document.getElementById('map');
let currentPlayer = {};
let map = {};
let initLocation = {};

export function initMap(player) {

    //set default location
    initLocation = { lat: 50.065, lng: 19.945 };
    
    //set local player
    currentPlayer = player;

    //create map
    map = new google.maps.Map(mapEl, {
        zoom: 8,
        center: initLocation,
        keyboardShortcuts: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //set local player marker
    let markerIcon = createMarkerIcon('http://image.flaticon.com/icons/svg/252/252025.svg');
    let marker = createMarker(currentPlayer.nickname, markerIcon);
    currentPlayer.marker = marker;

    //try to get local player localization
    getLocalization();

    //handle key presses
    addKeyboardEvents();

    //show map
    mapEl.parentElement.style.display = 'block';
    mapEl.style.display = 'block';
}

export function createMarkerIcon(iconUrl) {
    return {
        url: iconUrl,
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32,65),
        labelOrigin: new google.maps.Point(20,50)
    };
}

export function createMarker(labelText, markerIcon) {
    return new google.maps.Marker({
        position: initLocation,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: markerIcon,
        label: {
            text: labelText, 
            color: "#a00",
            fontSize: "16px",
            fontWeight: "bold"
        }
    });
}

function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail);
}

function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    map.setCenter(coords);
    currentPlayer.marker.setPosition(coords);
}

function geoFail(err) {
    console.log(err);
}

function addKeyboardEvents() {
    window.addEventListener('keydown', moveMarker);
}

function moveMarker(ev) {
    let lat = currentPlayer.marker.getPosition().lat();
    let lng = currentPlayer.marker.getPosition().lng();

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
    };

    currentPlayer.marker.setPosition(position);
    broadcastPosition(currentPlayer);
}