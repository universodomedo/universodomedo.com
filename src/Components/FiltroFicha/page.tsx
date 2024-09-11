// #region Imports
import style from "./style.module.css";
import React, { useState, useEffect } from "react";
// #endregion

interface FiltroDinamicoProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
}

const FiltroDinamico = <T extends object>({ data, onFilter }: FiltroDinamicoProps<T>) => {

  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});

  const filterableKeys = data.length > 0 ? Object.keys(data[0]) as (keyof T)[] : [];

  useEffect(() => {
    const dadosFiltrados = data.filter((item) => {
      return filterableKeys.every((key) => {
        const filtroValor = filtros[key as string]?.toLowerCase() || "";
        const itemValor = (item[key] as unknown as string)?.toLowerCase() || "";
        return filtroValor === "" || itemValor.includes(filtroValor);
      });
    });

    onFilter(dadosFiltrados);
  }, [filtros, data, onFilter]);

  const handleFilterChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={style.div_filtros}>
      {filterableKeys.map((key) => (
        <div key={key as string}>
          <input
            type="text"
            placeholder={`Filtrar por ${key as string}`}
            value={filtros[key as string] || ""}
            onChange={(e) => handleFilterChange(key as string, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default FiltroDinamico;