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

function renderizaPaginacao(paginacao: ListagemCompostaPaginacaoProps): ReactNode {
    return (
        <div className={styles.paginacao}>
            <button type="button" onClick={paginacao.aoVoltarPagina} disabled={!paginacao.temPaginaAnterior} className={styles.botao_paginacao}>Anterior</button>
            <button type="button" onClick={paginacao.aoAvancarPagina} disabled={!paginacao.temProximaPagina} className={styles.botao_paginacao}>Próxima</button>
        </div>
    );
};

export default function ListagemComposta<TRegistro extends object>(props: ListagemCompostaProps<TRegistro>) {
    const { listagem } = props;
    const possuiAcoes = !!listagem.acoes;
    const possuiFiltros = !!listagem.filtrosConsulta || !!listagem.filtrosVisualizacao;
    const possuiRodape = !!listagem.contador || !!listagem.paginacao || !!listagem.rodape;
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
                        {listagem.filtrosConsulta && <div className={styles.filtros_globais}><FiltrosConsulta valor={listagem.filtrosConsulta} /></div>}
                        {listagem.filtrosVisualizacao && <div className={styles.filtros_locais}><FiltrosVisualizacao valor={listagem.filtrosVisualizacao as ContextoFiltrosVisualizacaoValor<object>} /></div>}
                    </div>
                )}
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
                        <div className={resolveClasseConteudo(props.modoExibicao)} {...scrollableProps}>
                            {listagem.registros.map((registro, indice) => (
                                <div key={props.obterIdRegistro(registro)} className={styles.item}>
                                    {props.renderizarItem(registro, indice)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {possuiRodape && (
                    <footer className={styles.rodape}>
                        <div>{listagem.contador}</div>
                        <div className={styles.rodape_acoes}>
                            {listagem.paginacao && renderizaPaginacao(listagem.paginacao)}
                            {listagem.rodape}
                        </div>
                    </footer>
                )}
            </section>
        </div>
    );
};