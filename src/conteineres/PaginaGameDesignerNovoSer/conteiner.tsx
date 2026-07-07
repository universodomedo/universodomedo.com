'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerNovoSer__Provider, useContexto__PaginaGameDesignerNovoSer } from 'Contextos/Contexto__PaginaGameDesignerNovoSer/contexto';
import { Contexto__PaginaGameDesignerNovoSer__Cadastro__Provider } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Cadastro/contexto';
import { Contexto__PaginaGameDesignerNovoSer__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Listagem/contexto';

export default function Conteiner__PaginaGameDesignerNovoSer() {
    return (
        <Contexto__PaginaGameDesignerNovoSer__Provider>
            <Conteiner__PaginaGameDesignerNovoSer__Interno />
        </Contexto__PaginaGameDesignerNovoSer__Provider>
    );
};

const Conteiner__PaginaGameDesignerNovoSer__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerNovoSer>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerNovoSer = ReturnType<typeof useContexto__PaginaGameDesignerNovoSer>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerNovoSer): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerNovoSer__Cadastro__Provider, { cancelaCadastro: props.voltaParaListagem, concluiCadastro: props.concluiCadastro });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerNovoSer__Listagem__Provider, { listagemSeres: props.listagemSeres, iniciaCadastro: props.iniciaCadastro });
};

function useEstado(): PropsConteiner__PaginaGameDesignerNovoSer { return useContexto__PaginaGameDesignerNovoSer(); };
