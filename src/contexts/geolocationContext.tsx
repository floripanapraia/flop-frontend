import React, { createContext, ReactNode, useContext } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { Outlet } from "react-router-dom";

const GeoContext = createContext<ReturnType<typeof useGeolocation> | null>(null);

export const GeolocationProvider:  React.FC<{ children: ReactNode }> = ({ children }) => {
  const geo = useGeolocation();
  return (
    <GeoContext.Provider value={geo}>
      <Outlet />
    </GeoContext.Provider>
  );
};

export function useGeoContext() {
  const ctx = useContext(GeoContext);
  if (!ctx) throw new Error("useGeoContext deve ser usado dentro de GeolocationProvider");
  return ctx;
}
