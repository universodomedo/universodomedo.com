'use client';

import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoPaginaPreJogo_JogadorProvider, useContextoPaginaPreJogo_Jogador } from 'Contextos/ContextoPaginaPreJogo_Jogador/contexto';
import { Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Provider } from 'Contextos/Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada/contexto';
import { ContextoVincularJogadorSessaoProvider } from 'Contextos/ContextoVincularJogadorSessaoProvider/contexto';

export default function Conteiner__PaginaPreJogo_Jogador() {
    return (
        <ContextoPaginaPreJogo_JogadorProvider>
            <Conteiner__PaginaPreJogo_Jogador__Interno />
        </ContextoPaginaPreJogo_JogadorProvider>
    );
};

const Conteiner__PaginaPreJogo_Jogador__Interno = criaConteiner<PropsConteiner__PaginaPreJogo_Jogador>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPreJogo_Jogador = {
    sessoesPrevistas: VIEW_SessaoDeJogadorDto[];
    setIdSessaoSelecionada: (v: number) => void;
    deselecionaSessao: () => void;
    sessaoSelecionada: VIEW_SessaoDeJogadorDto | null;
    fichas: FichaTemporariaVisualizacaoDetalhadaDto[];
};

function resolveSaida(props: PropsConteiner__PaginaPreJogo_Jogador): SaidaConteiner {
    if (props.sessaoSelecionada) return criaSaidaConteiner(ContextoVincularJogadorSessaoProvider, { sessao: props.sessaoSelecionada, fichasUsuario: props.fichas, acaoParaVoltarPagina: props.deselecionaSessao });

    return criaSaidaConteiner(Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada__Provider, { sessoes: props.sessoesPrevistas, selecionaSessao: props.setIdSessaoSelecionada });
};

function useEstado(): PropsConteiner__PaginaPreJogo_Jogador {
    const { sessoesPrevistas, setIdSessaoSelecionada, deselecionaSessao, sessaoSelecionada, fichas } = useContextoPaginaPreJogo_Jogador();

    return { sessoesPrevistas, setIdSessaoSelecionada, deselecionaSessao, sessaoSelecionada, fichas };
};