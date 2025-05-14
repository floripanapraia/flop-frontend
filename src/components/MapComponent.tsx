import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { PraiaDTO, getPraiaNow } from "../services/beachService";
import BeachInfoWindow from "./BeachInfoWindow";
import { getBeachPhotoByName } from "../services/googlePlacePhotoService";

const LIBRARIES: "places"[] = ["places"];
const MY_MAP_ID = "2cdec756f1d98a30";

interface MapComponentProps {
  activeBeachFromSearch: PraiaDTO | null;
  praias: PraiaDTO[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  activeBeachFromSearch,
  praias,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: -27.5954, lng: -48.548 });
  const [activeBeach, setActiveBeach] = useState<PraiaDTO | null>(null);
  const [activeBeachInfo, setActiveBeachInfo] = useState<PraiaDTO | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const latLngBounds = {
    north: -27.0790,
    south: -28.0001,
    east: -48.0767,
    west: -48.8091,
  };

  const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    cameraControl: false,
    clickableIcons: false,
    mapId: MY_MAP_ID,
    restriction: {
      latLngBounds: latLngBounds,
      strictBounds: false,
    },
  };

  useEffect(() => {
    if (!activeBeachFromSearch) return;
    selectBeach(activeBeachFromSearch);
  }, [activeBeachFromSearch]);
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const selectBeach = async (beach: PraiaDTO) => {
    setActiveBeach(beach);
    setCenter({
      lat: beach.latitude,
      lng: beach.longitude,
    });
    try {
      const info = await getPraiaNow(beach.idPraia);
      setActiveBeachInfo(info);

      if (mapRef.current) {
        const url = await getBeachPhotoByName(
          mapRef.current,
          beach.nomePraia,
          beach.latitude,
          beach.longitude,
          400
        );
        setPhotoUrl(url);
      } else {
        setPhotoUrl(null);
      }
    } catch (e) {
      console.error(e);
      setActiveBeachInfo(null);
    } finally {
      setInfoOpen(true);
    }
  };

  // Função para calcular a distância entre dois pontos usando a fórmula de Haversine
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  // Função chamada ao clicar no mapa para encontrar a praia mais próxima
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat(),
      lng = event.latLng.lng();
    let closest: PraiaDTO | null = null,
      minD = Infinity;
    praias.forEach((beach) => {
      const distance = calculateDistance(
        lat,
        lng,
        beach.latitude,
        beach.longitude
      );
      if (distance < minD) {
        minD = distance;
        closest = beach;
      }
    });
    if (closest) await selectBeach(closest);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      libraries={LIBRARIES}
      mapIds={[MY_MAP_ID]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={handleLoad}
        onClick={handleMapClick} // Adicionando o evento de clique no mapa
        options={mapOptions}
      >
        {activeBeach && (
          <Marker
            position={{
              lat: activeBeach.latitude,
              lng: activeBeach.longitude,
            }}
            title={activeBeach.nomePraia}
            onClick={() => setInfoOpen(true)}
          />
        )}

        {infoOpen && activeBeach && activeBeachInfo && (
          <BeachInfoWindow
            beach={activeBeach}
            info={activeBeachInfo}
            photoUrl={photoUrl}
            onClose={() => setInfoOpen(false)}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
