import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthToken } from "../services/authService";
import SuggestBeachModal from "../components/SuggestBeachModal";
import { SugestaoDTO } from "../services/suggestionService";
import { LogOut, MapPin, Settings } from "lucide-react";
import { useUser } from "../contexts/userContext";
import { filterPostagens, PostagemDTO, PostagemSeletor } from "../services/postService";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ConfirmationModal from "../components/ConfirmationModal";
import { Ellipsis, Trash2 } from "lucide-react";
import { deletePostagem } from "../services/postService";

type TabType = {
  id: "fotos" | "flops";
  label: string;
};

const PAGE_SIZE = 10;

const UserProfileFlops: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loadingPostagens, setLoadingPostagens] = useState(true);
  const [postagens, setPostagens] = useState<PostagemDTO[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [errorPostagens, setErrorPostagens] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fotos" | "flops">("flops");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showPostOptions, setShowPostOptions] = useState<number | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const fetchPostagensPage = async (page: number) => {
    if (!user?.id) return;
    if (containerRef.current) scrollPositionRef.current = containerRef.current.scrollTop;
    setLoadingPostagens(true);
    setErrorPostagens(null);

    const seletor: PostagemSeletor = { idUsuario: user.id, imagem: "SEM IMAGEM", pagina: page, limite: PAGE_SIZE };
    try {
      const lista = await filterPostagens(seletor);
      if (lista.length < PAGE_SIZE) setHasMore(false);
      setPostagens(prev => (page === 1 ? lista : [...prev, ...lista]));
    } catch (err) {
      console.error(err);
      setErrorPostagens("Erro ao carregar postagens");
    } finally {
      if (page === 1) setLoadingPostagens(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setPostagens([]);
      setPaginaAtual(1);
      setHasMore(true);
      fetchPostagensPage(1);
    }
  }, [user?.id]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || loadingPostagens || !hasMore) return;
    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      if (scrollHeight - (scrollTop + clientHeight) < 150) setPaginaAtual(prev => prev + 1);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loadingPostagens, hasMore]);

  useEffect(() => {
    if (paginaAtual > 1 && hasMore && user?.id) {
      fetchPostagensPage(paginaAtual);
    }
  }, [paginaAtual, hasMore, user?.id]);

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


  const handleLogout = () => {
    toast(({ closeToast }) => (
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-sm text-gray-800 font-medium">Deseja realmente sair?</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => closeToast?.()} className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
          <button onClick={() => { setAuthToken(null); closeToast?.(); navigate("/auth"); }} className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Sair</button>
        </div>
      </div>
    ), { position: "top-center", autoClose: false, closeOnClick: false, closeButton: false, draggable: false, icon: false });
  };

  const tabs: TabType[] = [{ id: "fotos", label: "Fotos" }, { id: "flops", label: "Flops" }];
  const handleTabClick = (tab: "fotos" | "flops") => {
    setActiveTab(tab);
    navigate(tab === "fotos" ? "/perfilFotos" : "/perfilFlops");
  };

  const handleSugestaoSuccess = (s: SugestaoDTO) => { toast.success(`Sugestão "${s.nomePraia}" enviada com sucesso!`); setIsModalOpen(false); };
  const handleSugestaoError = (err: string) => toast.error(`Erro ao enviar sugestão: ${err}`);

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
      toast.success("Postagem excluída com sucesso!");

      setPostagens((prev) => prev.filter((p) => p.idPostagem !== selectedPostId));
    } catch (err) {
      toast.error("Erro ao excluir postagem.");
    } finally {
      setShowConfirmationModal(false);
      setSelectedPostId(null);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center px-1 sm:px-2 py-2 sm:py-4">
      <img src="/assets/FlopBG.png" alt="Background" className="absolute top-0 left-0 w-full h-full object-cover z-0" />

      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-7xl p-4 sm:p-6 md:p-8 h-[90vh] my-4">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Sidebar */}
          <div className="flex flex-col items-center w-full lg:w-1/3 mb-6 lg:mb-0">
            <div className="flex flex-col items-center w-full mb-4">
              <div className="relative mb-4">
                <img
                  src={user?.fotoPerfil ? `data:image/jpeg;base64,${user.fotoPerfil}` : "assets/defaultProfile.svg"}
                  alt="Perfil"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-full"
                />
              </div>
              <div className="w-full text-center mb-4">
                <h2 className="text-lg font-semibold text-blue-900">Olá, {user?.nome}!</h2>
                <p className="text-sm text-blue-900">{user?.email}</p>
              </div>
            </div>

            <div className="w-full border-t border-gray-200 pt-4 flex flex-col h-full">
              <div className="flex flex-col w-full space-y-2">
                <button onClick={() => setIsModalOpen(true)} className="py-2 sm:py-3 px-4 text-left text-blue-900 hover:bg-gray-50 flex items-center gap-x-3">
                  <MapPin size={18} /> <span>Sugerir nova praia</span>
                </button>
                <button onClick={() => navigate("/editar")} className="py-2 sm:py-3 px-4 text-left text-blue-900 hover:bg-gray-50 flex items-center gap-x-3">
                  <Settings size={18} /> <span>Gerenciar conta</span>
                </button>
                <button onClick={handleLogout} className="py-2 sm:py-3 px-4 text-left text-blue-900 hover:bg-gray-50 flex items-center gap-x-3">
                  <LogOut size={18} /> <span>Sair</span>
                </button>
              </div>
              <div className="flex-grow"></div>
              <div className="w-full text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>Política de Privacidade</span> • <span>Termos de Serviço</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-2/3 lg:pl-6 xl:pl-10 mt-6 lg:mt-0 flex flex-col" style={{ height: "calc(100% - 3rem)" }}>
            <h2 className="text-lg font-semibold text-blue-900 mb-3 sm:mb-4">Meu histórico</h2>

            <div className="bg-white border-b border-gray-200 py-2 flex justify-around shadow-sm sticky top-0 z-40">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`px-3 py-1 text-xs font-medium ${activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  <div className="flex flex-col items-center">
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="w-5 h-0.5 bg-blue-600 mt-1 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 flex-1 overflow-hidden">
              <div ref={containerRef} className="h-full overflow-y-auto pr-2">
                {loadingPostagens && postagens.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500">Carregando...</div>
                  </div>
                ) : errorPostagens ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-red-500">{errorPostagens}</div>
                  </div>
                ) : postagens.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500">Nenhum flop encontrado</div>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {postagens.map(post => (
                      <div key={post.idPostagem} className="relative bg-white rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              src={user?.fotoPerfil ? `data:image/jpeg;base64,${user.fotoPerfil}` : "assets/defaultProfile.svg"}
                              alt={user?.nome || "Usuário"}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-gray-800 text-sm truncate">{user?.nome || "Usuário"}</h3>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{formatDistanceToNowStrict(parseISO(post.criadoEm ?? ""), { locale: ptBR })}</span>
                              </div>
                              <button
                                className="ellipsis-button text-gray-400 hover:text-gray-600"
                                onClick={() => post.idPostagem && handleEllipsisClick(post.idPostagem)}
                              >
                                <Ellipsis className="h-4 w-4" />
                              </button>
                              {showPostOptions === post.idPostagem && (
                                <div className="post-options-menu absolute right-0 mt-14 bg-white border rounded shadow z-50 w-40">
                                  <button
                                    onClick={() => post.idPostagem && handleDeletePost(post.idPostagem)}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    <Trash2 /> Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 mt-1 text-sm">{post.mensagem}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/home")} className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 bg-blue-900 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg z-20 hover:bg-blue-800 transition-colors">
        Voltar
      </button>

      {isModalOpen && (
        <SuggestBeachModal onClose={() => setIsModalOpen(false)} onSuccess={handleSugestaoSuccess} onError={handleSugestaoError} />
      )}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmDeletePost}
        title="Excluir postagem"
        message="Tem certeza que deseja excluir esta postagem?"
      />
    </div>
  );
};

export default UserProfileFlops;
