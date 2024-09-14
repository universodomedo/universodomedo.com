import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";

interface FiltroDinamicoProps<T> {
    data: T[];
    onFilter: (filteredData: T[]) => void;
    filterConfig: FilterConfig;
    sortConfig: SortConfig<T> | null;
    onSortClick: (key: keyof T) => void;
}
  
const getSafeValue = <T, K extends keyof T>(obj: T, key: K): T[K] => {
    return obj[key];
};
  
const FiltroDinamico = <T,>({ data, onFilter, filterConfig, sortConfig, onSortClick, }: FiltroDinamicoProps<T>) => {
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
                    <div key={key} className={style.div_filtro}>
                        <div className={style.sort_label} onClick={() => onSortClick(key as keyof T)}>
                            <strong>{key}</strong>
                            {sortConfig?.key === key && (
                                <span>
                                    {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                                </span>
                            )}
                        </div>
    
                        {isDropdown ? (
                            <Select isMulti
                                value={filterOptions[key].filter((option) => filtros[key]?.includes(option.id.toString())).map((option) => ({ value: option.id.toString(), label: option.nome }))}
                                options={filterOptions[key].map((option) => ({
                                    value: option.id.toString(),
                                    label: option.nome,
                                }))}
                                onChange={(selectedOptions) => handleFilterChange(key, selectedOptions.map((option) => option.value))}
                                placeholder={`Selecione`}
                            />
                        ) : (
                            <input type="text" placeholder={`Filtrar por ${key}`} value={filtros[key]?.[0] || ""} onChange={(e) => handleFilterChange(key, [e.target.value])}/>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

interface FilterConfig {
    filterableFields: string[];
    filterOptions: Record<string, { id: number; nome: string }[]>;
}

interface SortConfig<T> {
    key: keyof T;
    direction: "asc" | "desc";
}

interface ConsultaGenericaProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => JSX.Element;
    filterConfig: FilterConfig;
    sortOptions: Array<{ label: string; value: keyof T }>;
}

const ConsultaGenerica = <T,>({ data, renderItem, filterConfig, sortOptions, }: ConsultaGenericaProps<T>) => {
    const [filteredData, setFilteredData] = useState<T[]>(data);
    const [sortedData, setSortedData] = useState<T[]>(filteredData);
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

    const handleSortClick = (key: keyof T) => {
        if (sortConfig?.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc", });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    const sortData = (data: T[]): T[] => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            let aValue: any = a[sortConfig.key];
            let bValue: any = b[sortConfig.key];

            if (sortConfig.key === "refElemento") {
                aValue = aValue?.nome;
                bValue = bValue?.nome;
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

            return 0;
        });
    };

    useEffect(() => {
        setSortedData(sortData(filteredData));
    }, [filteredData, sortConfig]);

    return (
        <div className={style.conteudo_consulta}>
            <h1>Rituais [{data.length}]</h1>

            <FiltroDinamico data={data} onFilter={setFilteredData} filterConfig={filterConfig} sortConfig={sortConfig} onSortClick={handleSortClick} />

            {sortedData.length > 0 ? (
                <div className={style.registros}>
                    {sortedData.map((item, index) => renderItem(item, index))}
                </div>
            ) : (
                <p>Nenhum item encontrado</p>
            )}

            <div className={style.total_exibidos}>
                <p>Registros exibidos: {sortedData.length}</p>
            </div>
        </div>
    );
};

export default ConsultaGenerica;