import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { getAllPraias } from "../services/beachService";

const MapComponent = () => {
  const [center, setCenter] = useState({
    lat: -27.5954,
    lng: -48.548,
  });

  const [beaches, setBeaches] = useState<any[]>([]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const data = await getAllPraias();  
        setBeaches(data);  
      } catch (error) {
        console.error("Erro ao carregar praias:", error);
      }
    };

    fetchBeaches();
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const newCenter = {
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    };
    setCenter(newCenter);
  };

  // Definindo os limites de Florianópolis
  const latLngBounds = {
    north: -27.3087, // Limite norte de Florianópolis
    south: -27.8874, // Limite sul de Florianópolis
    east: -48.2954, // Limite leste de Florianópolis
    west: -48.71, // Limite oeste de Florianópolis
  };

  const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    cameraControl: false,
    restriction: {
      latLngBounds: latLngBounds, // Define os limites de Florianópolis
      strictBounds: false, // Permite que o mapa se mova dentro dos limites, mas não fora deles
    },
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {beaches.map((beach, index) => (
          <Marker
            key={index}
            position={{
              lat: beach.geometry.location.lat(),
              lng: beach.geometry.location.lng(),
            }}
            title={beach.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
