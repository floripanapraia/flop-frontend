import { useState, useEffect } from "react";
import { getCurrentLocation, Coordinates } from "../services/locationService";

export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState<GeolocationPositionError | null>(null);

  const isGeolocationEnabled = !geoError || geoError.code !== geoError.PERMISSION_DENIED;

  useEffect(() => {
    getCurrentLocation()
      .then((pos) => {
        setCoords(pos);
        setLoading(false);
      })
      .catch((err: GeolocationPositionError) => {
        setGeoError(err);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permissão de localização negada, não é possível realizar a solicitação.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Posição indisponível.");
            break;
          case err.TIMEOUT:
            setError("Tempo esgotado para obter localização.");
            break;
          default:
            setError("Erro desconhecido na geolocalização.");
            break;
        }
        setLoading(false);
      });

  }, []);

  return { coords, error, loading, isGeolocationEnabled };
}
