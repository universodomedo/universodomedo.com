import React, { useState, useEffect } from "react";

interface FiltroDinamicoProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
}

interface FilterOption {
  id: number;
  nome: string;
}

interface FilterConfig {
  filterableFields: string[];
  filterOptions: { [key: string]: FilterOption[] };
}

// Componente de Filtro Dinâmico
const FiltroDinamico = <T extends { constructor: { getFilterConfig: () => FilterConfig } }>({
  data,
  onFilter,
}: FiltroDinamicoProps<T>) => {
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});

  // Obtém a configuração de filtros da classe do objeto
  const { filterableFields, filterOptions } = data[0]?.constructor.getFilterConfig() || {
    filterableFields: [],
    filterOptions: {},
  };

  // Efeito para aplicar os filtros quando os estados mudam
  useEffect(() => {
    const dadosFiltrados = data.filter((item) => {
      return filterableFields.every((key) => {
        const filtroValor = filtros[key]?.toLowerCase() || "";
        const itemValor = String(item[key]).toLowerCase() || "";
        return filtroValor === "" || itemValor.includes(filtroValor);
      });
    });

    // Retorna os dados filtrados ao componente pai
    onFilter(dadosFiltrados);
  }, [filtros, data, onFilter]);

  // Função para atualizar o estado dos filtros
  const handleFilterChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {filterableFields.map((key) => {
        const isDropdown = filterOptions[key] !== undefined;

        return (
          <div key={key}>
            {isDropdown ? (
              <select
                value={filtros[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              >
                <option value="">Todos</option>
                {filterOptions[key]?.map((option) => (
                  <option key={option.id} value={option.id.toString()}>
                    {option.nome}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={`Filtrar por ${key}`}
                value={filtros[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FiltroDinamico;