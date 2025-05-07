// src/components/BeachInfoWindow.tsx
import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { PraiaDTO } from "../services/beachService";

const CONDITION_ICONS: Record<string, string> = {
  AGUA_GELADA: "/assets/iconFull/aguagelada.svg",
  AGUA_VIVA: "/assets/iconFull/AGUAVIVA.svg",
  ALIMENTACAO: "/assets/iconFull/alimentacao.svg",
  CHUVA: "/assets/iconFull/chuva.svg",
  ESTACIONAMENTO: "/assets/iconFull/estacionamento.svg",
  LIMPA: "/assets/iconFull/limpa.svg",
  LIXO: "/assets/iconFull/lixo.svg",
  LOTADA: "/assets/iconFull/LOTADA.svg",
  MAR_CALMO: "/assets/iconFull/marcalmo.svg",
  MUSICA: "/assets/iconFull/musica.svg",
  NUBLADO: "/assets/iconFull/nublado.svg",
  ONDA: "/assets/iconFull/onda.svg",
  SALVA_VIDAS: "/assets/iconFull/salvavidas.svg",
  SOL: "/assets/iconFull/SOL.svg",
  VENTO: "/assets/iconFull/vento.svg",
};

interface BeachInfoWindowProps {
  beach: PraiaDTO;
  info: PraiaDTO;
  photoUrl: string | null;
  onClose: () => void;
}

export default function BeachInfoWindow({
  beach,
  info,
  photoUrl,
  onClose,
}: BeachInfoWindowProps) {
  const navigate = useNavigate();

  return (
    <InfoWindow
      position={{
        lat: beach.latitude,
        lng: beach.longitude,
      }}
      onCloseClick={onClose}
    >
      <div style={{ maxWidth: 300 }}>
        <h3 style={{ margin: 0 }}>{beach.nomePraia}</h3>
        {/* Foto da praia, se disponível */}
        
          <img
            src={beach.imagem}
            alt={beach.nomePraia}
            style={{
              width: "100%",
              borderRadius: 4,
              margin: "8px 0",
              objectFit: "cover",
            }}
          />

        <strong>Condições hoje:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "4px 0" }}>
          {Object.entries(info.condicoesAvaliacoes).map(([condicao, valor]) => {
            const icon = CONDITION_ICONS[condicao];
            return (
              <li
                key={condicao}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "4px 0",
                }}
              >
                {icon ? (
                  <img
                    src={icon}
                    alt={condicao}
                    style={{ width: 20, marginRight: 8 }}
                  />
                ) : (
                  <strong style={{ marginRight: 8 }}>{condicao}:</strong>
                )}
                <span>{valor} votos</span>
              </li>
            );
          })}
        </ul>
        
        <button
          onClick={() => navigate(`/praia/${beach.idPraia}`)}
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
  );
}
