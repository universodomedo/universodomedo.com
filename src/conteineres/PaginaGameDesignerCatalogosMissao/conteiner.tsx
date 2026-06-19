'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerCatalogosMissao__Provider, useContexto__PaginaGameDesignerCatalogosMissao } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissao/contexto';
import { Contexto__PaginaGameDesignerCatalogosMissao__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissao__Editor/contexto';
import { Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissao__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerCatalogosMissao() {
    return (
        <Contexto__PaginaGameDesignerCatalogosMissao__Provider>
            <Conteiner__PaginaGameDesignerCatalogosMissao__Interno />
        </Contexto__PaginaGameDesignerCatalogosMissao__Provider>
    );
};

const Conteiner__PaginaGameDesignerCatalogosMissao__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerCatalogosMissao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerCatalogosMissao = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosMissao>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerCatalogosMissao): SaidaConteiner {
    if (props.estadoFluxo === 'EDITOR') return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosMissao__Editor__Provider, { catalogoEmEdicao: props.catalogoEmEdicao, voltarParaListagem: props.voltarParaListagem, concluiSalvamento: props.concluiSalvamento });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosMissao__Listagem__Provider, { listagemCatalogosMissao: props.listagemCatalogosMissao, iniciaCriacao: props.iniciaCriacao, iniciaEdicao: props.iniciaEdicao, removerCatalogo: props.removerCatalogo });
};

function useEstado(): PropsConteiner__PaginaGameDesignerCatalogosMissao { return useContexto__PaginaGameDesignerCatalogosMissao(); };