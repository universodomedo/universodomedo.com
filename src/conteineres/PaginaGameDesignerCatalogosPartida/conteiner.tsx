'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerCatalogosPartida__Provider, useContexto__PaginaGameDesignerCatalogosPartida } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida/contexto';
import { Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Listagem/contexto';
import { Contexto__PaginaGameDesignerCatalogosPartida__Nova__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Nova/contexto';
import { Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Provider } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Edicao/contexto';

export default function Conteiner__PaginaGameDesignerCatalogosPartida() {
    return (
        <Contexto__PaginaGameDesignerCatalogosPartida__Provider>
            <Conteiner__PaginaGameDesignerCatalogosPartida__Interno />
        </Contexto__PaginaGameDesignerCatalogosPartida__Provider>
    );
};

const Conteiner__PaginaGameDesignerCatalogosPartida__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerCatalogosPartida>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerCatalogosPartida = ReturnType<typeof useContexto__PaginaGameDesignerCatalogosPartida>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerCatalogosPartida): SaidaConteiner {
    if (props.estadoFluxo === 'CADASTRO') return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosPartida__Nova__Provider, { criarCatalogo: props.criarCatalogo, cancelar: props.voltaParaListagem, concluir: props.concluiCadastro });
    if (props.catalogoEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Provider, { catalogo: props.catalogoEmEdicao, todasPartidas: props.partidas, salvando: props.salvando, salvarCatalogo: props.salvarCatalogo, deletarCatalogo: props.deletarCatalogo, adicionarPartida: props.adicionarPartida, removerPartida: props.removerPartida, alternarExibicao: props.alternarExibicao, reordenarPartidas: props.reordenarPartidas, voltaParaListagem: props.voltaParaListagem });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerCatalogosPartida__Listagem__Provider, { listagemCatalogos: props.listagemCatalogos, iniciaCadastro: props.iniciaCadastro, selecionaCatalogo: props.selecionaCatalogo });
};

function useEstado(): PropsConteiner__PaginaGameDesignerCatalogosPartida { return useContexto__PaginaGameDesignerCatalogosPartida(); };
