import React, { useEffect, useState } from 'react';
import DataTable, { Column, Filter } from '../../components/DataTable';
import { getAllUsers, Usuario } from '../../services/userService';

const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'banidos'>('relatorio');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const dados = await getAllUsers();
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
      key: 'user',
      label: 'USER',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'posts_bloqueados',
      label: 'POSTS BLOQUEADOS',
      sortable: true,
      align: 'center',
      width: '150px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {value}
        </span>
      )
    },
    ...(activeTab === 'relatorio' ? [{
      key: 'bloqueado',
      label: 'STATUS',
      sortable: true,
      align: 'center' as const,
      width: '120px',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {value ? 'Banido' : 'Ativo'}
        </span>
      )
    }] : [])
  ];

  // Configuração dos filtros
  const filters: Filter[] = [
    {
      key: 'user',
      label: 'Usuário',
      type: 'text',
      placeholder: 'Nome de usuário...'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Email do usuário...'
    },
    ...(activeTab === 'relatorio' ? [{
      key: 'bloqueado',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'false', label: 'Ativo' },
        { value: 'true', label: 'Banido' }
      ]
    }] : []),
    {
      key: 'posts_bloqueados',
      label: 'Posts Bloqueados',
      type: 'number',
      placeholder: 'Número de posts...'
    }
  ];

  // Configuração das ações
  // const actions: Action<Usuario>[] = [
  //   {
  //     label: 'Ver',
  //     icon: <Eye className="w-4 h-4" />,
  //     onClick: (usuario: Usuario) => {
  //       console.log('Ver usuário:', usuario);
  //     }
  //   },
  //   {
  //     label: 'Email',
  //     icon: <Mail className="w-4 h-4" />,
  //     onClick: (usuario: Usuario) => {
  //       window.open(`mailto:${usuario.email}`, '_blank');
  //     }
  //   },
  //   {
  //     label: (usuario: Usuario) => usuario.bloqueado ? 'Desbanir' : 'Banir',
  //     icon: (usuario: Usuario) =>
  //       usuario.bloqueado ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />,
  //     variant: (usuario: Usuario) => (usuario.bloqueado ? 'default' : 'warning'),
  //     onClick: (usuario: Usuario) => {
  //       setUsuarios(prev =>
  //         prev.map(u => (u.id === usuario.id ? { ...u, bloqueado: !u.bloqueado } : u))
  //       );
  //     }
  //   },
  //   {
  //     label: 'Excluir',
  //     icon: <Trash2 className="w-4 h-4" />,
  //     variant: 'danger',
  //     onClick: (usuario: Usuario) => {
  //       if (window.confirm(`Tem certeza que deseja excluir o usuário ${usuario.user}?`)) {
  //         setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
  //       }
  //     }
  //   }
  // ];


  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie usuários do sistema</p>
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
              Usuários banidos
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
        {/* <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {usuarios.filter(u => u.posts_bloqueados > 0).length}
          </div>
          <div className="text-sm text-gray-600">Com Posts Bloqueados</div>
        </div> */}
      </div>

      {/* Tabela */}
      <DataTable
        data={dadosFiltrados}
        columns={columns}
        filters={filters}
        // actions={actions}
        loading={loading}
        searchPlaceholder="Buscar usuários..."
        emptyMessage={
          activeTab === 'banidos'
            ? "Nenhum usuário banido encontrado"
            : "Nenhum usuário encontrado"
        }
        onRowClick={(usuario) => {
          console.log('Clicou no usuário:', usuario);
          // Implementar navegação para detalhes
        }}
      />
    </div>
  );
};

export default AdminUsers;