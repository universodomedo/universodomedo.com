'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerSeres__Provider, useContexto__PaginaGameDesignerSeres } from 'Contextos/Contexto__PaginaGameDesignerSeres/contexto';
import { Contexto__PaginaGameDesignerSeres__Cadastro__Provider } from 'Contextos/Contexto__PaginaGameDesignerSeres__Cadastro/contexto';
import { Contexto__PaginaGameDesignerSeres__Detalhe__Provider } from 'Contextos/Contexto__PaginaGameDesignerSeres__Detalhe/contexto';
import { Contexto__PaginaGameDesignerSeres__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerSeres__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerSeres() {
    return (
        <Contexto__PaginaGameDesignerSeres__Provider>
            <Conteiner__PaginaGameDesignerSeres__Interno />
        </Contexto__PaginaGameDesignerSeres__Provider>
    );
};

const Conteiner__PaginaGameDesignerSeres__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerSeres>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerSeres = ReturnType<typeof useContexto__PaginaGameDesignerSeres>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerSeres): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerSeres__Cadastro__Provider, { cancelaCadastro: props.voltaParaListagem, concluiCadastro: props.concluiCadastro });
    if (props.idSerEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerSeres__Detalhe__Provider, { idSerEmEdicao: props.idSerEmEdicao, voltaParaListagem: props.voltaParaListagem });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerSeres__Listagem__Provider, { listagemSeres: props.listagemSeres, iniciaCadastro: props.iniciaCadastro, selecionaSer: props.selecionaSer });
};

function useEstado(): PropsConteiner__PaginaGameDesignerSeres { return useContexto__PaginaGameDesignerSeres(); };
