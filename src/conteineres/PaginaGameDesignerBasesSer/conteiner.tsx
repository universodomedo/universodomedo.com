'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerBasesSer__Provider, useContexto__PaginaGameDesignerBasesSer } from 'Contextos/Contexto__PaginaGameDesignerBasesSer/contexto';
import { Contexto__PaginaGameDesignerBasesSer__Cadastro__Provider } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__Cadastro/contexto';
import { Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Provider } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__EdicaoMembros/contexto';
import { Contexto__PaginaGameDesignerBasesSer__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerBasesSer() {
    return (
        <Contexto__PaginaGameDesignerBasesSer__Provider>
            <Conteiner__PaginaGameDesignerBasesSer__Interno />
        </Contexto__PaginaGameDesignerBasesSer__Provider>
    );
};

const Conteiner__PaginaGameDesignerBasesSer__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerBasesSer>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerBasesSer = ReturnType<typeof useContexto__PaginaGameDesignerBasesSer>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerBasesSer): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerBasesSer__Cadastro__Provider, { cancelaCadastro: props.voltaParaListagem, concluiCadastro: props.concluiCadastro });
    if (props.idBaseEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Provider, { idBaseSer: props.idBaseEmEdicao, voltaParaListagem: props.voltaParaListagem });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerBasesSer__Listagem__Provider, { listagemBases: props.listagemBases, iniciaCadastro: props.iniciaCadastro, selecionaBase: props.selecionaBase });
};

function useEstado(): PropsConteiner__PaginaGameDesignerBasesSer { return useContexto__PaginaGameDesignerBasesSer(); };
