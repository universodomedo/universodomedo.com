'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaDocumentacaoProduto__Props, Contexto__PaginaDocumentacaoProduto__Provider, useContexto__PaginaDocumentacaoProduto } from 'Contextos/Contexto__PaginaDocumentacaoProduto/contexto';
import { Contexto__PaginaDocumentacaoProduto__Listagem__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Listagem/contexto';
import { Contexto__PaginaDocumentacaoProduto__Documentacao__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';
import { Contexto__PaginaDocumentacaoProduto__Catalogo__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Catalogo/contexto';
import { Contexto__PaginaDocumentacaoProduto__Mapa__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Mapa/contexto';
import { Contexto__PaginaDocumentacaoProduto__Jornadas__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Jornadas/contexto';
import { Contexto__PaginaDocumentacaoProduto__Edicao__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Edicao/contexto';
import { Contexto__PaginaDocumentacaoProduto__Ctas__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Ctas/contexto';
import { Contexto__PaginaDocumentacaoProduto__Verbete__Provider } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Verbete/contexto';

export function Conteiner__PaginaDocumentacaoProduto() {
    return (
        <Contexto__PaginaDocumentacaoProduto__Provider>
            <Conteiner__PaginaDocumentacaoProduto__Interno />
        </Contexto__PaginaDocumentacaoProduto__Provider>
    );
};

export const Conteiner__PaginaDocumentacaoProduto__Interno = criaConteiner<PropsConteiner__PaginaDocumentacaoProduto>({ useEstado, resolveSaida });

type PropsConteiner__PaginaDocumentacaoProduto = Contexto__PaginaDocumentacaoProduto__Props;

// Fluxo controlado aqui (não dentro das SPAs): gerindo catálogo → Personas & Necessidades; página selecionada → Verbete em LEITURA (documento; inclusive vindo do Mapa) ou Documentação em EDIÇÃO quando o Editar foi acionado; mapa aberto → Mapa de Navegação; senão → Listagem das páginas reais.
function resolveSaida(props: PropsConteiner__PaginaDocumentacaoProduto): SaidaConteiner {
    if (props.gerindoCatalogo) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Catalogo__Provider, { listagemPersonas: props.listagemPersonas, listagemNecessidades: props.listagemNecessidades, criarPersona: props.criarPersona, atualizarPersona: props.atualizarPersona, criarNecessidade: props.criarNecessidade, atualizarNecessidade: props.atualizarNecessidade, fecharCatalogo: props.fecharCatalogo });

    if (props.paginaSelecionada !== null && !props.editandoDocumentacao) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Verbete__Provider, { pagina: props.paginaSelecionada, documentacao: props.documentacaoSelecionada, listagemPersonas: props.listagemPersonas, listagemCtas: props.listagemCtas, listagemCtasPersonas: props.listagemCtasPersonas, listagemTiposSecao: props.listagemTiposSecao, listagemPaginas: props.listagemPaginas, listagemJornadas: props.listagemJornadas, selecionarPagina: props.selecionarPagina, abrirEdicao: props.abrirEdicaoDocumentacao, voltar: props.voltar });

    if (props.paginaSelecionada !== null) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Documentacao__Provider, { pagina: props.paginaSelecionada, documentacao: props.documentacaoSelecionada, listagemPersonas: props.listagemPersonas, listagemNecessidades: props.listagemNecessidades, listagemCtas: props.listagemCtas, listagemTiposSecao: props.listagemTiposSecao, salvarDocumentacao: props.salvarDocumentacao, voltar: props.fecharEdicaoDocumentacao });

    if (props.mapaAberto) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Mapa__Provider, { listagemPaginas: props.listagemPaginas, listagemLigacoes: props.listagemLigacoes, listagemPosicoes: props.listagemPosicoes, estaDocumentada: props.estaDocumentada, selecionarPagina: props.selecionarPagina, criarLigacao: props.criarLigacao, removerLigacao: props.removerLigacao, definirPosicao: props.definirPosicao, fecharMapa: props.fecharMapa });

    if (props.vendoJornadas) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Jornadas__Provider, { listagemJornadas: props.listagemJornadas, listagemPersonas: props.listagemPersonas, listagemPaginas: props.listagemPaginas, estaDocumentada: props.estaDocumentada, selecionarPagina: props.selecionarPagina, criarJornada: props.criarJornada, atualizarJornada: props.atualizarJornada, fecharJornadas: props.fecharJornadas });

    if (props.vendoEdicao) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Edicao__Provider, { listagemPaginas: props.listagemPaginas, listagemDocumentacoes: props.listagemDocumentacoes, listagemPersonas: props.listagemPersonas, listagemNecessidades: props.listagemNecessidades, listagemLigacoes: props.listagemLigacoes, listagemJornadas: props.listagemJornadas, listagemCtas: props.listagemCtas, listagemCtasPersonas: props.listagemCtasPersonas, listagemTiposSecao: props.listagemTiposSecao, estaDocumentada: props.estaDocumentada, fecharEdicao: props.fecharEdicao });

    if (props.gerindoCtas) return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Ctas__Provider, { listagemCtas: props.listagemCtas, listagemCtasPersonas: props.listagemCtasPersonas, listagemTiposSecao: props.listagemTiposSecao, listagemPersonas: props.listagemPersonas, listagemPaginas: props.listagemPaginas, listagemJornadas: props.listagemJornadas, criarCta: props.criarCta, atualizarCta: props.atualizarCta, vincularCtaPersona: props.vincularCtaPersona, removerCtaPersona: props.removerCtaPersona, criarTipoSecao: props.criarTipoSecao, atualizarTipoSecao: props.atualizarTipoSecao, fecharCtas: props.fecharCtas });

    return criaSaidaConteiner(Contexto__PaginaDocumentacaoProduto__Listagem__Provider, { listagemPaginas: props.listagemPaginas, estaDocumentada: props.estaDocumentada, selecionarPagina: props.selecionarPagina, abrirCatalogo: props.abrirCatalogo, abrirMapa: props.abrirMapa, abrirJornadas: props.abrirJornadas, abrirEdicao: props.abrirEdicao, abrirCtas: props.abrirCtas });
};

function useEstado(): PropsConteiner__PaginaDocumentacaoProduto { return useContexto__PaginaDocumentacaoProduto(); };