import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, { Column, Filter } from '../../components/DataTable';
import { getAllPraias, PraiaDTO } from '../../services/beachService';
import { Plus } from 'lucide-react';

const AdminBeaches: React.FC = () => {
  const [praias, setPraias] = useState<PraiaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPraias = async () => {
      try {
        const dados = await getAllPraias();
        setPraias(dados);
      } catch (error) {
        console.error('Erro ao buscar praias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPraias();
  }, []);

  // Configuração das colunas
  const columns: Column<PraiaDTO>[] = [
    {
      key: 'idPraia',
      label: 'ID',
      sortable: true,
      width: '80px',
      align: 'center'
    },
    {
      key: 'nomePraia',
      label: 'NOME',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'totalAvaliacoesDoDia',
      label: 'AVALIAÇÕES HOJE',
      sortable: true,
      align: 'center',
      width: '150px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {value || 0}
        </span>
      )
    },
  ];

  // Configuração dos filtros
  const filters: Filter[] = [
    {
      key: 'idPraia',
      label: 'ID',
      type: 'text',
      placeholder: 'ID da praia'
    },
    {
      key: 'nomePraia',
      label: 'Nome',
      type: 'text',
      placeholder: 'Nome da praia'
    },
  ];

  const handleCadastrarPraia = () => {
    navigate('/admin/praias/cadastrar');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Praias</h1>
          <p className="text-gray-600 mt-2">Gerencie praias do sistema</p>
        </div>
        <button
          onClick={handleCadastrarPraia}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Praia
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {praias.length}
          </div>
          <div className="text-sm text-gray-600">Total de Praias</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {praias.filter(p => p.totalAvaliacoesDoDia > 0).length}
          </div>
          <div className="text-sm text-gray-600">Com Avaliações Hoje</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {praias.reduce((total, p) => total + (p.mensagensPostagens?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total de Flops</div>
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        data={praias}
        columns={columns}
        filters={filters}
        loading={loading}
        emptyMessage="Nenhuma praia encontrada"
      />
    </div>
  );
};

export default AdminBeaches;