export function startWebSocket(url) {
    return new Promise( (resolve, reject) => {
        ws = new WebSocket(url);
        registerWSEventHandlers(ws);
        resolve(ws);
    });
}

export function registerWSEventHandlers(ws) {
    ws.addEventListener('open', onWSOpen);
    ws.addEventListener('message', onWSMessage);
    ws.addEventListener('error', onWSError);
}

function onWSOpen(data) {
    hideStartScreen();
    initMap(currentPlayer, ws);
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
    }
}