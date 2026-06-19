'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Provider, useContexto__PaginaGameDesignerCatalogosMissaoExibicao } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissaoExibicao/contexto';
import { Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor/contexto';
import { Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerCatalogosMissaoExibicao() {
    return (
        <Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Provider>
            <Conteiner__PaginaGameDesignerCatalogosMissaoExibicao__Interno />
        </Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Provider>
    );
};

const Conteiner__PaginaGameDesignerCatalogosMissaoExibicao__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerCatalogosMissaoExibicao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerCatalogosMissaoExibicao = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosMissaoExibicao>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerCatalogosMissaoExibicao): SaidaConteiner {
    if (props.estadoFluxo === 'EDITOR') return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Provider, { catalogoSelecionado: props.catalogoSelecionado, exibicaoSelecionada: props.exibicaoSelecionada, voltarParaListagem: props.voltarParaListagem, concluiSalvamento: props.concluiSalvamento });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Listagem__Provider, { listagemCatalogosMissao: props.listagemCatalogosMissao, listagemCatalogosMissaoExibicao: props.listagemCatalogosMissaoExibicao, iniciaConfiguracao: props.iniciaConfiguracao });
};

function useEstado(): PropsConteiner__PaginaGameDesignerCatalogosMissaoExibicao { return useContexto__PaginaGameDesignerCatalogosMissaoExibicao(); };
