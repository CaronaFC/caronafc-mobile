import * as Location from "expo-location";
import { CoordsPoint } from "../types/coords";

/**
 * Converte endereço em coordenadas (lat/lon).
 */
export async function geocodeAddress(
  address: string
): Promise<CoordsPoint | null> {
  try {
    const geocoded = await Location.geocodeAsync(address);
    if (geocoded.length > 0) {
      const { latitude, longitude } = geocoded[0];
      return { latitude, longitude };
    }
  } catch (error) {
    console.error("Erro ao geocodificar o endereço:", error);
  }
  return null;
}

/**
 * Converte coordenadas em um endereço legível.
 */
export async function reverseGeocodeCoords(
  point: CoordsPoint
): Promise<string> {
  try {
    const [result] = await Location.reverseGeocodeAsync(point);
    if (result) {
      return `${result.street || result.name || ""}, ${
        result.subregion || result.region || result.city || ""
      }`;
    }
  } catch (error) {
    console.error("Erro ao converter coordenadas em endereço:", error);
  }
  return "";
}

export function getRegionForCoordinates(points: CoordsPoint[]) {
  if (points.length === 0) {
    return null;
  }

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const deltaLat = (maxLat - minLat) * 1.5 || 0.01; // margem extra
  const deltaLng = (maxLng - minLng) * 1.5 || 0.01;

  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: deltaLat,
    longitudeDelta: deltaLng,
  };
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
