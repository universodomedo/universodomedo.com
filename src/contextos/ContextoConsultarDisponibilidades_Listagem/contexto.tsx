'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JanelaDisponibilidadeCompletaDto } from 'types-nora-api';

interface ContextoConsultarDisponibilidades_ListagemProps {
    janelas: JanelaDisponibilidadeCompletaDto[] | null;
    isEmFoco: (idJanela: number) => boolean;
    toggleFoco: (idJanela: number) => void;
};

const ContextoConsultarDisponibilidades_Listagem = createContext<ContextoConsultarDisponibilidades_ListagemProps | undefined>(undefined);

export const useContextoConsultarDisponibilidades_Listagem = (): ContextoConsultarDisponibilidades_ListagemProps => {
    const context = useContext(ContextoConsultarDisponibilidades_Listagem);
    if (!context) throw new Error('useContextoConsultarDisponibilidades_Listagem precisa estar dentro de um ContextoConsultarDisponibilidades_Listagem');
    return context;
};

export const ContextoConsultarDisponibilidades_ListagemProvider = ({ children, janelas }: { children: React.ReactNode; janelas: JanelaDisponibilidadeCompletaDto[] | null }) => {
    const [idsEmFoco, setIdsEmFoco] = useState<number[]>([]);

    useEffect(() => {
        setIdsEmFoco([]);
    }, [janelas]);

    function isEmFoco(idJanela: number): boolean {
        return idsEmFoco.includes(idJanela);
    };

    function toggleFoco(idJanela: number) {
        setIdsEmFoco(prev => (prev.includes(idJanela) ? prev.filter(id => id !== idJanela) : [...prev, idJanela]));
    };

    const janelasOrdenadas = useMemo(() => {
        if (!janelas) return null;

        const setEmFoco = new Set<number>(idsEmFoco);
        const foco: JanelaDisponibilidadeCompletaDto[] = [];
        const normal: JanelaDisponibilidadeCompletaDto[] = [];

        for (const j of janelas) (setEmFoco.has(j.id) ? foco : normal).push(j);

        return [...foco, ...normal];
    }, [janelas, idsEmFoco]);
    
    return (
        <ContextoConsultarDisponibilidades_Listagem.Provider value={{ janelas: janelasOrdenadas, isEmFoco, toggleFoco }}>
            {children}
        </ContextoConsultarDisponibilidades_Listagem.Provider>
    );
};