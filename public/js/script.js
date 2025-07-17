const socket = io();

// to check the geolocation

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting location: ", error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
  );
}

// for allowing my location
// 0 , 0 means the center of the map & 16 is the zoom level

const map = L.map("map").setView([0, 0],15);

// for the map tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    Attribution: "MIK SERVICES B17 MULTI GARDENS"
}).addTo(map);


const markers = {};
socket.on("receiveLocation", (location) => {
    const {id , latitude, longitude} = location;
    map.setView([latitude, longitude] );

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)}
})

socket.on("userDisconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
}})