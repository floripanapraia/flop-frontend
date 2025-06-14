import { Ban, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DataTable, { Action, Column, Filter } from '../../components/DataTable';
import { getAllUsers, toggleBlockUser, Usuario } from '../../services/userService';

import { PDFDownloadLink } from '@react-pdf/renderer';
import RelatorioUsuariosPDF from '../../components/pdf/RelatorioUsuariosPDF';

const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'banidos'>('relatorio');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const dados = await getAllUsers();
        console.log('Dados recebidos do backend:', dados); // Debug
        setUsuarios(dados);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Filtrar dados baseado na aba ativa
  const dadosFiltrados = usuarios.filter(usuario => {
    if (activeTab === 'banidos') {
      return usuario.isBloqueado;
    }
    return true; // Relatório mostra todos
  });

  // Configuração das colunas
  const columns: Column<Usuario>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
      align: 'center'
    },
    {
      key: 'nome',
      label: 'NOME',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value || 'N/A'}</span>
      )
    },
    {
      key: 'nickname',
      label: 'NICKNAME',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">@{value}</span>
      )
    },
    {
      key: 'email',
      label: 'EMAIL',
      sortable: true,
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      )
    },
    {
      key: 'isAdmin',
      label: 'ADMIN',
      sortable: true,
      align: 'center',
      width: '100px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${Number(value) === 1 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
          {Number(value) === 1 ? 'Admin' : 'User'}
        </span>
      )
    }, {
      key: 'totalPostagensBloqueadas',
      label: 'POSTAGENS BLOQUEADAS',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    ...(activeTab === 'relatorio' ? [{
      key: 'isBloqueado',
      label: 'STATUS',
      sortable: true,
      align: 'center' as const,
      width: '120px',
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${Number(value) === 1 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
          {Number(value) === 1 ? 'Banido' : 'Ativo'}
        </span>
      )
    }] : [])
  ];

  // Configuração dos filtros
  const filters: Filter[] = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Nome do usuário...'
    },
    {
      key: 'nickname',
      label: 'Nickname',
      type: 'text',
      placeholder: 'Nickname do usuário...'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Email do usuário...'
    },
    ...(activeTab === 'relatorio' ? [{
      key: 'isBloqueado',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '0', label: 'Ativo' },
        { value: '1', label: 'Banido' }
      ]
    }] : []),
    {
      key: 'isAdmin',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '0', label: 'Usuário' },
        { value: '1', label: 'Admin' }
      ]
    }
  ];

  // Função para banir/desbanir usuário
  const handleToggleBan = async (usuario: Usuario) => {
    // Verificar se é admin ou se já está processando
    if (Number(usuario.isAdmin) === 1) {
      alert('Não é possível banir um administrador.');
      return;
    }

    if (actionLoading === usuario.id) {
      return; // Já está processando
    }

    const action = usuario.isBloqueado ? 'desbanir' : 'banir';
    const confirmMessage = usuario.isBloqueado
      ? `Tem certeza que deseja desbanir o usuário ${usuario.nickname}?`
      : `Tem certeza que deseja banir o usuário ${usuario.nickname}? Esta ação impedirá o usuário de acessar o sistema.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setActionLoading(usuario.id);

    try {
      if (usuario.isBloqueado) {
        // Desbanir usuário
        await toggleBlockUser(usuario.id, false);
        console.log(`Usuário ${usuario.nickname} foi desbanido com sucesso`);
      } else {
        // Banir usuário
        await toggleBlockUser(usuario.id, true);
        console.log(`Usuário ${usuario.nickname} foi banido com sucesso`);
      }

      // Atualizar estado local
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuario.id
            ? { ...u, isBloqueado: u.isBloqueado === 1 ? 0 : 1 }
            : u
        )
      );

      // Mostrar notificação de sucesso
      alert(`Usuário ${action}do com sucesso!`);

    } catch (error) {
      console.error(`Erro ao ${action} usuário:`, error);
      alert(`Erro ao ${action} usuário. Tente novamente.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Configuração das ações
  const actions: Action<Usuario>[] = [
    {
      label: 'Banir/Desbanir',
      icon: <Ban className="w-4 h-4" />,
      variant: 'warning',
      onClick: handleToggleBan
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie usuários do sistema</p>
      </div>

      {/* Botão de Download do PDF */}
      <div className="flex justify-end mb-4">
        <PDFDownloadLink
          document={<RelatorioUsuariosPDF usuarios={dadosFiltrados} titulo="Relatório Geral de Usuários" />}
          fileName={`relatorio_usuarios_${new Date().toISOString().split('T')[0]}.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Gerando PDF...' : 'Exportar para PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('relatorio')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'relatorio'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Relatório usuários
            </button>
            <button
              onClick={() => setActiveTab('banidos')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'banidos'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Usuários banidos ({usuarios.filter(u => u.isBloqueado).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {usuarios.length}
          </div>
          <div className="text-sm text-gray-600">Total de Usuários</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {usuarios.filter(u => !u.isBloqueado).length}
          </div>
          <div className="text-sm text-gray-600">Usuários Ativos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {usuarios.filter(u => u.isBloqueado).length}
          </div>
          <div className="text-sm text-gray-600">Usuários Banidos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {usuarios.filter(u => u.isAdmin).length}
          </div>
          <div className="text-sm text-gray-600">Administradores</div>
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        data={dadosFiltrados}
        columns={columns}
        filters={filters}
        actions={actions}
        loading={loading}
        emptyMessage={
          activeTab === 'banidos'
            ? "Nenhum usuário banido encontrado"
            : "Nenhum usuário encontrado"
        }
      />
    </div>
  );
};

export default AdminUsers;