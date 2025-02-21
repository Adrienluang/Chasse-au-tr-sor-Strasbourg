<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const apiKey = "a0eafce4-edaf-41e2-9df9-f4c4a33ad85e"; // Remplace par ta clé GraphHopper

const coordinates = [
    { name: 'Place Saint-Étienne (Point de départ)', coord: [ 48.583303, 7.754749 ] },
    { name: 'Quai des Pêcheurs', coord: [ 48.583132, 7.757865 ] },
    { name: 'Restaurant "Au Canon"       (Non loin de la cathédrale / place Gutenberg)', coord: [ 48.579134, 7.751670 ] },
    { name: 'Quai Saint-Nicolas', coord: [ 48.578740, 7.748786 ] },
    { name: 'Rue du Vieux-Marché-aux-Poissons', coord: [ 48.580206, 7.749860 ] },
    { name: 'Rue des Dentelles', coord: [ 48.580928, 7.743193 ] },
    { name: 'Quai de la Petite France', coord: [ 48.581085, 7.740329 ] },
    { name: 'Place Benjamin Zix', coord: [ 48.581453, 7.742244 ] },
    { name: 'Pont du Faisan (Pont Tournant)', coord: [ 48.581365, 7.741479 ] },
    { name: 'Les Ponts Couverts', coord: [ 48.580311, 7.739259 ] },
    { name: 'Barrage Vauban', coord: [ 48.579748, 7.738007 ] },
    { name: 'Rue du Bain-aux-Plantes', coord: [ 48.581540, 7.740577 ] },
    { name: 'Grand’Rue', coord: [ 48.581881, 7.741832 ] },
    { name: 'Rue St-Hélène', coord: [ 48.581498, 7.744127 ] },
    { name: 'Place Kléber', coord: [ 48.583562, 7.745787 ] },
    { name: 'Place du Temple Neuf', coord: [ 48.583525622459184, 7.747918710384864 ] },
    { name: 'Cathédrale de Strasbourg', coord: [ 48.58198626194183, 7.751109881062819 ] }
];
const start = coordinates[0];
const end = coordinates[coordinates.length - 1];

onMounted(() => {
  const map = L.map("map").setView(start.coord, 15);

  // Ajouter OpenStreetMap comme fond de carte
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Ajouter les marqueurs pour le départ et l'arrivée
  L.marker(start.coord).addTo(map).bindPopup("Départ");

  const fetchRoute = async () => {
    const url = `https://graphhopper.com/api/1/route?key=${apiKey}`;
    try {
      const response = await axios.post(url, {

        "points": coordinates.map((_) => ([  ..._.coord ].reverse())),
        "snap_preventions": [
          "motorway",
          "ferry",
          "tunnel"
        ],
        "details": [
          "road_class",
          "surface"
        ],
        "profile": "foot",
        "locale": "en",
        "instructions": true,
        "calc_points": true,
        "points_encoded": false
      });

      if (!response.data.paths || response.data.paths.length === 0) {
        console.error("Aucun itinéraire trouvé.");
        return;
      }

      coordinates.forEach((_) => {
        L.marker(_.coord).addTo(map).bindPopup(_.name);
      })


      const routeCoordinates = response.data.paths[0].points.coordinates.map(([lng, lat]) => [lat, lng]);

      const routeLine = L.polyline(routeCoordinates, { color: "blue", weight: 4 }).addTo(map);



      map.fitBounds(routeLine.getBounds());
    } catch (error) {
      console.error("Erreur API GraphHopper :", error);
    }
  };

  fetchRoute();
});
</script>

<style scoped>

</style>
