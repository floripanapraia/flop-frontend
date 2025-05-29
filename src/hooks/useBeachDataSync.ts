import { useEffect, useState } from "react";
import { getPraiaNow, PraiaDTO } from "../services/beachService";
import { useBeach } from "./useBeach";

interface PraiaDataOptions {
  incluirMensagens?: boolean;
  incluirImagens?: boolean;
  incluirCondicoes?: boolean;
}

interface PraiaDadosSincronizados {
  praiaData: PraiaDTO | null;
  mensagensPostagens: string[];
  imagensPostagens: string[];
  condicoesAvaliacoes: [string, number][]; // [condição, votos]
  loading: boolean;
  error: string | null;
}

export function usePraiaDataSync(
  options: PraiaDataOptions = {}
): PraiaDadosSincronizados {
  const {
    praiaId,
    setPraiaNome,
    setPraiaFotoUrl,
    setPraiaPlaceId,
    setTotalAvaliacoesDoDia,
  } = useBeach();

  const [praiaData, setPraiaData] = useState<PraiaDTO | null>(null);
  const [mensagensPostagens, setMensagensPostagens] = useState<string[]>([]);
  const [imagensPostagens, setImagensPostagens] = useState<string[]>([]);
  const [condicoesAvaliacoes, setCondicoesAvaliacoes] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    incluirMensagens = true,
    incluirImagens = true,
    incluirCondicoes = true,
  } = options;

  useEffect(() => {
    const fetchPraiaData = async () => {
      if (!praiaId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getPraiaNow(praiaId);

        setPraiaData(data);
        setPraiaNome(data.nomePraia);
        setTotalAvaliacoesDoDia(data.totalAvaliacoesDoDia);

        if (data.placeId) {
          setPraiaPlaceId(data.placeId);
        }

        if (data.imagem) {
          setPraiaFotoUrl(data.imagem);
        }

        if (incluirMensagens && data.mensagensPostagens) {
          setMensagensPostagens(data.mensagensPostagens ?? []);
        }

        if (incluirImagens && data.imagensPostagens) {
          setImagensPostagens(data.imagensPostagens?.filter(Boolean) ?? []);
        }

        if (incluirCondicoes && data.condicoesAvaliacoes) {
          const condicoes = Object.entries(data.condicoesAvaliacoes ?? {}).sort(
            (a, b) => b[1] - a[1]
          );
          setCondicoesAvaliacoes(condicoes);
        }
      } catch (err) {
        console.error("Erro ao buscar dados da praia:", err);
        setError("Erro ao carregar informações da praia");
      } finally {
        setLoading(false);
      }
    };

    fetchPraiaData();
  }, [praiaId, incluirMensagens, incluirImagens, incluirCondicoes]);

  return {
    praiaData,
    mensagensPostagens,
    imagensPostagens,
    condicoesAvaliacoes,
    loading,
    error,
  };
}
