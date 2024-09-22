// #region Imports
import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import FiltroGenerico from "./FiltroGenerico";
import { FiltroProps } from "Types/classes.tsx";
// #endregion

const ConsultaGenerica = <T,>({ abaId, data, filtroProps, renderItem }: { abaId: string; data: T[]; filtroProps: FiltroProps<T>; renderItem: (item: T, index: number) => React.ReactNode; }) => {
    const [filteredData, setFilteredData] = useState<T[]>(data);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T | ((item: T) => any); direction: 'asc' | 'desc' } | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLoadComplete = () => {
        console.log('load Completo');
        setLoading(false);
    }

    const handleFilter = (filtered: T[]) => {
        setFilteredData(filtered);
    };

    const handleSort = (key: keyof T | ((item: T) => any), direction: 'asc' | 'desc') => {
        setSortConfig({ key, direction });

        const sortedData = [...filteredData].sort((a, b) => {
            const aValue = typeof key === "function" ? key(a) : a[key];
            const bValue = typeof key === "function" ? key(b) : b[key];

            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
            
            return 0;
        });

        setFilteredData(sortedData);
    };

    return (
        <div className={style.conteudo_consulta}>
            <h1>{filtroProps.titulo} [{data.length}]</h1>

            <FiltroGenerico abaId={abaId} data={data} filtroPropsItems={filtroProps.items} onFilter={handleFilter} onSort={handleSort} sortConfig={sortConfig} onLoadingComplete={handleLoadComplete} />

            {!loading && (<>
                <div className={style.registros}>
                    {filteredData.map((item, index) => renderItem(item, index))}
                </div>

                <div className={style.total_exibidos}>
                    <p>Registros exibidos: {filteredData.length}</p>
                </div>
            </>)}
        </div>
    );
};

export default ConsultaGenerica;