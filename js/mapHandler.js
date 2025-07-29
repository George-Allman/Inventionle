let map;
let marker = null;
let guessCallback = null;

const defaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function initMap(mapId) {
  const mapInstance = L.map(mapId).setView([20, 0], 2); // global view

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance);

  if (mapId === 'map') {
    map = mapInstance;
    mapInstance.on('click', onMapClick);
  }

  return mapInstance;
}

function onMapClick(e) {
  const { lat, lng } = e.latlng;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], {
      draggable: true,
      icon: defaultIcon
    }).addTo(map);

    marker.on('dragend', () => {
      if (guessCallback) guessCallback();
    });
  }

  if (guessCallback) guessCallback();
}

function getMarkerLatLng() {
  return marker ? marker.getLatLng() : null;
}

function hasGuessBeenPlaced() {
  return marker !== null;
}

function setOnGuessPlacedCallback(callback) {
  guessCallback = callback;
}

// Expose globally
window.initMap = initMap;
window.getMarkerLatLng = getMarkerLatLng;
window.hasGuessBeenPlaced = hasGuessBeenPlaced;
window.setOnGuessPlacedCallback = setOnGuessPlacedCallback;