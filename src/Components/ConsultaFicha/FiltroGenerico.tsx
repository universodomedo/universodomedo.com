import React, { useState, useEffect } from "react";
import Select from "react-select";
import style from "./style.module.css";
import { ConfiguracaoFiltroOrdenacao } from "Types/classes.tsx";

interface FiltroGenericoProps<T> { data: T[]; filterSortConfig: ConfiguracaoFiltroOrdenacao<T>[]; onFilter: (filteredData: T[]) => void; onSort: (key: keyof T | ((item: T) => any), direction: 'asc' | 'desc') => void; sortConfig: { key: keyof T | ((item: T) => any); direction: 'asc' | 'desc' } | null; }

const FiltroGenerico = <T,>({ data, filterSortConfig, onFilter, onSort, sortConfig }: FiltroGenericoProps<T>) => {
    const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});

    const getKeyValue = (item: T, key: keyof T | ((item: T) => any)) => {
        return typeof key === 'function' ? key(item) : item[key];
    };

    useEffect(() => {
        const dadosFiltrados = data.filter((item) => {
            return filterSortConfig.every((config) => {
                const filtroValores = filtros[config.key as string] || [];
                const itemValor = String(getKeyValue(item, config.key)).toLowerCase();

                return ( filtroValores.length === 0 || filtroValores.some((filtro) => itemValor.includes(filtro.toLowerCase())) );
            });
        });

        onFilter(dadosFiltrados);
    }, [filtros, data]);

    const handleFilterChange = (key: keyof T | ((item: T) => any), values: string[]) => {
        setFiltros((prev) => ({ ...prev, [key as string]: values }));
    };

    const handleSortClick = (key: keyof T | ((item: T) => any)) => {
        if (sortConfig?.key === key) {
            onSort(key, sortConfig.direction === 'asc' ? 'desc' : 'asc');
        } else {
            onSort(key, 'asc');
        }
    };

    return (
        <div className={style.div_filtros}>
            {filterSortConfig.map((config, index) => (
                <div key={index} className={style.div_filtro}>
                    <span onClick={() => config.sortEnabled && handleSortClick(config.key)}>
                        {config.label}
                        {sortConfig?.key === config.key && (
                            <span>{sortConfig!.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                    </span>

                    {config.filterType === 'select' && config.options ? (
                        <Select isMulti
                            value={config.options.filter((option) => filtros[config.key as string]?.includes(option.id.toString())).map((option) => ({ value: option.id.toString(), label: option.nome }))}
                            options={config.options.map((option) => ({
                                value: option.id.toString(),
                                label: option.nome,
                            }))}
                            onChange={(selectedOptions) => handleFilterChange(config.key, selectedOptions.map((option) => option.value))}
                            placeholder={`Selecione`}
                        />
                    ) : (
                        <input type={config.filterType} placeholder={`Filtrar por ${config.label}`} value={filtros[config.key as string]?.[0] || ""} onChange={(e) => handleFilterChange(config.key, [e.target.value])}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FiltroGenerico;