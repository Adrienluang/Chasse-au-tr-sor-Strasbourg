import { describe, it, expect } from 'vitest'
import { toGraphHopperCoords, haversineDistance } from '~/utils/coords'

describe('toGraphHopperCoords', () => {
  it('inverse lat/lng en lng/lat', () => {
    const latLng: [number, number] = [48.5833, 7.7547]
    const lngLat = toGraphHopperCoords(latLng)
    expect(lngLat).toEqual([7.7547, 48.5833])
  })

  it('ne modifie pas le tableau source', () => {
    const latLng: [number, number] = [48.5, 7.5]
    toGraphHopperCoords(latLng)
    expect(latLng).toEqual([48.5, 7.5])
  })
})

describe('haversineDistance', () => {
  it('retourne 0 pour deux points identiques', () => {
    const p: [number, number] = [48.5833, 7.7547]
    expect(haversineDistance(p, p)).toBeCloseTo(0)
  })

  it('calcule ~111km pour 1 degré de latitude', () => {
    const a: [number, number] = [0, 0]
    const b: [number, number] = [1, 0]
    const dist = haversineDistance(a, b)
    expect(dist).toBeGreaterThan(110_000)
    expect(dist).toBeLessThan(112_000)
  })

  it('Place Saint-Étienne → Cathédrale ≈ 425m', () => {
    const saintEtienne: [number, number] = [48.583303, 7.754749]
    const cathedrale: [number, number] = [48.581986, 7.751110]
    const dist = haversineDistance(saintEtienne, cathedrale)
    // Distance approximative, marge de ±100m
    expect(dist).toBeGreaterThan(300)
    expect(dist).toBeLessThan(550)
  })
})
