export interface Waypoint {
  id: number
  name: string
  coords: [number, number] // [lat, lng]
  description: string
  imageHint: string
}
