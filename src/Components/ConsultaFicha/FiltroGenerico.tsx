// #region Imports
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import style from "./style.module.css";
import { FiltroPropsItems } from "Types/classes.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from 'Redux/store.ts';
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

interface FiltroGenericoProps<T> { abaId: string; data: T[]; filtroPropsItems: FiltroPropsItems<T>[]; onFilter: (filteredData: T[]) => void; onSort: (key: keyof T | ((item: T) => any), direction: 'asc' | 'desc') => void; sortConfig: { key: keyof T | ((item: T) => any); direction: 'asc' | 'desc' } | null; onLoadComplete: () => void; }

const FiltroGenerico = <T,>({ abaId, data, filtroPropsItems, onFilter, onSort, sortConfig, onLoadComplete }: FiltroGenericoProps<T>) => {
    const dispatch = useDispatch();
    const abaState = useSelector((state: RootState) => state.abasHelper[abaId]);

    const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});
    const filtrosRef = useRef(filtros);

    const updateFilteredDataRedux = () => {
        dispatch(setCacheFiltros({ abaId, filtros: filtros }))
    }

    const getKeyValue = (item: T, key: keyof T | ((item: T) => any)) => {
        return typeof key === 'function' ? key(item) : item[key];
    };

    useEffect(() => {
        if (abaState && abaState.filtros) {
            setFiltros(abaState.filtros);
        }

        onLoadComplete();
    }, []);

    useEffect(() => {
        filtrosRef.current = filtros;

        const dadosFiltrados = data.filter((item) => {
            return filtroPropsItems.every((config) => {
                const filtroValores = filtros[config.key as string] || [];
                const itemValor = String(getKeyValue(item, config.key)).toLowerCase();

                return (filtroValores.length === 0 || filtroValores.some((filtro) => itemValor.includes(filtro.toLowerCase())));
            });
        });

        onFilter(dadosFiltrados);

        return () => {
            updateFilteredDataRedux();
        };
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
            {filtroPropsItems.map((config, index) => (
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
                            styles={{
                                control: (provided) => ({ ...provided, flexGrow: 1, minWidth: 0, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }),
                                multiValue: (provided) => ({ ...provided, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }),
                                valueContainer: (provided) => ({ ...provided, display: 'flex', flexWrap: 'nowrap', overflow: 'hidden', whiteSpace: 'nowrap' }),
                                multiValueLabel: (provided) => ({ ...provided, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
                            }}
                        />
                    ) : (
                        <input type={config.filterType} placeholder={`Filtrar por ${config.label}`} value={filtros[config.key as string]?.[0] || ""} onChange={(e) => handleFilterChange(config.key, [e.target.value])} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default FiltroGenerico;