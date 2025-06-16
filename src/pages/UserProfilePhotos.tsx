import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthToken } from "../services/authService";
import SuggestBeachModal from "../components/SuggestBeachModal";
import { LogOut, MapPin, Settings } from "lucide-react";
import { useUser } from "../contexts/userContext";
import {
  filterPostagens,
  PostagemDTO,
  PostagemSeletor,
} from "../services/postService";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SugestaoDTO } from "../services/suggestionService";

type TabType = {
  id: "fotos" | "flops";
  label: string;
};

const PAGE_SIZE = 10;

const UserProfilePhotos: React.FC = () => {
  const navigate = useNavigate();
  const [loadingPostagens, setLoadingPostagens] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postagens, setPostagens] = useState<PostagemDTO[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [errorPostagens, setErrorPostagens] = useState<string | null>(null);

  const { user } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const [activeTab, setActiveTab] = useState<"fotos" | "flops">("fotos");

  const fetchPostagensPage = async (pageNumber: number) => {
    if (!user?.id) return;
    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop;
    }

    setLoadingPostagens(true);
    setErrorPostagens(null);

    const seletor: PostagemSeletor = {
      idUsuario: user.id,
      imagem: "COM IMAGEM",
      pagina: pageNumber,
      limite: PAGE_SIZE,
    };

    try {
      const lista: PostagemDTO[] = await filterPostagens(seletor);
      if (lista.length < PAGE_SIZE) setHasMore(false);
      setPostagens(prev => (pageNumber === 1 ? lista : [...prev, ...lista]));
    } catch (err) {
      console.error("Erro ao carregar postagens:", err);
      setErrorPostagens("Erro ao carregar postagens");
    } finally {
      if (pageNumber === 1) setLoadingPostagens(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setPostagens([]);
      setPaginaAtual(1);
      setHasMore(true);
      setErrorPostagens(null);
      fetchPostagensPage(1);
    }
  }, [user?.id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadingPostagens || !hasMore) return;
    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) < 150) setPaginaAtual(prev => prev + 1);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loadingPostagens, hasMore]);

  useEffect(() => {
    if (paginaAtual > 1 && hasMore && user?.id) fetchPostagensPage(paginaAtual);
  }, [paginaAtual, hasMore, user?.id]);

  const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-gray-800 font-medium">Deseja realmente sair?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => closeToast?.()} className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button onClick={() => { setAuthToken(null); closeToast?.(); navigate("/auth"); }} className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Sair</button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false, closeButton: false, draggable: false, icon: false }
    );
  };

  const tabs: TabType[] = [
    { id: "fotos", label: "Fotos" },
    { id: "flops", label: "Flops" },
  ];

  const handleTabClick = (tabId: "fotos" | "flops") => {
    setActiveTab(tabId);
    navigate(tabId === "fotos" ? "/perfilFotos" : "/perfilFlops");
  };

  const handleSugestaoSuccess = (sugestao: SugestaoDTO) => {
    toast.success(`Sugestão "${sugestao.nomePraia}" enviada com sucesso!`);
    setIsModalOpen(false);
  };

  const handleSugestaoError = (error: string) => {
    toast.error(`Erro ao enviar sugestão: ${error}`);
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
                    <div className="text-gray-500">Nenhuma foto encontrada</div>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {postagens.map((postagem) => (
                      <div key={postagem.idPostagem} className="bg-white rounded-lg p-4">
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
                                <span className="text-xs text-gray-500">{formatDistanceToNowStrict(parseISO(postagem.criadoEm ?? ""), { locale: ptBR })}</span>
                              </div>
                              <button className="text-blue-900" onClick={() => console.log("Denunciar post")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                              </button>
                            </div>
                            {postagem.imagem && (
                              <div className="mt-2 mb-2 rounded-lg overflow-hidden">
                                <img
                                  src={`data:image/jpeg;base64,${postagem.imagem}`}
                                  alt="Foto da postagem"
                                  className="w-full h-auto max-h-80 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <p className="text-gray-700 mt-1 text-sm">{postagem.mensagem}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loadingPostagens && postagens.length > 0 && (
                      <div className="flex justify-center py-4"><div className="text-gray-500 text-sm">Carregando mais...</div></div>
                    )}
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
    </div>
  );
};

export default UserProfilePhotos;
