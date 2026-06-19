'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerMissoesExibicao__Provider, useContexto__PaginaGameDesignerMissoesExibicao } from 'Contextos/Contexto__PaginaGameDesignerMissoesExibicao/contexto';
import { Contexto__PaginaGameDesignerMissoesExibicao__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerMissoesExibicao__Editor/contexto';
import { Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerMissoesExibicao__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerMissoesExibicao() {
    return (
        <Contexto__PaginaGameDesignerMissoesExibicao__Provider>
            <Conteiner__PaginaGameDesignerMissoesExibicao__Interno />
        </Contexto__PaginaGameDesignerMissoesExibicao__Provider>
    );
};

const Conteiner__PaginaGameDesignerMissoesExibicao__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerMissoesExibicao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerMissoesExibicao = ReturnType<typeof useContexto__PaginaGameDesignerMissoesExibicao>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerMissoesExibicao): SaidaConteiner {
    if (props.estadoFluxo === 'EDITOR') return criaSaidaConteiner(Contexto__PaginaGameDesignerMissoesExibicao__Editor__Provider, { missaoSelecionada: props.missaoSelecionada, detalheSelecionado: props.detalheSelecionado, exibicaoSelecionada: props.exibicaoSelecionada, listagemCatalogosMissao: props.listagemCatalogosMissao, voltarParaListagem: props.voltarParaListagem, concluiSalvamento: props.concluiSalvamento });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerMissoesExibicao__Listagem__Provider, { listagemMissoes: props.listagemMissoes, listagemMissoesDetalhes: props.listagemMissoesDetalhes, listagemMissoesExibicao: props.listagemMissoesExibicao, listagemCatalogosMissao: props.listagemCatalogosMissao, iniciaConfiguracao: props.iniciaConfiguracao });
};

function useEstado(): PropsConteiner__PaginaGameDesignerMissoesExibicao { return useContexto__PaginaGameDesignerMissoesExibicao(); };
