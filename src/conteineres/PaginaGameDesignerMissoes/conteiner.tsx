'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerMissoes__Provider, useContexto__PaginaGameDesignerMissoes } from 'Contextos/Contexto__PaginaGameDesignerMissoes/contexto';
import { Contexto__PaginaGameDesignerMissoes__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerMissoes__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerMissoes() {
    return (
        <Contexto__PaginaGameDesignerMissoes__Provider>
            <Conteiner__PaginaGameDesignerMissoes__Interno />
        </Contexto__PaginaGameDesignerMissoes__Provider>
    );
};

const Conteiner__PaginaGameDesignerMissoes__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerMissoes>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerMissoes = ReturnType<typeof useContexto__PaginaGameDesignerMissoes>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerMissoes): SaidaConteiner {
    return criaSaidaConteiner(Contexto__PaginaGameDesignerMissoes__Listagem__Provider, { listagemMissoes: props.listagemMissoes, criandoMissao: props.criandoMissao, criarMissao: props.criarMissao, removerMissao: props.removerMissao });
};

function useEstado(): PropsConteiner__PaginaGameDesignerMissoes { return useContexto__PaginaGameDesignerMissoes(); };