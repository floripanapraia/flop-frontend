import { AlertCircle, Calendar, Check, Clock, Eye, Filter, Search, User, X, ArrowLeft } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { analisarDenunciasPostagem, DenunciaAgrupada, DenunciaDTO, filterDenuncias, getAllDenuncias, MotivosDenuncia, SeletorFiltro, StatusDenuncia } from '../../services/reportService';

interface AnalyzeReportProps {
  postagemId?: number;
  onNavigateBack?: () => void;
}

const AnalyzeReport: React.FC<AnalyzeReportProps> = ({
  postagemId,
  onNavigateBack
}) => {
  const [denunciaAgrupada, setDenunciaAgrupada] = useState<DenunciaAgrupada | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agruparDenunciasPorPostagem = (denuncias: DenunciaDTO[]): DenunciaAgrupada | null => {
    if (denuncias.length === 0) return null;

    const denunciasDaPostagem = denuncias.filter(d => d.postagemId === postagemId);

    if (denunciasDaPostagem.length === 0) return null;

    const primeiraDenuncia = denunciasDaPostagem[0];

    const statusGeral = denunciasDaPostagem.some(d => d.status === StatusDenuncia.ACEITA)
      ? StatusDenuncia.ACEITA
      : denunciasDaPostagem.some(d => d.status === StatusDenuncia.PENDENTE)
        ? StatusDenuncia.PENDENTE
        : StatusDenuncia.RECUSADA;

    const motivosCount = new Map<MotivosDenuncia, number>();
    denunciasDaPostagem.forEach(d => {
      motivosCount.set(d.motivo, (motivosCount.get(d.motivo) || 0) + 1);
    });

    const motivosPrincipais = Array.from(motivosCount.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([motivo]) => motivo);

    const primeiraData = denunciasDaPostagem
      .map(d => d.criadoEm)
      .sort()[0];

    return {
      postagemId: primeiraDenuncia.postagemId,
      nomeUsuario: primeiraDenuncia.nomeUsuario,
      textoPostagem: primeiraDenuncia.textoPostagem,
      imagemPostagem: primeiraDenuncia.imagemPostagem,
      denuncias: denunciasDaPostagem,
      totalDenuncias: denunciasDaPostagem.length,
      statusGeral,
      primeiraData,
      motivosPrincipais
    };
  };

  useEffect(() => {
    const carregarDenuncias = async () => {
      try {
        setLoading(true);
        setError(null);

        const todasDenuncias = await getAllDenuncias();
        const denunciaAgrupada = agruparDenunciasPorPostagem(todasDenuncias);

        if (!denunciaAgrupada) {
          setError('Nenhuma denúncia encontrada para esta postagem.');
          return;
        }

        setDenunciaAgrupada(denunciaAgrupada);
      } catch (err) {
        console.error('Erro ao carregar denúncias:', err);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarDenuncias();
  }, [postagemId]);

  const getMotivoLabel = (motivo: MotivosDenuncia) => {
    const labels = {
      [MotivosDenuncia.INADEQUADO]: 'Conteúdo inadequado',
      [MotivosDenuncia.INCORRETO]: 'Informação incorreta',
      [MotivosDenuncia.SPAM_PROPAGANDA]: 'Spam ou propaganda',
      [MotivosDenuncia.ILEGAL]: 'Conteúdo ilegal',
      [MotivosDenuncia.VIOLACAO_PRIVACIDADE]: 'Violação de privacidade'
    };
    return labels[motivo] || motivo;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const motivosData = React.useMemo(() => {
    if (!denunciaAgrupada) return [];

    const motivosCount = new Map<MotivosDenuncia, number>();

    denunciaAgrupada.denuncias.forEach(denuncia => {
      const count = motivosCount.get(denuncia.motivo) || 0;
      motivosCount.set(denuncia.motivo, count + 1);
    });

    return Array.from(motivosCount.entries()).map(([motivo, count]) => ({
      name: getMotivoLabel(motivo),
      value: count,
      motivo
    }));
  }, [denunciaAgrupada]);

  const COLORS = {
    [MotivosDenuncia.SPAM_PROPAGANDA]: '#10B981',
    [MotivosDenuncia.INADEQUADO]: '#3B82F6',
    [MotivosDenuncia.INCORRETO]: '#F59E0B',
    [MotivosDenuncia.ILEGAL]: '#EF4444',
    [MotivosDenuncia.VIOLACAO_PRIVACIDADE]: '#8B5CF6'
  };

  const handleStatusUpdate = async (status: StatusDenuncia) => {
    if (!denunciaAgrupada) return;

    setActionLoading(true);
    setError(null);

    try {
      const updatePromises = denunciaAgrupada.denuncias.map(denuncia =>
        analisarDenunciasPostagem(denuncia.id!, status)
      );

      await Promise.all(updatePromises);

      setDenunciaAgrupada(prev => prev ? {
        ...prev,
        statusGeral: status,
        denuncias: prev.denuncias.map(d => ({ ...d, status }))
      } : null);

      if (onNavigateBack) {
        setTimeout(() => onNavigateBack(), 1000);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setError('Erro ao atualizar status da denúncia. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} denúncia{data.value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando denúncias...</p>
        </div>
      </div>
    );
  }

  if (error && !denunciaAgrupada) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Erro ao carregar dados</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!denunciaAgrupada) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Nenhuma denúncia encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
              disabled={actionLoading}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Análise de Denúncias</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda - Informações da postagem */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card da postagem */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">{denunciaAgrupada.nomeUsuario}</h2>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                  denunciaAgrupada.statusGeral === StatusDenuncia.ACEITA ? 'bg-green-100 text-green-800' :
                  denunciaAgrupada.statusGeral === StatusDenuncia.RECUSADA ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {denunciaAgrupada.statusGeral === StatusDenuncia.PENDENTE ? 'Pendente' :
                   denunciaAgrupada.statusGeral === StatusDenuncia.ACEITA ? 'Aceita' : 'Recusada'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-4">{denunciaAgrupada.textoPostagem}</p>
                {denunciaAgrupada.imagemPostagem && (
                  <img
                    src={denunciaAgrupada.imagemPostagem}
                    alt="Postagem denunciada"
                    className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Primeira denúncia: {formatDate(denunciaAgrupada.primeiraData)}</span>
              </div>
            </div>

            {/* Lista de denúncias individuais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Denúncias Individuais ({denunciaAgrupada.totalDenuncias})
              </h3>
              <div className="space-y-4">
                {denunciaAgrupada.denuncias.map((denuncia, index) => (
                  <div key={denuncia.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{denuncia.nomeDenunciante}</p>
                      <span className="text-sm text-gray-500">{formatDate(denuncia.criadoEm)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Motivo:</strong> {getMotivoLabel(denuncia.motivo)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      denuncia.status === StatusDenuncia.ACEITA ? 'bg-green-100 text-green-800' :
                      denuncia.status === StatusDenuncia.RECUSADA ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {denuncia.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita - Estatísticas e ações */}
          <div className="space-y-6">
            {/* Gráfico de motivos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Motivos</h3>
              {motivosData.length > 0 && (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={motivosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {motivosData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.motivo] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="mt-4 space-y-2">
                {motivosData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[item.motivo] || '#8884d8' }}
                      />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            {denunciaAgrupada.statusGeral === StatusDenuncia.PENDENTE && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusUpdate(StatusDenuncia.ACEITA)}
                    disabled={actionLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {actionLoading ? 'Processando...' : 'Aceitar Denúncia'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(StatusDenuncia.RECUSADA)}
                    disabled={actionLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {actionLoading ? 'Processando...' : 'Recusar Denúncia'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminReports: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'analyze'>('list');
  const [selectedPostagemId, setSelectedPostagemId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'pendentes' | 'finalizadas'>('pendentes');
  const [denuncias, setDenuncias] = useState<DenunciaDTO[]>([]);
  const [denunciasAgrupadas, setDenunciasAgrupadas] = useState<DenunciaAgrupada[]>([]);
  const [filteredDenuncias, setFilteredDenuncias] = useState<DenunciaAgrupada[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SeletorFiltro>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const normalizeDenunciaData = (denunciaFromAPI: any): DenunciaDTO => {
    return {
      id: denunciaFromAPI.id,
      nomeDenunciante: denunciaFromAPI.nomeDenunciante,
      postagemId: denunciaFromAPI.postagemId,
      textoPostagem: denunciaFromAPI.textoPostagem,
      imagemPostagem: denunciaFromAPI.imagemPostagem,
      usuarioId: denunciaFromAPI.usuarioId,
      nomeUsuario: denunciaFromAPI.nomeUsuario,
      motivo: denunciaFromAPI.motivo as MotivosDenuncia,
      status: denunciaFromAPI.status as StatusDenuncia,
      criadoEm: denunciaFromAPI.criadoEm,
    };
  };

  const agruparDenunciasPorPostagem = (denuncias: DenunciaDTO[]): DenunciaAgrupada[] => {
    const agrupadas = new Map<number, DenunciaAgrupada>();

    denuncias.forEach(denuncia => {
      if (!agrupadas.has(denuncia.postagemId)) {
        agrupadas.set(denuncia.postagemId, {
          postagemId: denuncia.postagemId,
          nomeUsuario: denuncia.nomeUsuario,
          textoPostagem: denuncia.textoPostagem,
          imagemPostagem: denuncia.imagemPostagem,
          denuncias: [],
          totalDenuncias: 0,
          statusGeral: StatusDenuncia.PENDENTE,
          primeiraData: denuncia.criadoEm,
          motivosPrincipais: []
        });
      }

      const grupo = agrupadas.get(denuncia.postagemId)!;
      grupo.denuncias.push(denuncia);
      grupo.totalDenuncias++;

      if (denuncia.status !== StatusDenuncia.PENDENTE) {
        grupo.statusGeral = denuncia.status;
      }

      if (new Date(denuncia.criadoEm) < new Date(grupo.primeiraData)) {
        grupo.primeiraData = denuncia.criadoEm;
      }
    });

    agrupadas.forEach(grupo => {
      const motivosCount = new Map<MotivosDenuncia, number>();
      grupo.denuncias.forEach(d => {
        motivosCount.set(d.motivo, (motivosCount.get(d.motivo) || 0) + 1);
      });

      grupo.motivosPrincipais = Array.from(motivosCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([motivo]) => motivo);
    });

    return Array.from(agrupadas.values()).sort((a, b) => new Date(b.primeiraData).getTime() - new Date(a.primeiraData).getTime());
  };

  const fetchDenuncias = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      let dadosRawAPI: any[];

      if (hasActiveFilters) {
        dadosRawAPI = await filterDenuncias(filters);
      } else {
        dadosRawAPI = await getAllDenuncias();
      }

      const dados: DenunciaDTO[] = dadosRawAPI.map(normalizeDenunciaData);

      setDenuncias(dados);
      const agrupadas = agruparDenunciasPorPostagem(dados);
      setDenunciasAgrupadas(agrupadas);

      const startIndex = pageNum * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = agrupadas.slice(startIndex, endIndex);

      if (reset || pageNum === 0) {
        setFilteredDenuncias(paginatedData);
      } else {
        setFilteredDenuncias(prev => [...prev, ...paginatedData]);
      }

      setHasMore(endIndex < agrupadas.length);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error);
      setError('Erro ao carregar denúncias. Tente novamente.');

      setDenuncias([]);
      setDenunciasAgrupadas([]);
      setFilteredDenuncias([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasActiveFilters, filters]);

  useEffect(() => {
    setPage(0);
    fetchDenuncias(0, true);
  }, [fetchDenuncias]);

  useEffect(() => {
    const hasFilters = Boolean(
      filters.nomeAutor ||
      filters.dataInicio ||
      filters.dataFim ||
      filters.motivoDenuncia
    );
    setHasActiveFilters(hasFilters);
  }, [filters]);

  const dadosFiltrados = filteredDenuncias.filter(grupo => {
    if (activeTab === 'pendentes') {
      return grupo.statusGeral === StatusDenuncia.PENDENTE;
    }
    return grupo.statusGeral === StatusDenuncia.ACEITA || grupo.statusGeral === StatusDenuncia.RECUSADA;
  });

  const handleAnalisarDenuncia = (grupo: DenunciaAgrupada) => {
    setSelectedPostagemId(grupo.postagemId);
    setCurrentView('analyze');
  };

  const handleNavigateBack = () => {
    setCurrentView('list');
    setSelectedPostagemId(null);
    // Recarregar dados quando voltar
    fetchDenuncias(0, true);
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchDenuncias(0, true);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(0);
    fetchDenuncias(0, true);
  };

  const getTotalCounts = () => {
    return {
      pendentes: denunciasAgrupadas.filter(g => g.statusGeral === StatusDenuncia.PENDENTE).length,
      finalizadas: denunciasAgrupadas.filter(g => g.statusGeral === StatusDenuncia.ACEITA || g.statusGeral === StatusDenuncia.RECUSADA).length
    };
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDenuncias(nextPage);
    }
  }, [page, hasMore, loadingMore, fetchDenuncias]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getMotivoLabel = (motivo: MotivosDenuncia) => {
    const labels = {
      [MotivosDenuncia.INADEQUADO]: 'Conteúdo Inadequado',
      [MotivosDenuncia.INCORRETO]: 'Informação Incorreta',
      [MotivosDenuncia.SPAM_PROPAGANDA]: 'Spam/Propaganda',
      [MotivosDenuncia.ILEGAL]: 'Conteúdo Ilegal',
      [MotivosDenuncia.VIOLACAO_PRIVACIDADE]: 'Violação de Privacidade'
    };
    return labels[motivo] || motivo;
  };

  const DenunciaCard: React.FC<{ grupo: DenunciaAgrupada }> = ({ grupo }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{grupo.nomeUsuario}</h3>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {grupo.totalDenuncias} denúncia{grupo.totalDenuncias > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${grupo.statusGeral === StatusDenuncia.ACEITA ? 'bg-green-100 text-green-800' :
            grupo.statusGeral === StatusDenuncia.RECUSADA ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
            {grupo.statusGeral === StatusDenuncia.PENDENTE ? 'Pendente' :
              grupo.statusGeral === StatusDenuncia.ACEITA ? 'Aceita' : 'Recusada'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm mb-2">{grupo.textoPostagem}</p>
        {grupo.imagemPostagem && (
          <img
            src={grupo.imagemPostagem}
            alt="Postagem"
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Primeira denúncia em {formatDate(grupo.primeiraData)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>Motivos principais: {grupo.motivosPrincipais.map(getMotivoLabel).join(', ')}</span>
        </div>
      </div>

      {grupo.statusGeral === StatusDenuncia.PENDENTE && (
        <div className="flex justify-end">
          <button
            onClick={() => handleAnalisarDenuncia(grupo)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            Analisar
          </button>
        </div>
      )}
    </div>
  );

  // Se estivermos na view de análise, mostrar o componente AnalyzeReport
  if (currentView === 'analyze' && selectedPostagemId) {
    return (
      <AnalyzeReport
        postagemId={selectedPostagemId}
        onNavigateBack={handleNavigateBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando denúncias...</p>
        </div>
      </div>
    );
  }

  const totalCounts = getTotalCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administração de Denúncias</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Autor
                </label>
                <input
                  type="text"
                  value={filters.nomeAutor || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, nomeAutor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar por nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filters.dataInicio || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filters.dataFim || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo
                </label>
                <select
                  value={filters.motivoDenuncia || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, motivoDenuncia: e.target.value as MotivosDenuncia }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os motivos</option>
                  <option value={MotivosDenuncia.INADEQUADO}>Conteúdo Inadequado</option>
                  <option value={MotivosDenuncia.INCORRETO}>Informação Incorreta</option>
                  <option value={MotivosDenuncia.SPAM_PROPAGANDA}>Spam/Propaganda</option>
                  <option value={MotivosDenuncia.ILEGAL}>Conteúdo Ilegal</option>
                  <option value={MotivosDenuncia.VIOLACAO_PRIVACIDADE}>Violação de Privacidade</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Limpar
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pendentes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pendentes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Pendentes ({totalCounts.pendentes})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('finalizadas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'finalizadas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Finalizadas ({totalCounts.finalizadas})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de denúncias */}
        <div 
          className="space-y-6 max-h-screen overflow-y-auto"
          onScroll={handleScroll}
        >
          {dadosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma denúncia encontrada
              </h3>
              <p className="text-gray-600">
                {activeTab === 'pendentes' 
                  ? 'Não há denúncias pendentes no momento.' 
                  : 'Não há denúncias finalizadas no momento.'}
              </p>
            </div>
          ) : (
            dadosFiltrados.map((grupo) => (
              <DenunciaCard key={grupo.postagemId} grupo={grupo} />
            ))
          )}

          {/* Loading more */}
          {loadingMore && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando mais...</p>
            </div>
          )}

          {/* End of results */}
          {!hasMore && dadosFiltrados.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">Fim dos resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;