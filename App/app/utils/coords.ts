/**
 * Convertit des coordonnées [lat, lng] (format interne/Leaflet)
 * en [lng, lat] (format GraphHopper).
 * Toujours utiliser cette fonction pour les appels API GraphHopper.
 */
export function toGraphHopperCoords(latLng: [number, number]): [number, number] {
  const [lat, lng] = latLng
  return [lng, lat]
}

/**
 * Calcule la distance en mètres entre deux points GPS
 * via la formule de Haversine.
 */
export function haversineDistance(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6371000 // rayon terrestre en mètres
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinDLng * sinDLng

  return 2 * R * Math.asin(Math.sqrt(h))
}
