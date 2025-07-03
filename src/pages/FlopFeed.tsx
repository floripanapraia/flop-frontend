import { Ellipsis, Flag, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Beach from "../components/Beach";
import ProfileModal from "../components/ProfileModal";
import ReportModal from "../components/ReportModal";
import RequireAuthModal from "../components/RequireAuthModal";
import ThankYouModal from "../components/ThankYouDenunciaModal";
import { useUser } from "../contexts/userContext";
import { useBeach } from "../hooks/useBeach";
import {
  filterPostagens,
  createPostagem,
  PostagemDTO,
  PostagemSeletor,
  deletePostagem,
} from "../services/postService";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProfileButton from "../components/ProfileButton";
import { useGeoContext } from "../contexts/geolocationContext";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import { createDenuncia, MotivosDenuncia } from "../services/reportService";

type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const PAGE_SIZE = 10;

const FlopFeed: React.FC = () => {
  const navigate = useNavigate();

  const { praiaId } = useBeach();
  const { user } = useUser();
  const { coords, isGeolocationEnabled } = useGeoContext();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showRequireAuthModal, setShowRequireAuthModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showThankYouDenunciaModal, setShowThankYouDenunciaModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">("flops");
  const [postagens, setPostagens] = useState<PostagemDTO[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPostagens, setLoadingPostagens] = useState(false);
  const [errorPostagens, setErrorPostagens] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showPostOptions, setShowPostOptions] = useState<number | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const tabs: TabType[] = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const filterDate = () => {
    const now = new Date();

    // Início do dia de 7 dias atrás 
    const hojeMenos7Dias = new Date(now);
    hojeMenos7Dias.setDate(now.getDate() - 7);
    const inicio = new Date(hojeMenos7Dias.getFullYear(), hojeMenos7Dias.getMonth(), hojeMenos7Dias.getDate(), 0, 0, 0, 0);
    const fim = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return {
      criadoEmInicio: inicio.toISOString(),
      criadoEmFim: fim.toISOString(),
    };
  };

  const fetchPostagensPage = async (pageNumber: number) => {
    if (!praiaId || loadingPostagens) return;

    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop;
    }

    setLoadingPostagens(true);
    setErrorPostagens(null);

    const { criadoEmInicio, criadoEmFim } = filterDate();

    const seletor: PostagemSeletor = {
      idPraia: praiaId,
      criadoEmInicio,
      criadoEmFim,
      imagem: "SEM IMAGEM",
      pagina: pageNumber,
      limite: PAGE_SIZE,
    };

    try {
      const lista: PostagemDTO[] = await filterPostagens(seletor);

      if (lista.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setPostagens((prev) => {
        const newPostagens = [...prev, ...lista];

        requestAnimationFrame(() => {
          if (containerRef.current && pageNumber > 1) {
            containerRef.current.scrollTop = scrollPositionRef.current;
          }
        });

        return newPostagens;
      });
    } catch (err) {
      console.error("Erro ao carregar postagens:", err);
      setErrorPostagens("Erro ao carregar postagens");
    } finally {
      setLoadingPostagens(false);
    }
  };

  useEffect(() => {
    setPostagens([]);
    setPaginaAtual(1);
    setHasMore(true);
    setErrorPostagens(null);

    if (praiaId) {
      fetchPostagensPage(1);
    }
  }, [praiaId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (loadingPostagens || !hasMore) return;

      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollHeight - (scrollTop + clientHeight) < 150) {
        setPaginaAtual((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [loadingPostagens, hasMore]);

  // Carrega próxima página quando pagina atual mudar
  useEffect(() => {
    if (paginaAtual > 1 && hasMore && praiaId) {
      fetchPostagensPage(paginaAtual);
    }
  }, [paginaAtual]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest(".post-options-menu") && !target.closest(".ellipsis-button")) {
        setShowPostOptions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const refreshPostagens = () => {
    setPostagens([]);
    setPaginaAtual(1);
    setHasMore(true);
    setErrorPostagens(null);

    if (praiaId) {
      fetchPostagensPage(1);
    }
  };

  const handlePublicarClick = async () => {
    if (!user) {
      setShowRequireAuthModal(true);
      return;
    }

    if (!praiaId) {
      alert("Selecione uma praia primeiro");
      return;
    }

    if (!postContent.trim()) {
      alert("Digite uma mensagem para publicar");
      return;
    }
    if (!isGeolocationEnabled || !coords?.latitudeUser || !coords?.longitudeUser) {
      toast.warn("A localização está desativada. Ative-a nas configurações do navegador e atualize a página para poder postar nesta praia.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    setIsPublishing(true);

    try {
      const novaPostagem = {
        usuarioId: user.id,
        fotoDoUsuario: user.fotoPerfil || "",
        nickname: user.nickname || user.nome,
        praiaId: praiaId,
        nomePraia: "",
        mensagem: postContent.trim(),
        excluida: false,
        latitudeUser: coords.latitudeUser,
        longitudeUser: coords.longitudeUser,
      };

      await createPostagem(novaPostagem);

      setPostContent("");
      refreshPostagens();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Erro ao publicar. Tente novamente.";
      toast.warn(msg, {
        position: "top-center",
        autoClose: 6000,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRequireAuthModalClose = () => {
    setShowRequireAuthModal(false);
  };

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

  const handleEllipsisClick = (postId: number) => {
    setShowPostOptions((prev) => (prev === postId ? null : postId));
  };

  const handleDeletePost = (postId: number) => {
    setSelectedPostId(postId);
    setShowConfirmationModal(true);
  };

  const confirmDeletePost = async () => {
    if (!selectedPostId) return;

    try {
      await deletePostagem(selectedPostId);
      toast.success("Postagem excluída com sucesso.");
      refreshPostagens();
    } catch (err) {
      toast.error("Erro ao excluir postagem.");
    } finally {
      setShowConfirmationModal(false);
      setSelectedPostId(null);
    }
  };

  const handleReportClick = (postId: number) => {
    if (!user) {
      setShowRequireAuthModal(true);
      return;
    }
    setSelectedPostId(postId);
    setShowReportModal(true);
  };

  const handleReport = async (reason: MotivosDenuncia) => {
    if (!selectedPostId || !user) return;

    try {
      await createDenuncia({
        postagemId: selectedPostId,
        usuarioId: user.id,
        motivo: reason,
      });

      toast.success("Denúncia registrada com sucesso!");
      setShowThankYouDenunciaModal(true);
    } catch (error) {
      toast.error("Erro ao registrar denúncia.");
    } finally {
      setShowReportModal(false);
      setSelectedPostId(null);
    }
  };

  // ***** HTML *****

  return (
    <div className="relative min-h-screen w-screen max-w-screen overflow-hidden">

      {/* Botão de perfil */}
      <div className="absolute top-4 right-4 sm:right-6 z-50">
        <ProfileButton onProfileClick={() => setIsProfileModalOpen(true)} size={48} />
      </div>
      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Área do feed */}
      <div className="h-full flex flex-col lg:flex-row">
        <div className="w-full lg:max-w-[620px] mb-6 lg:mb-0">
          <Beach />
        </div>

        <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] lg:h-screen">
          <div className="bg-white px-4 md:px-6 pt-5 pb-2 border-b">
            <div className="flex items-center space-x-3">
              <img src="/assets/LOGO.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm" />
              <h2 className="text-[#182E4D] text-lg sm:text-xl font-bold">Floripa na Praia</h2>
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

          {/* Área de publicação */}
          <div className="bg-white p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {user ? (
                  user.fotoPerfil ? (
                    <img
                      src={`data:image/jpeg;base64,${user.fotoPerfil}`}
                      alt={user.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#182E4C] flex items-center justify-center text-white text-sm font-medium">
                      {user.nome.charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                  // Imagem padrão se não estiver logado
                  <img
                    src="assets/defaultProfile.svg"
                    alt="Perfil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Como está a praia hoje?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full border-b border-gray-200 p-2 focus:outline-none focus:border-blue-400 resize-none text-sm"
                  rows={2}
                  disabled={isPublishing}
                  maxLength={300}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {postContent.length}/300 caracteres
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handlePublicarClick}
                    disabled={isPublishing || !postContent.trim()}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed de posts */}
          <div
            ref={containerRef}
            style={{ overflowAnchor: "none" }}
            className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
          >
            {/* Loading inicial */}
            {loadingPostagens && paginaAtual === 1 && (
              <p className="text-gray-600">Carregando posts de hoje…</p>
            )}

            {/* Erro */}
            {errorPostagens && <p className="text-red-600">{errorPostagens}</p>}

            {/* Nenhum post encontrado */}
            {!loadingPostagens && postagens.length === 0 && (
              <p className="text-gray-600">Nenhum post registrado hoje.</p>
            )}

            {/* Lista de posts */}
            {postagens.map((post) => {
              const timeSincePost = formatDistanceToNowStrict(
                parseISO(post.criadoEm ?? ""),
                { addSuffix: true, locale: ptBR }
              );

              return (
                <div key={post.idPostagem} className="relative bg-white rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {post.fotoDoUsuario ? (
                        <img
                          src={`data:image/jpeg;base64,${post.fotoDoUsuario}`}
                          alt={post.nickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#182E4C] flex items-center justify-center text-white text-sm font-medium">
                          {post.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {post.nickname}
                          </h3>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {timeSincePost}
                          </span>
                        </div>
                        <button
                          className="ellipsis-button text-gray-400 hover:text-gray-600"
                          onClick={() => post.idPostagem !== undefined && handleEllipsisClick(post.idPostagem)}
                        >
                          <Ellipsis className="h-4 w-4" />
                        </button>
                      </div>
                      {showPostOptions === post.idPostagem && (
                        <div className="post-options-menu absolute right-0 mt-2 bg-white border rounded shadow z-50 w-40">
                          {user?.id === post.usuarioId ? (
                            <button
                              onClick={() => post.idPostagem !== undefined && handleDeletePost(post.idPostagem)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 />Excluir
                            </button>
                          ) : (
                            <button
                              onClick={() => post.idPostagem !== undefined && handleReportClick(post.idPostagem)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Flag /> Denunciar
                            </button>
                          )}
                        </div>
                      )}

                      <p className="text-gray-700 mt-1 text-sm">
                        {post.mensagem}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading para próximas páginas */}
            {loadingPostagens && paginaAtual > 1 && (
              <p className="text-gray-600 text-center">Carregando mais posts…</p>
            )}

            {/* Fim dos posts */}
            {!hasMore && postagens.length > 0 && (
              <p className="text-gray-500 text-center text-sm">
                Não há mais posts para carregar
              </p>
            )}
          </div>
        </div>

        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onReport={(reason) => handleReport(reason as MotivosDenuncia)}
        />


        <ThankYouModal
          isOpen={showThankYouDenunciaModal}
          onClose={() => setShowThankYouDenunciaModal(false)}
        />

        <RequireAuthModal
          isOpen={showRequireAuthModal}
          onClose={handleRequireAuthModalClose}
        />

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmDeletePost}
          title="Excluir postagem"
          message="Tem certeza que deseja excluir esta postagem?"
        />

      </div>
    </div>
  );
};

export default FlopFeed;
