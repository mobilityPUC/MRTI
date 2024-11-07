document.addEventListener('alpine:init', () => {
    Alpine.start();
});

// Inicializar mapa Leaflet
const map = L.map('map').setView([-22.833664, -47.048420], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 }).addTo(map);

const busStopIcon = L.icon({
    iconUrl: 'bus-stop.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const stops = [
    { lat: -22.83413270737902, lng: -47.05124294784846, name: "Biblioteca", details: "Próxima à entrada principal." },
    { lat: -22.834605412737677, lng: -47.051289851786066, name: "Biblioteca", details: "Próxima à entrada principal." },
    { lat: -22.832786940312445, lng: -47.049827373275015, name: "Prédio H00", details: "Em frente ao prédio H00." },
    { lat: -22.832805466522554, lng: -47.04966723754049, name: "Prédio H00", details: "Em frente ao prédio H00." },
    { lat: -22.834525, lng: -47.044767, name: "Ginásio", details: "Próximo ao ginásio principal." },
    { lat: -22.833995167016017, lng: -47.0454626452645, name: "Ginásio", details: "Próximo ao ginásio principal." },
    { lat: -22.831875219243766, lng: -47.046260604206196, name: "Quadra de Tênis", details: "Próximo ao Bloco B." },
];

stops.forEach(stop => {
    L.marker([stop.lat, stop.lng], { icon: busStopIcon })
      .addTo(map)
      .bindPopup(`<b>${stop.name}</b><br>${stop.details}`);
});

// Busca de pontos
document.getElementById("search").addEventListener("input", function(e) {
    const query = e.target.value.toLowerCase();
    stops.forEach(stop => {
        if (stop.name.toLowerCase().includes(query)) {
            map.setView([stop.lat, stop.lng], 17);
        }
    });
});

// Rota do ônibus interno
let busMarker;
async function fetchBusLocation() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzya2qE3JkSS-LFYE4zOqAvjKwzaudFnRSH2QeFNNviG7NSFx-ZqG1EvOGH7ChMndO1UA/exec');
    const data = await response.json();
    const [latitude, longitude] = data[0].map(Number);

    if (!isNaN(latitude) && !isNaN(longitude)) {
        if (busMarker) {
            busMarker.setLatLng([latitude, longitude]);
        } else {
            busMarker = L.marker([latitude, longitude], { icon: L.icon({
                iconUrl: 'bus.png',
                iconSize: [36, 36],
                iconAnchor: [18, 30],
                popupAnchor: [0, -30]
            }) }).addTo(map).bindPopup("Ônibus Interno");
        }
    }
}
setInterval(fetchBusLocation, 2000);
