import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Beach from "../components/Beach";
import { Ellipsis, ImageUp } from "lucide-react";
import ReportModal from "../components/ReportModal";
import ProfileModal from "../components/ProfileModal";
import RequireAuthModal from "../components/RequireAuthModal";
import ThankYouModal from "../components/ThankYouDenunciaModal";
import { useUser } from "../contexts/userContext";
import { useBeach } from "../hooks/useBeach";
import {
  filterPostagens,
  createPostagem,
  PostagemDTO,
  PostagemSeletor,
  uploadImagemPostagem,
} from "../services/postService";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type TabType = {
  id: "avaliacoes" | "fotos" | "flops";
  label: string;
};

const PAGE_SIZE = 10;

const PhotoFeed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { praiaId } = useBeach();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showRequireAuthModal, setShowRequireAuthModal] = useState(false);
  const [postContent, setPostContent] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [showThankYouDenunciaModal, setShowThankYouDenunciaModal] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"avaliacoes" | "fotos" | "flops">(
    "fotos"
  );

  const [postagens, setPostagens] = useState<PostagemDTO[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPostagens, setLoadingPostagens] = useState(false);
  const [errorPostagens, setErrorPostagens] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const tabs: TabType[] = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

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
      imagem: "COM IMAGEM",
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

  // Carrega próxima página quando paginaAtual muda
  useEffect(() => {
    if (paginaAtual > 1 && hasMore && praiaId) {
      fetchPostagensPage(paginaAtual);
    }
  }, [paginaAtual]);

  const handleMainButtonClick = () => {
    if (user) {
      setIsProfileModalOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const ProfileButton = () => {
    if (!user) {
      return (
        <button
          onClick={handleMainButtonClick}
          className="bg-[#182E4C] hover:bg-[#1a365d] text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
        >
          ENTRAR
        </button>
      );
    }

    return (
      <button
        onClick={handleMainButtonClick}
        className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-lg hover:border-[#182E4C] transition-all duration-200 hover:shadow-xl"
        title={`Perfil de ${user.nome}`}
      >
        {user.fotoPerfil ? (
          <img
            src={`data:image/jpeg;base64,${user.fotoPerfil}`}
            alt={user.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#182E4C] flex items-center justify-center text-white text-lg font-medium">
            {user.nome.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
    );
  };

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

    if (!postContent.trim() && !imageFile) {
      alert("Digite uma mensagem ou selecione uma imagem para publicar");
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
      };

      const savedPostagem: PostagemDTO = await createPostagem(novaPostagem);

      if (imageFile && savedPostagem.idPostagem) {
        // createFormData: MultipartFormData com o arquivo e o IdPostagem
        const formData = new FormData();
        formData.append("fotoDePerfil", imageFile);
        formData.append("IdPostagem", savedPostagem.idPostagem.toString());
        await uploadImagemPostagem(formData, savedPostagem.idPostagem);
      }

      setPostContent("");
      setImageFile(null);
      refreshPostagens();
    } catch (error) {
      console.error("Erro ao publicar:", error);
      alert("Erro ao publicar. Tente novamente.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRequireAuthModalClose = () => {
    setShowRequireAuthModal(false);
  };

  const handleReport = (reason: string) => {
    console.log("Denúncia enviada:", reason);
    //  lógica para enviar a denúncia
    alert(`Denúncia enviada: ${reason}`);
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

  // ***** HTML *****

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Beach />

      {/* Botão de perfil */}
      <div className="absolute top-4 right-6 z-50">
        <ProfileButton />
      </div>
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
              className={`px-3 py-1 text-xs font-medium ${
                activeTab === tab.id
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
              />
              <div className="flex justify-between items-center mt-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageUp className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      // Lógica para lidar com o upload da imagem

                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <button
                  onClick={handlePublicarClick}
                  disabled={isPublishing || (!postContent.trim() && !imageFile)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPublishing ? "Publicando..." : "Publicar"}
                </button>
              </div>
              {/* Mostra nome do arquivo carregado */}
              {imageFile && (
                <p className="mt-1 text-xs text-gray-500">
                  Imagem selecionada: {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Feed de posts */}
        <div
          ref={containerRef}
          style={{ overflowAnchor: "none" }}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
        >
          {loadingPostagens && paginaAtual === 1 && (
            <p className="text-gray-600">Carregando posts de hoje…</p>
          )}

          {errorPostagens && <p className="text-red-600">{errorPostagens}</p>}

          {!loadingPostagens && postagens.length === 0 && (
            <p className="text-gray-600">Nenhum post registrado hoje.</p>
          )}

          {/* Lista de posts */}
          {postagens.map((post) => {
            const timeSincePost = formatDistanceToNowStrict(
              parseISO(post.criadoEm),
              { addSuffix: true, locale: ptBR }
            );

            return (
              <div key={post.idPostagem} className="bg-white rounded-lg p-4">
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
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowReportModal(true)}
                      >
                        <Ellipsis className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Foto & mensagem */}
                    {post.imagem && (
                      <img
                        src={`data:image/jpeg;base64,${post.imagem}`}
                        alt="Foto da postagem"
                        className="mt-2 w-full max-h-80 object-cover rounded-lg"
                      />
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
        onReport={handleReport}
      />

      <ThankYouModal
        isOpen={showThankYouDenunciaModal}
        onClose={() => setShowThankYouDenunciaModal(false)}
      />

      <RequireAuthModal
        isOpen={showRequireAuthModal}
        onClose={handleRequireAuthModalClose}
      />
    </div>
  );
};

export default PhotoFeed;
