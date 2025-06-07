import React, { useEffect, useState } from 'react';
import DataTable, { Column, Filter } from '../../components/DataTable';
import { getAllPraias, PraiaDTO } from '../../services/beachService';

const AdminBeaches: React.FC = () => {
  const [praias, setPraias] = useState<PraiaDTO[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Praias</h1>
        <p className="text-gray-600 mt-2">Gerencie praias do sistema</p>
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
        searchPlaceholder="Buscar praias..."
        onRowClick={(praia) => {
          console.log('Clicou na praia:', praia);
          // Implementar navegação para detalhes
        }}
      />
    </div>
  );
};

export default AdminBeaches;