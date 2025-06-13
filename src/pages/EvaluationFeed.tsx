import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Beach from "../components/Beach";
import ProfileModal from "../components/ProfileModal";
import { useBeach } from "../hooks/useBeach";
import { useUser } from "../contexts/userContext";
import {
  filterAvaliacoes,
  AvaliacaoDTO,
  SeletorFiltro,
} from "../services/evaluationService";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProfileButton from "../components/ProfileButton";


type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const PAGE_SIZE = 10;

const EvaluationFeed: React.FC = () => {
  const navigate = useNavigate();
  const { praiaId } = useBeach();
  const { user } = useUser();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">(
    "avaliacoes"
  );
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoDTO[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);
  const [errorAvaliacoes, setErrorAvaliacoes] = useState<string | null>(null);

  const tabs: TabType[] = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  // “início” e “fim” do dia
  const filterDate = () => {
    const now = new Date();
    const inicio = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const fim = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    return {
      criadoEmInicio: inicio.toISOString(),
      criadoEmFim: fim.toISOString(),
    };
  };

  // ------------------------------------------------------------
  // Scroll infinito
  // ------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const fetchEvaluationPage = async (pageNumber: number) => {
    if (!praiaId || loadingAvaliacoes) return;

    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop;
    }
    setLoadingAvaliacoes(true);
    setErrorAvaliacoes(null);

    const { criadoEmInicio, criadoEmFim } = filterDate();

    const filtro: SeletorFiltro = {
      idPraia: praiaId,
      criadoEmInicio,
      criadoEmFim,
      pagina: pageNumber,
      limite: PAGE_SIZE,
    };

    try {
      const lista: AvaliacaoDTO[] = await filterAvaliacoes(filtro);

      // Se retornou menos do que PAGE_SIZE, é sinal de que acabaram as páginas
      if (lista.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // Se vier vazia e for o primeiro chunk, significa “nenhuma avaliação hoje”.
      // Se vier vazia e não for 1ª página, não acumula nada novo.
      setAvaliacoes((prev) => {
        const newAvaliacoes = [...prev, ...lista];

        // Restaura a posição do scroll após o estado ser atualizado
        requestAnimationFrame(() => {
          if (containerRef.current && pageNumber > 1) {
            containerRef.current.scrollTop = scrollPositionRef.current;
          }
        });

        return newAvaliacoes;
      });

    } catch (err) {
      console.error("Erro ao carregar avaliações de hoje:", err);
      setErrorAvaliacoes("Erro ao carregar avaliações de hoje");
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  // Inicial ou se trocar de praia
  useEffect(() => {
    setAvaliacoes([]);
    setPaginaAtual(1);
    setHasMore(true);
    setErrorAvaliacoes(null);

    if (praiaId) {
      fetchEvaluationPage(1);
    }
  }, [praiaId]);

  //Escuta scroll infinito
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (loadingAvaliacoes || !hasMore) return;

      // Distância entre “altura total” e “o quanto rodamos”:
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      // Quando “faltarem menos de 150px para o fim”, chama próxima página
      if (scrollHeight - (scrollTop + clientHeight) < 150) {
        setPaginaAtual((prev) => prev + 1);
      }
    };
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [loadingAvaliacoes, hasMore]);

  // Se a página atual mudar, chama a próxima página de avaliações
  useEffect(() => {
    if (paginaAtual > 1 && hasMore && praiaId) {
      fetchEvaluationPage(paginaAtual);
    }
  }, [paginaAtual]);

  // ------------------------------------------------------------
  // Fim do scroll infinito
  // ------------------------------------------------------------

  const handleTabClick = (tabId: "avaliacoes" | "fotos" | "flops") => {
    if (!praiaId) {
      console.warn("Nenhuma praia selecionada");

      alert("Selecione uma praia primeiro");
      return;
    }

    setActiveTab(tabId);

    switch (tabId) {
      case "avaliacoes":
        navigate(`/avaliacoes/${praiaId}`);
        break;
      case "fotos":
        navigate(`/fotos/${praiaId}`);
        break;
      case "flops":
        navigate(`/flops/${praiaId}`);
        break;
    }
  };

  const handleMainButtonClick = () => {
    if (user) {
      setIsProfileModalOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const refreshEvaluations = () => {
    // limpa tudo e busca a 1ª página de novo:
    setAvaliacoes([]);
    setPaginaAtual(1);
    setHasMore(true);
    setErrorAvaliacoes(null);

    if (praiaId) {
      fetchEvaluationPage(1);
    }
  };

  // ***** HTML *****
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Beach onNewAvaliacao={refreshEvaluations} />
      {/* Botão de perfil */}
      <div className="absolute top-4 right-6 z-50">
        <ProfileButton onProfileClick={() => setIsProfileModalOpen(true)} size={48} />
      </div>

      {/* Modal de perfil - só renderiza se o usuário estiver logado */}
      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Área do feed */}
      <div className="ml-[620px] h-full flex flex-col">
        <div className="bg-white px-6 pt-5 pb-2 border-b">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/LOGO.png"
              alt="Logo"
              className="w-10 h-10 drop-shadow-sm"
            />
            <h2 className="text-[#182E4D] text-xl font-bold">
              Floripa na Praia
            </h2>
          </div>
        </div>

        {/* Barra de navegação */}
        <div className="bg-white border-b border-gray-200 py-2 flex justify-around shadow-sm sticky top-0 z-40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1 text-xs font-medium ${activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <div className="flex flex-col items-center">
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-5 h-0.5 bg-blue-600 mt-1 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feed de posts */}
        <div
          ref={containerRef}
          style={{ overflowAnchor: "none" }}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
        >
          {/* Post */}
          {loadingAvaliacoes && (
            <p className="text-gray-600">Carregando avaliações de hoje…</p>
          )}

          {errorAvaliacoes && <p className="text-red-600">{errorAvaliacoes}</p>}

          {!loadingAvaliacoes && avaliacoes.length === 0 && (
            <p className="text-gray-600">Nenhuma avaliação registrada hoje.</p>
          )}

          {!loadingAvaliacoes &&
            avaliacoes.map((item) => {
              // converte ISO para algo como "há 2 horas"
              const calculateTimeSincePost = formatDistanceToNowStrict(
                parseISO(item.criadoEm),
                { addSuffix: true, locale: ptBR }
              );

              return (
                <div
                  key={item.idAvaliacao}
                  className="bg-white rounded-lg p-4 shadow"
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar padrão */}
                    <div className="flex-shrink-0">
                      {item.fotoPerfil ? (
                        <img
                          src={`data:image/jpeg;base64,${item.fotoPerfil}`}
                          alt={item.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl">
                          <div className="w-full h-full bg-[#182E4C] flex items-center justify-center text-white text-lg font-medium">
                            {item.nickname.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {item.nickname}
                          </h3>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {calculateTimeSincePost}
                          </span>
                        </div>
                      </div>

                      {/* Ícones de condições para cada avaliação */}
                      <div className="flex items-center mt-3 space-x-4">
                        {item.condicoes.map((cond) => {
                          const iconPath = `/assets/iconFull/${cond
                            .toLowerCase()
                            .replace(/_/g, "_")}.svg`;

                          return (
                            <div
                              key={cond}
                              className="flex flex-col items-center"
                            >
                              <img
                                src={iconPath}
                                alt={cond}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                                className="w-12 h-12"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EvaluationFeed;
