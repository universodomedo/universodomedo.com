'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { BotaoConfigurarArteCapa } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/CabecalhoDeAventura';
import Modal__ConfiguradorArteCapa from 'Componentes/ElementosModais/Modal__ConfiguradorArteCapa/Modal__ConfiguradorArteCapa';

export type ConfiguracaoArteCapa = {
    readonly tituloOperacao: string;
    readonly subtituloOperacao: string;
    readonly callback: (idArteCapa: number) => void | Promise<void>;
};

interface Contexto__Modal__ConfiguradorArteCapa__Props {
    listagemArtesCapa: ReturnType<typeof obtemListagemArtesCapa>;
    tituloOperacao: string;
    subtituloOperacao: string;
    idArteCapaSelecionada: number | null;
    selecionaArteCapa: (idArteCapa: number) => void;
    executaAtualizacaoArteCapaSelecionada: () => Promise<void>;
};

const Contexto__Modal__ConfiguradorArteCapa = createContext<Contexto__Modal__ConfiguradorArteCapa__Props | undefined>(undefined);

export const useContexto__Modal__ConfiguradorArteCapa = (): Contexto__Modal__ConfiguradorArteCapa__Props => {
    const context = useContext(Contexto__Modal__ConfiguradorArteCapa);
    if (!context) throw new Error('useContexto__Modal__ConfiguradorArteCapa precisa estar dentro de um Contexto__Modal__ConfiguradorArteCapa');
    return context;
};

export function Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider({ configArteCapa }: { configArteCapa: ConfiguracaoArteCapa; }) { return <Contexto__Modal__ConfiguradorArteCapa__Provider configArteCapa={configArteCapa} />; };

const Contexto__Modal__ConfiguradorArteCapa__Provider = ({ configArteCapa }: { configArteCapa: ConfiguracaoArteCapa; }) => {
    const listagemArtesCapa = obtemListagemArtesCapa();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = useCallback(() => { setIsModalOpen(true); }, []);

    const [idArteCapaSelecionada, setIdArteCapaSelecionada] = useState<number | null>(null);
    const selecionaArteCapa = useCallback((idArteCapa: number) => { setIdArteCapaSelecionada(idArteCapa); }, []);

    const executaAtualizacaoArteCapaSelecionada = useCallback(async () => {
        if (idArteCapaSelecionada === null) return;

        await configArteCapa.callback(idArteCapaSelecionada);
        setIsModalOpen(false);
    }, [configArteCapa, idArteCapaSelecionada]);

    return (
        <Contexto__Modal__ConfiguradorArteCapa.Provider value={useMemo(() => ({ listagemArtesCapa, tituloOperacao: configArteCapa.tituloOperacao, subtituloOperacao: configArteCapa.subtituloOperacao, idArteCapaSelecionada, selecionaArteCapa, executaAtualizacaoArteCapaSelecionada }), [configArteCapa, idArteCapaSelecionada, listagemArtesCapa, selecionaArteCapa, executaAtualizacaoArteCapaSelecionada])}>
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