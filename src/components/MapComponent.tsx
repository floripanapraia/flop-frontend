import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { PraiaDTO } from "../services/beachService";
import { useNavigate } from "react-router-dom";

const LIBRARIES: "places"[] = ["places"];

interface MapComponentProps {
  selectedBeach: PraiaDTO | null;
  beachInfo: PraiaDTO | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedBeach,
  beachInfo,
}) => {
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: -27.5954, lng: -48.548 });
  const [infoOpen, setInfoOpen] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (selectedBeach && mapRef.current) {
      const lat = selectedBeach.localizacao.latitude;
      const lng = selectedBeach.localizacao.longitude;
      setCenter({ lat, lng });
      setInfoOpen(true);
    }
  }, [selectedBeach]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // Definindo os limites de Florianópolis
  const latLngBounds = {
    north: -27.3087,
    south: -27.8874,
    east: -48.2954,
    west: -48.71,
  };

  const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    cameraControl: false,
    restriction: {
      latLngBounds: latLngBounds, 
      strictBounds: false, // Permite que o mapa se mova dentro dos limites, mas não fora deles
    },
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      libraries={LIBRARIES}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={handleLoad}
        options={mapOptions}
      >
        {selectedBeach && (
          <>
            <Marker
              position={{
                lat: selectedBeach.localizacao.latitude,
                lng: selectedBeach.localizacao.longitude,
              }}
              title={selectedBeach.nomePraia}
              onClick={() => setInfoOpen(true)} // também abre se clicar no próprio marcador
            />

            {infoOpen && (
              <InfoWindow
                position={{
                  lat: selectedBeach.localizacao.latitude,
                  lng: selectedBeach.localizacao.longitude,
                }}
                onCloseClick={() => setInfoOpen(false)}
              >
                {/* Conteúdo do InfoWindow */}
                <div style={{ maxWidth: 300 }}>
                  <h3 style={{ margin: 0 }}>{selectedBeach.nomePraia}</h3>
                  <strong>Condições hoje:</strong>
                  <ul style={{ paddingLeft: 16, margin: "4px 0" }}>
                    {beachInfo &&
                      Object.entries(beachInfo.condicoesAvaliacoes).map(
                        ([condicao, qtd]) => (
                          <li key={condicao}>
                            {condicao}: {qtd}
                          </li>
                        )
                      )}
                  </ul>
                  <img
                    src={`https://lh3.googleusercontent.com/gps-cs-s/AC9h4npAnwHyJdr9Q9oUQ2MjXm-ztXG1UY-Kc4F-cTN1vFCtNIjcgkC6PbaBnbXnbIs_1NGqvy31o7q8RZoDBwq-K68L2QMC-j-3CrWWeefubW1ThewXV1IN_cJyJpyAXf6nPUDQDy9D=w408-h306-k-no`}
                    alt={selectedBeach.nomePraia}
                    style={{ width: "100%", borderRadius: 4 }}
                  />
                  <button
                    onClick={() => navigate("/praia")}
                    style={{
                      marginTop: 8,
                      padding: "4px 8px",
                      background: "#182E4D",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Saber mais
                  </button>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
