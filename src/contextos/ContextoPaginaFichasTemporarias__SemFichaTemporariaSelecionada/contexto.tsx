'use client';

import { createContext, useContext } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto, PAGINAS } from 'types-nora-api';

import { usePodeCriarFicha } from 'Hooks/usePodeCriarFicha';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada from 'Conteineres/PaginaFichasTemporarias/paginas/SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada/SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada';

interface ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps {
    podeCriarNovaFicha: boolean;
    temAlgumaFicha: boolean;
    consideraPasseFundador: boolean;
    temPasseFundador: boolean;
    ehColaborador: boolean;
};

const ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada = createContext<ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps | undefined>(undefined);

export const useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada = (): ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProps => {
    const context = useContext(ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada);
    if (!context) throw new Error('useContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada precisa estar dentro de um ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada');
    return context;
};

export const ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionadaProvider = ({ fichasTemporarias }: { fichasTemporarias: FichaTemporariaVisualizacaoDetalhadaDto[]; }) => {
    const { temAlgumaFicha, verificacaoPasseFundador, podeCriarNovaFicha } = usePodeCriarFicha(fichasTemporarias);

    useConfigurarLayoutContextualizado({ titulo: 'Minhas Fichas', fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.jogador, tituloTooltip: 'Voltar para Página de Jogador' } }, 'patch');

    const consideraPasseFundador = verificacaoPasseFundador.temPasse;
    const temPasseFundador = verificacaoPasseFundador.passeMencionadoPresente;
    const ehColaborador = verificacaoPasseFundador.passePermitidoPorCapacidade;

    return (
        <ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada.Provider value={{ podeCriarNovaFicha, temAlgumaFicha, consideraPasseFundador, temPasseFundador, ehColaborador }}>
            <SPA__PaginaFichasTemporarias__SemFichaTemporariaSelecionada />
        </ContextoPaginaFichasTemporarias__SemFichaTemporariaSelecionada.Provider>
    );
};