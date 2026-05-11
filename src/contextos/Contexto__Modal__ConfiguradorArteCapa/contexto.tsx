'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { GraphqlTypesArquivoTipadoArte } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { BotaoConfigurarArteCapa } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/CabecalhoDeAventura';
import Modal__ConfiguradorArteCapa from 'Componentes/ElementosModais/Modal__ConfiguradorArteCapa/Modal__ConfiguradorArteCapa';

interface Contexto__Modal__ConfiguradorArteCapa__Props {
    listagemArtesCapa: ReturnType<typeof obtemListagemArtesCapa>;
    configArteCapa: { callback: () => void; subtituloOperacao: string; };
    idArteCapaSelecionada: number | null;
    selecionaArteCapa: (idArteCapa: number) => void;
};

const Contexto__Modal__ConfiguradorArteCapa = createContext<Contexto__Modal__ConfiguradorArteCapa__Props | undefined>(undefined);

export const useContexto__Modal__ConfiguradorArteCapa = (): Contexto__Modal__ConfiguradorArteCapa__Props => {
    const context = useContext(Contexto__Modal__ConfiguradorArteCapa);
    if (!context) throw new Error('useContexto__Modal__ConfiguradorArteCapa precisa estar dentro de um Contexto__Modal__ConfiguradorArteCapa');
    return context;
};

export function Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider({ configArteCapa }: { configArteCapa: { callback: () => void; subtituloOperacao: string; }; }) {
    return <Contexto__Modal__ConfiguradorArteCapa__Provider configArteCapa={configArteCapa} />;
};

const Contexto__Modal__ConfiguradorArteCapa__Provider = ({ configArteCapa }: { configArteCapa: { callback: () => void; subtituloOperacao: string; }; }) => {
    const listagemArtesCapa = obtemListagemArtesCapa();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = useCallback(() => { setIsModalOpen(true); }, []);

    const [idArteCapaSelecionada, setIdArteCapaSelecionada] = useState<number | null>(null);
    const selecionaArteCapa = useCallback((idArteCapa: number) => { setIdArteCapaSelecionada(idArteCapa); }, []);

    return (
        <Contexto__Modal__ConfiguradorArteCapa.Provider value={useMemo(() => ({ listagemArtesCapa, configArteCapa, idArteCapaSelecionada, selecionaArteCapa }), [configArteCapa, listagemArtesCapa])}>
            <BotaoConfigurarArteCapa openModalConfigurarArteCapa={openModal} />
            <Modal__ConfiguradorArteCapa isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Contexto__Modal__ConfiguradorArteCapa.Provider>
    );
};

//

export function obtemListagemArtesCapa() {
    return useNoraGraphQLListagem('ArquivoTipadoArte', {
        select: ['id', 'dadosArteCapa'],
        itensPorPagina: 12,
        carregando: 'Buscando Capas',
        mensagemErro: 'Houve um erro recuperando as Capas existentes',
        mensagemListaVazia: 'Nenhuma capa encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capa encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};