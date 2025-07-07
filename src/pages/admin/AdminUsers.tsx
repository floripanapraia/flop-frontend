import { AlertTriangle, Ban, CheckCircle, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DataTable, { Action, Column, Filter } from '../../components/DataTable';
import { getAllUsers, toggleBlockUser, Usuario } from '../../services/userService';
import { toast } from 'react-toastify';

import { PDFDownloadLink } from '@react-pdf/renderer';
import RelatorioUsuariosPDF from '../../components/pdf/RelatorioUsuariosPDF';

// --- Componente de Modal de Confirmação ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : confirmText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'banidos'>('relatorio');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

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
  const handleToggleBanClick = (usuario: Usuario) => {
    if (Number(usuario.isAdmin) === 1) {
      toast.warn('Não é possível banir um administrador.');
      return;
    }
    setSelectedUser(usuario);
    setIsModalOpen(true);
  };

  const executeToggleBan = async () => {
    if (!selectedUser) return;

    setActionLoading(selectedUser.id);

    const action = selectedUser.isBloqueado ? 'desbanir' : 'banir';
    const actionPastTense = selectedUser.isBloqueado ? 'desbanido' : 'banido';

    try {
      const newBlockedState = !selectedUser.isBloqueado;
      await toggleBlockUser(selectedUser.id, newBlockedState);

      setUsuarios(prev =>
        prev.map(u =>
          u.id === selectedUser.id
            ? { ...u, isBloqueado: newBlockedState ? 1 : 0 }
            : u
        )
      );

      toast.success(
        <span>
          Usuário <strong className="font-semibold">@{selectedUser.nickname}</strong> foi {actionPastTense} com sucesso!
        </span>,
        { icon: <CheckCircle className="text-green-500" /> }
      );

    } catch (error) {
      console.error(`Erro ao ${action} usuário:`, error);
      toast.error(`Erro ao ${action} o usuário. Tente novamente.`);
    } finally {
      setActionLoading(null);
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  // Configuração das ações
  const actions: Action<Usuario>[] = [
    {
      label: 'Banir/Desbanir',
      icon: <Ban className="w-4 h-4" />,
      variant: 'warning',
      onClick: handleToggleBanClick
    }
  ];

  return (
    <div>
      {/* Renderizar o Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeToggleBan}
        title={selectedUser?.isBloqueado ? "Desbanir Usuário" : "Banir Usuário"}
        message={
          <span>
            Tem certeza que deseja {selectedUser?.isBloqueado ? 'desbanir' : 'banir'} o usuário{' '}
            <strong className="font-semibold text-blue-600">@{selectedUser?.nickname}</strong>?
            {!selectedUser?.isBloqueado && <p className="mt-2 text-xs text-gray-500">Esta ação impedirá o usuário de acessar o sistema.</p>}
          </span>
        }
        confirmText={selectedUser?.isBloqueado ? "Sim, desbanir" : "Sim, banir"}
        isLoading={actionLoading !== null}
      />
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