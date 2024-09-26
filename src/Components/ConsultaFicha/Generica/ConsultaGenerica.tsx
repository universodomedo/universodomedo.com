// Components/ConsultaGenerica/ConsultaGenerica.tsx
import React, { useState, useEffect } from 'react';
import FiltroGenerico from "./FiltroGenerico";
import { FiltroProps } from "Types/classes.tsx";
import { Consulta } from "Components/ConsultaFicha/page.tsx";

interface ConsultaGenericaProps<T> {
    abaId: string;
    data: T[];
    filtroProps: FiltroProps<T>;
    renderItem: (item: T, index: number) => React.ReactNode;
    onLoadComplete: () => void;
}

const ConsultaGenerica = <T,>({ abaId, data, filtroProps, renderItem, onLoadComplete }: ConsultaGenericaProps<T>) => {
    const [filteredData, setFilteredData] = useState<T[]>(data);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T | ((item: T) => any); direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        setFilteredData(data);
        onLoadComplete();
    }, [data]);

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
        <>
            <FiltroGenerico
                abaId={abaId}
                data={data}
                filtroPropsItems={filtroProps.items}
                onFilter={handleFilter}
                onSort={handleSort}
                sortConfig={sortConfig}
                onLoadComplete={onLoadComplete}
            />
            <Consulta
                titulo={filtroProps.titulo}
                totalRegistros={data.length}
                registros={filteredData}
                renderItem={renderItem}
                totalExibidos={filteredData.length}
            />
        </>
    );
};

export default ConsultaGenerica;