<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import polyline from "polyline"; // Pour décoder l'itinéraire

const apiKey = "5b3ce3597851110001cf6248f05cdb15846545c7ba48d767a5fc7a4b"; // Remplace par ta clé API OpenRouteService


// const start =   [48.607887, 7.595269];
// const end = [48.605698, 7.595941];

const coordinates = [
  // [48.607887, 7.595269],
  // [48.605698, 7.595941],

  [48.5812, 7.7519], // Place Saint-Étienne (Point de départ)
  [48.5819, 7.7587], // Quai des Pêcheurs
  [48.5810, 7.7502], // Restaurant "Au Canon"       (Non loin de la cathédrale / place Gutenberg)
  [48.5792, 7.7494], // Quai Saint-Nicolas
  [48.5814, 7.7506], // Rue du Vieux-Marché-aux-Poissons
  [48.5832, 7.7412], // Rue des Dentelles
  [48.5822, 7.7390], // Quai de la Petite France
  [48.5824, 7.7398], // Place Benjamin Zix
  [48.5825, 7.7393], // Pont du Faisan (Pont Tournant)
  [48.5816, 7.7360], // Les Ponts Couverts
  [48.5817, 7.7345], // Barrage Vauban
  [48.5830, 7.7415], // Rue du Bain-aux-Plantes
  [48.5849, 7.7452], //
  [48.5838, 7.7429], // Grand’Rue
  [48.5833, 7.7460], // Place Kléber
  [48.5810, 7.7486], // Place du Temple Neuf
  [48.5812, 7.7508] // Cathédrale de Strasbourg


  // [ 7.75474902572825, 48.5833031458601 ],
  // [ 7.757864979212301, 48.583131944489466 ],

  // [7.754749, 48.583303],
  // [7.757865, 48.583132],
  // [7.751670, 48.579134],
  // [7.748786, 48.578740],
  // [7.749860, 48.580206],
  // [7.743193, 48.580928],
  // [7.740329, 48.581085],
  // [7.742244, 48.581453],
  // [7.741479, 48.581365],
  // [7.739259, 48.580311],
  // [7.738007, 48.579748],
  // [7.740577, 48.581540],
  // [7.741832, 48.581881],
  // [7.744127, 48.581498],
  // [7.745787, 48.583562 ]
];
// 48.5831319444894,7.7578649792123
// const coordinates  = [[8.681495,49.41461],[8.686507,49.41943],[8.687872,49.420318]];

const start = coordinates[0];
const end = coordinates[coordinates.length - 1];

onMounted(() => {
  const map = L.map("map").setView(start, 6); // Vue centrée sur le point de départ

  // Fond de carte OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Ajouter les marqueurs pour départ et arrivée
  // L.marker(start.reverse()).addTo(map).bindPopup("Départ").openPopup();
  // L.marker(end.reverse()).addTo(map).bindPopup("Arrivée");


  // Tracer l'itinéraire sur la carte
  const routeLine = L.polyline(coordinates, { color: "blue", weight: 4 }).addTo(map);

  // Adapter la carte pour voir tout l'itinéraire
  map.fitBounds(routeLine.getBounds());
  // Fonction pour récupérer et tracer l'itinéraire
  // const fetchRoute = async () => {
  //   const url = "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";
  //
  //   // try {
  //   //   let request = new XMLHttpRequest();
  //   //
  //   //   request.open('POST', "https://api.openrouteservice.org/v2/directions/driving-car/geojson");
  //   //
  //   //   request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
  //   //   request.setRequestHeader('Content-Type', 'application/json');
  //   //   request.setRequestHeader('Authorization', apiKey);
  //   //
  //   //   request.onreadystatechange = function () {
  //   //     if (this.readyState === 4) {
  //   //       console.log('Status:', this.status);
  //   //       console.log('Headers:', this.getAllResponseHeaders());
  //   //       console.log('Body:', this.responseText);
  //   //     }
  //   //   };
  //   //
  //   //   const body = '{"coordinates":[[8.681495,49.41461],[8.686507,49.41943],[8.687872,49.420318]]}';
  //   //
  //   //   request.send(body);
  //   //
  //   //   const toto = 42;
  //   // } catch (e) {
  //   //
  //   // }
  //
  //
  //   try {
  //     const response = await axios.post(url, {
  //       // coordinates: [[8.681495,49.41461],[8.686507,49.41943],[8.687872,49.420318]], // Ordre correct : [longitude, latitude]
  //       coordinates,
  //       // radiuses: [1000, 1000], // Recherche plus large
  //       // snap_preference: "any", // Ajuste le point sur la route la plus proche
  //     }, {
  //       headers: {
  //         "Authorization": apiKey,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //
  //     console.log("Réponse API :", response.data); // Vérifier la réponse dans la console
  //
  //     if (!response.data || !response.data.features || response.data.features.length === 0) {
  //       console.error("Aucune route trouvée.");
  //       return;
  //     }
  //
  //     // Récupérer les coordonnées de l'itinéraire
  //     const routeCoordinates = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  //
  //     // Tracer l'itinéraire sur la carte
  //     const routeLine = L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(map);
  //
  //     // Adapter la carte pour voir tout l'itinéraire
  //     map.fitBounds(routeLine.getBounds());
  //   } catch (error) {
  //     console.error("Erreur API OpenRouteService :", error);
  //   }
  // };
  //
  // fetchRoute(); // Exécuter la récupération de l'itinéraire
});
</script>

<style scoped>
</style>
