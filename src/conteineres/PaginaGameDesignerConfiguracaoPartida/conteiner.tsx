'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerConfiguracaoPartida__Provider, useContexto__PaginaGameDesignerConfiguracaoPartida } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Nova/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes/contexto';

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
    if (props.partidaEmConfiguracao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider, { partida: props.partidaEmConfiguracao, salvando: props.salvando, fecharConfiguracao: props.fecharConfiguracao, salvarConfiguracao: props.salvarConfiguracao });
    if (props.partidaEmDetalhes !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes__Provider, { partida: props.partidaEmDetalhes, fecharDetalhes: props.fecharDetalhes });
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Provider, { criarPartida: props.criarPartida, cancelar: props.voltaParaListagem, concluir: props.concluiCadastro });
    if (props.partidaEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider, { partida: props.partidaEmEdicao, salvando: props.salvando, salvarPartida: props.salvarPartida, deletarPartida: props.deletarPartida, abrirConfiguracao: props.abrirConfiguracao, abrirDetalhes: props.abrirDetalhes, voltaParaListagem: props.voltaParaListagem });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem__Provider, { listagemPartidas: props.listagemPartidas, iniciaCadastro: props.iniciaCadastro, selecionaPartida: props.selecionaPartida });
};

function useEstado(): PropsConteiner__PaginaGameDesignerConfiguracaoPartida { return useContexto__PaginaGameDesignerConfiguracaoPartida(); };
