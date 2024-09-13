// #region Imports
import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
// #endregion

interface FilterConfig {
  filterableFields: string[];
  filterOptions: Record<string, { id: number; nome: string }[]>;
}

interface FiltroDinamicoProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
  filterConfig: FilterConfig;
}

const getSafeValue = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

const FiltroDinamico = <T,>({
  data,
  onFilter,
  filterConfig,
}: FiltroDinamicoProps<T>) => {
  const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});

  const { filterableFields, filterOptions } = filterConfig;

  useEffect(() => {
    const dadosFiltrados = data.filter((item) => {
      return filterableFields.every((key) => {
        const filtroValores = filtros[key] || [];
        const itemValor = String(getSafeValue(item, key as keyof T)).toLowerCase();
        return (
          filtroValores.length === 0 ||
          filtroValores.some((filtro) => itemValor.includes(filtro.toLowerCase()))
        );
      });
    });

    onFilter(dadosFiltrados);
  }, [filtros, data, onFilter]);

  const handleFilterChange = (key: string, values: string[]) => {
    setFiltros((prev) => ({ ...prev, [key]: values }));
  };
  return (
    <div className={style.div_filtros}>
      {filterableFields.map((key) => {
        const isDropdown = filterOptions[key] !== undefined;

        return (
          <div key={key}>
            {isDropdown ? (
              <div>
                <Select isMulti value={filterOptions[key] .filter((option) => filtros[key]?.includes(option.id.toString())) .map((option) => ({ value: option.id.toString(), label: option.nome }))}
                  options={filterOptions[key].map((option) => ({
                    value: option.id.toString(),
                    label: option.nome,
                  }))}
                  onChange={(selectedOptions) => handleFilterChange( key, selectedOptions.map((option) => option.value) )}
                  placeholder={`Selecione`}
                />
              </div>
            ) : (
              <input
                type="text"
                placeholder={`Filtrar por ${key}`}
                value={filtros[key]?.[0] || ""}
                onChange={(e) => handleFilterChange(key, [e.target.value])}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FiltroDinamico;