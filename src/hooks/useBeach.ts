import { useContext } from "react";
import { BeachContext, BeachContextType } from "../contexts/beachContext";

export function useBeach(): BeachContextType {
  const context = useContext(BeachContext);
  if (!context) {
    throw new Error("useBeach deve ser usado dentro de um <BeachProvider>");
  }
  return context;
}
