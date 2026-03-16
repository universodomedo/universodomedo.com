'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DiaDaSemana, JanelaDisponibilidadeCompletaDto, MomentoFormatado24 } from 'types-nora-api';

import { ContextoConsultarDisponibilidades_ListagemProvider } from 'Contextos/ContextoConsultarDisponibilidades_Listagem/contexto';
import { obtemJanelasDisponibilidadesPorJanela } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoConsultarDisponibilidadesProps {
    filtroDiaDaSemana: DiaDaSemana;
    setFiltroDiaDaSemana: (v: DiaDaSemana) => void;
    filtroHoraInicio: MomentoFormatado24;
    setFiltroHoraInicio: (v: MomentoFormatado24) => void;
    filtroHoraFim: MomentoFormatado24;
    setFiltroHoraFim: (v: MomentoFormatado24) => void;
    buscaAventurasPorFiltro: () => void;
};

const ContextoConsultarDisponibilidades = createContext<ContextoConsultarDisponibilidadesProps | undefined>(undefined);

export const useContextoConsultarDisponibilidades = (): ContextoConsultarDisponibilidadesProps => {
    const context = useContext(ContextoConsultarDisponibilidades);
    if (!context) throw new Error('useContextoConsultarDisponibilidades precisa estar dentro de um ContextoConsultarDisponibilidades');
    return context;
};

export const ContextoConsultarDisponibilidadesProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [filtroDiaDaSemana, setFiltroDiaDaSemana] = useState<DiaDaSemana>(() => new Date().getDay() as DiaDaSemana);
    const [filtroHoraInicio, setFiltroHoraInicio] = useState<MomentoFormatado24>('00:00');
    const [filtroHoraFim, setFiltroHoraFim] = useState<MomentoFormatado24>('23:59');
    const [janelas, setJanelas] = useState<JanelaDisponibilidadeCompletaDto[] | null>(null);

    async function buscaAventurasPorFiltro() {
        setCarregando('Buscando Lista de Janelas');

        try {
            setJanelas(await obtemJanelasDisponibilidadesPorJanela({ dds: filtroDiaDaSemana, horaInicio: filtroHoraInicio, horaFim: filtroHoraFim }));
        } catch {
            setJanelas(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaAventurasPorFiltro();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoConsultarDisponibilidades.Provider value={{ filtroDiaDaSemana, setFiltroDiaDaSemana, filtroHoraInicio, setFiltroHoraInicio, filtroHoraFim, setFiltroHoraFim, buscaAventurasPorFiltro }}>
            <ContextoConsultarDisponibilidades_ListagemProvider janelas={janelas}>
                {children}
            </ContextoConsultarDisponibilidades_ListagemProvider>
        </ContextoConsultarDisponibilidades.Provider>
    );
};