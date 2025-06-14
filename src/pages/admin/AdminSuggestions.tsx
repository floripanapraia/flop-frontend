import React, { useEffect, useState, useCallback } from 'react';
import { Check, Clock, MapPin, User, Calendar, AlertCircle, Search, Filter, X } from 'lucide-react';
import { getAllSugestoes, analisarSugestao, SugestaoDTO, filterSugestoes } from '../../services/suggestionService';

const AdminSuggestions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pendentes' | 'finalizadas'>('pendentes');
  const [sugestoes, setSugestoes] = useState<SugestaoDTO[]>([]);
  const [filteredSugestoes, setFilteredSugestoes] = useState<SugestaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [nomeUsuarioFilter, setNomeUsuarioFilter] = useState('');
  const [dataInicioFilter, setDataInicioFilter] = useState('');
  const [dataFimFilter, setDataFimFilter] = useState('');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchSuggestions = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      let dados: SugestaoDTO[];

      // Se há filtros ativos, usar o service de filtro
      if (hasActiveFilters) {
        dados = await filterSugestoes({
          dataInicio: dataInicioFilter || undefined,
          dataFim: dataFimFilter || undefined,
        });
      } else {
        dados = await getAllSugestoes();
      }

      // Simular paginação (já que a API retorna todos os dados)
      const startIndex = pageNum * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = dados.slice(startIndex, endIndex);

      if (reset || pageNum === 0) {
        setSugestoes(paginatedData);
      } else {
        setSugestoes(prev => [...prev, ...paginatedData]);
      }

      setHasMore(endIndex < dados.length);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setError('Erro ao carregar sugestões. Tente novamente.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasActiveFilters, dataInicioFilter, dataFimFilter]);

  useEffect(() => {
    setPage(0);
    fetchSuggestions(0, true);
  }, [fetchSuggestions]);

  // Aplicar filtros locais (nome do usuário)
  useEffect(() => {
    let filtered = [...sugestoes];

    if (nomeUsuarioFilter) {
      filtered = filtered.filter(sugestao =>
        sugestao.nomeUsuario.toLowerCase().includes(nomeUsuarioFilter.toLowerCase())
      );
    }

    setFilteredSugestoes(filtered);
  }, [sugestoes, nomeUsuarioFilter]);

  // Verificar se há filtros ativos
  useEffect(() => {
    const hasFilters = Boolean(nomeUsuarioFilter || dataInicioFilter || dataFimFilter);
    setHasActiveFilters(hasFilters);
  }, [nomeUsuarioFilter, dataInicioFilter, dataFimFilter]);

  // Filtrar dados baseado na aba ativa
  const dadosFiltrados = filteredSugestoes.filter(sugestao => {
    if (activeTab === 'pendentes') {
      return !sugestao.analisada;
    }
    return sugestao.analisada;
  });

  const handleFinalizarSugestao = async (sugestaoId: number) => {
    try {
      setActionLoading(sugestaoId);
      await analisarSugestao(sugestaoId);

      // Atualizar o estado local
      setSugestoes(prev =>
        prev.map(sugestao =>
          sugestao.idSugestao === sugestaoId
            ? { ...sugestao, analisada: true }
            : sugestao
        )
      );
    } catch (error) {
      console.error('Erro ao finalizar sugestão:', error);
      setError('Erro ao finalizar sugestão. Tente novamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchSuggestions(0, true);
  };

  const handleClearFilters = () => {
    setNomeUsuarioFilter('');
    setDataInicioFilter('');
    setDataFimFilter('');
    setPage(0);
    fetchSuggestions(0, true);
  };

  const getTotalCounts = () => {
    const allSugestoes = hasActiveFilters ? filteredSugestoes : sugestoes;
    return {
      pendentes: allSugestoes.filter(s => !s.analisada).length,
      finalizadas: allSugestoes.filter(s => s.analisada).length
    };
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSuggestions(nextPage);
    }
  }, [page, hasMore, loadingMore, fetchSuggestions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const SuggestionCard: React.FC<{ sugestao: SugestaoDTO }> = ({ sugestao }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{sugestao.nomePraia}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {sugestao.analisada ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Finalizada
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock className="w-3 h-3 mr-1" />
              Pendente
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{sugestao.bairro}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{sugestao.nomeUsuario}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Criada em {formatDate(sugestao.criadaEm)}</span>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">{sugestao.descricao}</p>
        </div>

        {!sugestao.analisada && activeTab === 'pendentes' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleFinalizarSugestao(sugestao.idSugestao!)}
              disabled={actionLoading === sugestao.idSugestao}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === sugestao.idSugestao ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finalizando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Finalizar Sugestão
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Sugestões</h1>
          <p className="mt-2 text-gray-600">
            Visualize e gerencie as sugestões de praias enviadas pelos usuários
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ativos
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar Filtros
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por Nome do Usuário */}
                <div>
                  <label htmlFor="nomeUsuario" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Usuário
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="nomeUsuario"
                      value={nomeUsuarioFilter}
                      onChange={(e) => setNomeUsuarioFilter(e.target.value)}
                      placeholder="Digite o nome do usuário..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Filtro por Data Início */}
                <div>
                  <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    id="dataInicio"
                    value={dataInicioFilter}
                    onChange={(e) => setDataInicioFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filtro por Data Fim */}
                <div>
                  <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-2">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    id="dataFim"
                    value={dataFimFilter}
                    onChange={(e) => setDataFimFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pendentes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'pendentes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pendentes
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getTotalCounts().pendentes}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('finalizadas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'finalizadas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Finalizadas
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {getTotalCounts().finalizadas}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Content */}
        <div
          className="space-y-4 max-h-screen overflow-y-auto"
          onScroll={handleScroll}
        >
          {dadosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {activeTab === 'pendentes' ? (
                  <Clock className="w-8 h-8 text-gray-400" />
                ) : (
                  <Check className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma sugestão {activeTab === 'pendentes' ? 'pendente' : 'finalizada'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'pendentes'
                  ? 'Todas as sugestões foram analisadas.'
                  : 'Nenhuma sugestão foi finalizada ainda.'
                }
              </p>
            </div>
          ) : (
            <>
              {dadosFiltrados.map((sugestao) => (
                <SuggestionCard key={sugestao.idSugestao} sugestao={sugestao} />
              ))}

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* End of List Indicator */}
              {!hasMore && dadosFiltrados.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Todas as sugestões foram carregadas
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSuggestions;