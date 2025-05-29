// src/components/EvaluationFeed.tsx
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    initMap?: () => void;
  }
}

const EvaluationFeed_google_loc: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Função de tratamento de erro de geolocalização
  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng,
    map: google.maps.Map
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  useEffect(() => {
    // Define initMap global para o callback do script
    window.initMap = () => {
      if (!mapContainerRef.current) return;

      // Inicializa o mapa
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: -27.598767, lng: -48.551380 },
        zoom: 15,
      });

      // Cria o InfoWindow
      const infoWindow = new google.maps.InfoWindow();

      // Botão customizado
      const locationButton = document.createElement("button");
      Object.assign(locationButton.style, {
        backgroundColor: "#fff",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        borderRadius: "2px",
        padding: "8px 12px",
        fontSize: "14px",
        cursor: "pointer",
        margin: "10px",
        position: "relative",
        zIndex: "1",
      });
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

      // Evento de clique no botão
      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              infoWindow.setPosition(pos);
              infoWindow.setContent("Location found.");
              infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter()!, map);
            }
          );
        } else {
          handleLocationError(false, infoWindow, map.getCenter()!, map);
        }
      });
    };

    // Carrega o script da Google Maps JS API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap&v=weekly`;
    script.async = true;
    document.head.appendChild(script);

    // Cleanup: remover callback ao desmontar
    return () => {
      delete window.initMap;
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
};

export default EvaluationFeed_google_loc;
