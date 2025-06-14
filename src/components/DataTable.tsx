import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Filter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface Action<T = any> {
  label: string;
  onClick: (row: T, index: number) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning';
  condition?: (row: T) => boolean;
}

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  filters?: Filter[];
  actions?: Action<T>[];
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  actions = [],
  emptyMessage = "Nenhum registro encontrado",
  loading = false,
  className = "",
  onRowClick
}: DataTableProps<T>) => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar apenas filtros específicos
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtros
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        const filter = filters.find(f => f.key === key);
        if (filter) {
          switch (filter.type) {
            case 'text':
              filtered = filtered.filter(row =>
                String(row[key]).toLowerCase().includes(value.toLowerCase())
              );
              break;
            case 'select':
              filtered = filtered.filter(row => String(row[key]) === value);
              break;
            case 'number':
              filtered = filtered.filter(row => Number(row[key]) === Number(value));
              break;
          }
        }
      }
    });

    return filtered;
  }, [data, filterValues, filters]);

  // Ordenação
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc'
        ? <ChevronUp className="w-4 h-4" />
        : <ChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-800"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header com filtros */}
      {filters.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
              {Object.keys(filterValues).some(key => filterValues[key]) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-sky-600 hover:text-sky-800"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(filter => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {filter.label}
                    </label>
                    {filter.type === 'select' ? (
                      <select
                        value={filterValues[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Todos</option>
                        {filter.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={filter.type}
                        placeholder={filter.placeholder}
                        value={filterValues[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
                        }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : String(row[column.key] ?? '')
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {actions
                          .filter(action => !action.condition || action.condition(row))
                          .map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row, index);
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${action.variant === 'danger'
                                ? 'text-red-600 hover:bg-red-50'
                                : action.variant === 'warning'
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-sky-600 hover:bg-sky-50'
                                }`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))
                        }
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer com informações */}
      {sortedData.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando {sortedData.length} de {data.length} registros
            {Object.keys(filterValues).some(key => filterValues[key]) && (
              <span className="text-sky-600 ml-2">(filtrado)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;