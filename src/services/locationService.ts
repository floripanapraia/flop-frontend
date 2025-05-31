export interface Coordinates {
  lat: number;
  lng: number;
}

export function getCurrentLocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 0,
  }
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada pelo navegador."));
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({ lat: coords.latitude, lng: coords.longitude });
        },
        (err) => {
          reject(err);
        },
        options
      );
    }
  });
}
