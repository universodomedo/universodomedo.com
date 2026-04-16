'use client';

import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada } from 'Contextos/ContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada/contexto';
import { ContextoPaginaFichaTemporariaProvider } from 'Contextos/ContextoPaginaFichaTemporaria/contexto';

export const Conteiner__PaginaFichaTemporaria = criaConteiner<PropsConteiner__PaginaFichaTemporaria>({ useEstado, resolveSaida });

type PropsConteiner__PaginaFichaTemporaria = {
    fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto;
    acaoVoltar: () => void;
};

function resolveSaida(props: PropsConteiner__PaginaFichaTemporaria): SaidaConteiner {
    useConfigurarLayoutContextualizado({ titulo: null, fecharProps: { tipo: 'acao', executar: props.acaoVoltar, tituloTooltip: 'Voltar para Lista de Fichas' } }, 'patch');

    return criaSaidaConteiner(ContextoPaginaFichaTemporariaProvider, { fichaTemporaria: props.fichaTemporaria });
};

function useEstado(): PropsConteiner__PaginaFichaTemporaria {
    const { fichaTemporaria, acaoVoltar } = useContextoPaginaFichasTemporarias__ComFichaTemporariaSelecionada();

    return { fichaTemporaria, acaoVoltar };
};