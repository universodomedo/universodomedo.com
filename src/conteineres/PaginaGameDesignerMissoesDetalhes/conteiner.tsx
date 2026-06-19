'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerMissoesDetalhes__Provider, useContexto__PaginaGameDesignerMissoesDetalhes } from 'Contextos/Contexto__PaginaGameDesignerMissoesDetalhes/contexto';
import { Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerMissoesDetalhes__Editor/contexto';
import { Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerMissoesDetalhes__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerMissoesDetalhes() {
    return (
        <Contexto__PaginaGameDesignerMissoesDetalhes__Provider>
            <Conteiner__PaginaGameDesignerMissoesDetalhes__Interno />
        </Contexto__PaginaGameDesignerMissoesDetalhes__Provider>
    );
};

const Conteiner__PaginaGameDesignerMissoesDetalhes__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerMissoesDetalhes>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerMissoesDetalhes = ReturnType<typeof useContexto__PaginaGameDesignerMissoesDetalhes>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerMissoesDetalhes): SaidaConteiner {
    if (props.estadoFluxo === 'EDITOR') return criaSaidaConteiner(Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Provider, { missaoSelecionada: props.missaoSelecionada, detalheSelecionado: props.detalheSelecionado, voltarParaListagem: props.voltarParaListagem, concluiSalvamento: props.concluiSalvamento });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerMissoesDetalhes__Listagem__Provider, { listagemMissoes: props.listagemMissoes, listagemMissoesDetalhes: props.listagemMissoesDetalhes, iniciaConfiguracao: props.iniciaConfiguracao });
};

function useEstado(): PropsConteiner__PaginaGameDesignerMissoesDetalhes { return useContexto__PaginaGameDesignerMissoesDetalhes(); };
