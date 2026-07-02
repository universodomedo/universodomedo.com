'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerConfiguracaoPartida__Provider, useContexto__PaginaGameDesignerConfiguracaoPartida } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Nova/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

export default function Conteiner__PaginaGameDesignerConfiguracaoPartida() {
    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Provider>
            <Conteiner__PaginaGameDesignerConfiguracaoPartida__Interno />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Provider>
    );
};

const Conteiner__PaginaGameDesignerConfiguracaoPartida__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerConfiguracaoPartida>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerConfiguracaoPartida = ReturnType<typeof useContexto__PaginaGameDesignerConfiguracaoPartida>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerConfiguracaoPartida): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Provider, { criarPartida: props.criarPartida, cancelar: props.voltaParaListagem, concluir: props.concluiCadastro });
    if (props.partidaEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider, { partida: props.partidaEmEdicao, salvando: props.salvando, salvarConfiguracaoPartida: props.salvarConfiguracaoPartida, alternarDesabilitadaPartida: props.alternarDesabilitadaPartida, voltaParaListagem: props.voltaParaListagem });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Provider, { listagemPartidas: props.listagemPartidas, iniciaCadastro: props.iniciaCadastro, selecionaPartida: props.selecionaPartida });
};

function useEstado(): PropsConteiner__PaginaGameDesignerConfiguracaoPartida { return useContexto__PaginaGameDesignerConfiguracaoPartida(); };
