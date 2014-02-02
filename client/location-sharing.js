
function initLocationSharing(location_callback, error_callback){

    //For generating a random unique ID
    function guid() {
        function s4() { return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16).substring(1); 
        };
        
        return s4() + s4() + '-' + s4() + '-' + s4() + s4();
    }

    var userInfo = {
        id: guid(),
        name: 'Anonymous' + (navigator.platform? ' ('+navigator.platform+')':'')
    }

    // ================================
    // Setup Socket IO 
    // ================================
    var socket = io.connect('/');
    socket.on('connect', function () {
        socket.on('location', function(location){
            if(location.id != userInfo.id) {
                location_callback(location);
            }
        })
    });

    // ================================
    // Setup Geolocation  
    // ================================
    if (!navigator.geolocation) {
        return userInfo;
    }

    function geo_success(position) {
        var longitude = position.coords.longitude;
        userInfo.latitude  = position.coords.latitude;
        userInfo.longitude = position.coords.longitude;
        location_callback(userInfo);
        sendLocation();
    }
    
    function geo_error() {
        error_callback();
    }

    var sendLocationTimeout = null;
    function sendLocation(){
        socket.emit('location', userInfo);
        clearTimeout(sendLocationTimeout);
        sendLocationTimeout = setTimeout(sendLocation, 1000*5);
    }

    var geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);

    return userInfo;
}