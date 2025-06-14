// src/components/BeachInfoWindow.tsx
import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { PraiaDTO } from "../services/beachService";
import { useBeach } from "../hooks/useBeach";

const CONDITION_ICONS: Record<string, string> = {
  AGUA_GELADA: "/assets/iconFull/agua_gelada.svg",
  AGUA_VIVA: "/assets/iconFull/AGUA_VIVA.svg",
  ALIMENTACAO: "/assets/iconFull/alimentacao.svg",
  CHUVA: "/assets/iconFull/chuva.svg",
  ESTACIONAMENTO: "/assets/iconFull/estacionamento.svg",
  LIMPA: "/assets/iconFull/limpa.svg",
  LIXO: "/assets/iconFull/lixo.svg",
  LOTADA: "/assets/iconFull/LOTADA.svg",
  MAR_CALMO: "/assets/iconFull/mar_calmo.svg",
  MUSICA: "/assets/iconFull/musica.svg",
  NUBLADO: "/assets/iconFull/nublado.svg",
  ONDA: "/assets/iconFull/onda.svg",
  SALVA_VIDAS: "/assets/iconFull/salva_vidas.svg",
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
  const { setPraiaId, setPraiaNome, setPraiaFotoUrl, setTotalAvaliacoesDoDia } =
    useBeach();
  const navigate = useNavigate();

  return (
    <InfoWindow
      position={{ lat: beach.latitude, lng: beach.longitude }}
      onCloseClick={onClose}
    >
      <div className="max-w-[80vw] sm:max-w-sm p-2 sm:p-3 rounded-lg bg-white shadow-lg text-sm sm:text-base">
        <h3 className="text-base font-semibold text-gray-800">
          {beach.nomePraia}
        </h3>

        {photoUrl && (
          <img
            src={photoUrl}
            alt={beach.nomePraia}
            className="w-full h-32 sm:h-40 object-cover rounded-md my-2"
          />
        )}

        <ul className="flex flex-wrap gap-2 my-2">
          {Object.entries(info.condicoesAvaliacoes)
            .sort(([, votosA], [, votosB]) => votosB - votosA)
            .slice(0, 3)
            .map(([condicao]) => {
              const icon = CONDITION_ICONS[condicao];
              return icon ? (
                <li key={condicao}>
                  <img
                    src={icon}
                    alt={condicao}
                    title={condicao}
                    className="w-8 h-8"
                  />
                </li>
              ) : null;
            })}
        </ul>

        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setPraiaId(beach.idPraia);
              setPraiaNome(beach.nomePraia);
              setTotalAvaliacoesDoDia(info.totalAvaliacoesDoDia);
              setPraiaFotoUrl(photoUrl);

              navigate(`/avaliacoes/${beach.idPraia}`);
            }}
            className="bg-[#182E4D] text-white px-2 py-2 rounded-3xl text-sm font-small hover:bg-[#1e3a5f] transition-colors"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </InfoWindow>
  );
}
