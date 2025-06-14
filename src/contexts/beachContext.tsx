import React, { createContext, useState, ReactNode } from "react";

export interface BeachContextType {
  praiaId: number | null;
  praiaPlaceId: string | null;
  praiaNome: string | null;
  praiaFotoUrl: string | null;
  totalAvaliacoesDoDia: number | null;
  setPraiaId: (id: number | null) => void;
  setPraiaPlaceId: (id: string | null) => void;
  setPraiaNome: (nome: string | null) => void;
  setPraiaFotoUrl: (url: string | null) => void;
  setTotalAvaliacoesDoDia: (total: number | null) => void;
}

export const BeachContext = createContext<BeachContextType | undefined>(
  undefined
);

export const BeachProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [praiaId, _setPraiaId] = useState<number | null>(() => {
    const stored = localStorage.getItem("praiaId");
    return stored ? Number(stored) : null;
  });

  const [praiaPlaceId, setPraiaPlaceId] = useState<string | null>(null);

  const [praiaNome, _setPraiaNome] = useState<string | null>(() => {
    return localStorage.getItem("praiaNome") ?? null;
  });

  const [praiaFotoUrl, _setPraiaFotoUrl] = useState<string | null>(() => {
    return localStorage.getItem("praiaFotoUrl") ?? null;
  });

  const [totalAvaliacoesDoDia, setTotalAvaliacoesDoDia] = useState<
    number | null
  >(null);

  const setPraiaId = (id: number | null) => {
    _setPraiaId(id);
    if (id !== null) {
      localStorage.setItem("praiaId", String(id));
    } else {
      localStorage.removeItem("praiaId");
    }
  };

  const setPraiaNome = (nome: string | null) => {
    _setPraiaNome(nome);
    if (nome !== null) {
      localStorage.setItem("praiaNome", nome);
    } else {
      localStorage.removeItem("praiaNome");
    }
  };

  const setPraiaFotoUrl = (url: string | null) => {
    _setPraiaFotoUrl(url);
    if (url !== null) {
      localStorage.setItem("praiaFotoUrl", url);
    } else {
      localStorage.removeItem("praiaFotoUrl");
    }
  };

  

  return (
    <BeachContext.Provider
      value={{
        praiaId,
        praiaPlaceId,
        praiaNome,
        praiaFotoUrl,
        totalAvaliacoesDoDia,
        setPraiaId,
        setPraiaPlaceId,
        setPraiaNome,
        setPraiaFotoUrl,
        setTotalAvaliacoesDoDia,
      }}
    >
      {children}
    </BeachContext.Provider>
  );
};
