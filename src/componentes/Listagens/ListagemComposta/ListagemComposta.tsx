'use client';

import { ReactNode } from 'react';

import styles from './styles.module.css';

import FiltrosConsulta from 'Componentes/Filtros/FiltrosConsulta/FiltrosConsulta';
import FiltrosVisualizacao from 'Componentes/Filtros/FiltrosVisualizacao/FiltrosVisualizacao';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import type { ContextoFiltrosConsultaValor } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import type { ContextoFiltrosVisualizacaoValor } from 'Contextos/Contexto__Filtros/contexto';

export const ListagemCompostaModoExibicao = {
    GRADE: 'grade',
    LINHA: 'linha',
} as const;

export type ListagemCompostaModoExibicao = typeof ListagemCompostaModoExibicao[keyof typeof ListagemCompostaModoExibicao];

export type ListagemCompostaIdRegistro = string | number;

export type ListagemCompostaPaginacaoProps = {
    readonly temPaginaAnterior: boolean;
    readonly temProximaPagina: boolean;
    readonly aoVoltarPagina: () => void;
    readonly aoAvancarPagina: () => void;
};

export type ListagemCompostaCarregarMaisProps = {
    readonly podeCarregarMais: boolean;
    readonly carregando: string | null;
    readonly erro?: string | null;
    readonly aoCarregarMais: () => void;
    readonly textoBotao?: string;
    readonly textoCarregando?: string;
    readonly textoEsgotado?: string;
};

export type ListagemCompostaListagem<TRegistro extends object> = {
    readonly registros: readonly TRegistro[];
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly mensagemListaVazia: string;
    readonly filtrosConsulta?: ContextoFiltrosConsultaValor<object>;
    readonly filtrosVisualizacao?: ContextoFiltrosVisualizacaoValor<TRegistro>;
    readonly acoes?: ReactNode;
    readonly contador?: ReactNode;
    readonly paginacao?: ListagemCompostaPaginacaoProps;
    readonly carregarMais?: ListagemCompostaCarregarMaisProps;
    readonly rodape?: ReactNode;
};

export type ListagemCompostaProps<TRegistro extends object> = {
    readonly listagem: ListagemCompostaListagem<TRegistro>;
    readonly modoExibicao: ListagemCompostaModoExibicao;
    readonly obterIdRegistro: (registro: TRegistro) => ListagemCompostaIdRegistro;
    readonly renderizarItem: (registro: TRegistro, indice: number) => ReactNode;
};

function resolveClasseConteudo(modoExibicao: ListagemCompostaModoExibicao): string {
    if (modoExibicao === ListagemCompostaModoExibicao.LINHA) return styles.conteudo_linha;

    return styles.conteudo_grade;
};

function deveMostrarFiltroVisualizacao<TRegistro extends object>(filtrosVisualizacao: ContextoFiltrosVisualizacaoValor<TRegistro> | undefined): boolean {
    if (!filtrosVisualizacao) return false;

    return filtrosVisualizacao.totalOriginal > 0;
};

function deveMostrarPaginacao(paginacao: ListagemCompostaPaginacaoProps | undefined): boolean {
    if (!paginacao) return false;

    return paginacao.temPaginaAnterior || paginacao.temProximaPagina;
};

function deveMostrarCarregarMais(carregarMais: ListagemCompostaCarregarMaisProps | undefined): boolean {
    if (!carregarMais) return false;
    if (carregarMais.podeCarregarMais) return true;
    if (carregarMais.carregando) return true;
    if (carregarMais.erro) return true;

    return true;
};

function renderizaPaginacao(paginacao: ListagemCompostaPaginacaoProps): ReactNode {
    return (
        <div className={styles.paginacao}>
            <button type="button" onClick={paginacao.aoVoltarPagina} disabled={!paginacao.temPaginaAnterior} className={styles.botao_paginacao}>Anterior</button>
            <button type="button" onClick={paginacao.aoAvancarPagina} disabled={!paginacao.temProximaPagina} className={styles.botao_paginacao}>Próxima</button>
        </div>
    );
};

function renderizaCarregarMais(carregarMais: ListagemCompostaCarregarMaisProps): ReactNode {
    const textoBotao = carregarMais.carregando ? carregarMais.textoCarregando ?? 'Carregando...' : carregarMais.textoBotao ?? 'Carregar mais';
    const textoEsgotado = carregarMais.textoEsgotado ?? 'Todos os registros foram carregados.';

    return (
        <div className={styles.area_carregar_mais}>
            {carregarMais.erro && <span className={styles.erro_carregar_mais}>{carregarMais.erro}</span>}
            {carregarMais.podeCarregarMais || carregarMais.carregando ? (
                <button type="button" onClick={carregarMais.aoCarregarMais} disabled={!!carregarMais.carregando || !carregarMais.podeCarregarMais} className={styles.botao_carregar_mais}>{textoBotao}</button>
            ) : (
                <span className={styles.texto_fim_listagem}>{textoEsgotado}</span>
            )}
        </div>
    );
};

export default function ListagemComposta<TRegistro extends object>(props: ListagemCompostaProps<TRegistro>) {
    const { listagem } = props;
    const possuiAcoes = !!listagem.acoes;
    const possuiFiltroConsulta = !!listagem.filtrosConsulta;
    const possuiFiltroVisualizacao = deveMostrarFiltroVisualizacao(listagem.filtrosVisualizacao);
    const possuiFiltros = possuiFiltroConsulta || possuiFiltroVisualizacao;
    const possuiPaginacao = deveMostrarPaginacao(listagem.paginacao);
    const possuiCarregarMais = deveMostrarCarregarMais(listagem.carregarMais);
    const possuiRodape = possuiPaginacao || !!listagem.rodape;
    const deveMostrarLoading = !!listagem.carregando;
    const deveMostrarErro = !!listagem.erro;
    const deveMostrarVazio = !deveMostrarLoading && !deveMostrarErro && listagem.registros.length === 0;
    const deveMostrarRegistros = !deveMostrarLoading && !deveMostrarErro && listagem.registros.length > 0;
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div className={styles.recipiente_listagem_composta}>
            <section className={styles.listagem_composta}>
                {possuiAcoes && (
                    <header className={styles.cabecalho}>
                        <div className={styles.acoes}>{listagem.acoes}</div>
                    </header>
                )}
                {possuiFiltros && (
                    <div className={styles.area_filtros}>
                        {possuiFiltroConsulta && <div className={styles.filtros_globais}><FiltrosConsulta valor={listagem.filtrosConsulta} titulo="Buscar registros" variante="consulta" /></div>}
                        {possuiFiltroVisualizacao && <div className={styles.filtros_locais}><FiltrosVisualizacao valor={listagem.filtrosVisualizacao as ContextoFiltrosVisualizacaoValor<object>} titulo="Refinar esta lista" variante="visualizacao" /></div>}
                    </div>
                )}
                {listagem.contador && <div className={styles.area_contador}>{listagem.contador}</div>}
                <div className={styles.area_conteudo}>
                    {deveMostrarLoading && (
                        <div className={styles.estado}>
                            <strong>{listagem.carregando}</strong>
                        </div>
                    )}
                    {deveMostrarErro && (
                        <div className={styles.estado}>
                            <strong>Não foi possível carregar a listagem.</strong>
                            <span>{listagem.erro}</span>
                        </div>
                    )}
                    {deveMostrarVazio && (
                        <div className={styles.estado}>
                            <strong>{listagem.mensagemListaVazia}</strong>
                        </div>
                    )}
                    {deveMostrarRegistros && (
                        <>
                            <div className={resolveClasseConteudo(props.modoExibicao)} {...scrollableProps}>
                                {listagem.registros.map((registro, indice) => (
                                    <div key={props.obterIdRegistro(registro)} className={styles.item}>
                                        {props.renderizarItem(registro, indice)}
                                    </div>
                                ))}
                            </div>
                            {possuiCarregarMais && listagem.carregarMais && renderizaCarregarMais(listagem.carregarMais)}
                        </>
                    )}
                </div>
                {possuiRodape && (
                    <footer className={styles.rodape}>
                        <div className={styles.rodape_acoes}>
                            {possuiPaginacao && listagem.paginacao && renderizaPaginacao(listagem.paginacao)}
                            {listagem.rodape}
                        </div>
                    </footer>
                )}
            </section>
        </div>
    );
};