'use client';

import { ReactNode } from 'react';

import styles from './styles.module.css';

import FiltrosGraphQL, { FiltrosGraphQLVariante, contaCamposComFiltro } from 'Componentes/Filtros/FiltrosGraphQL/FiltrosGraphQL';
import { ContextoFiltrosVisualizacaoValor, useContextoFiltrosVisualizacao } from '@/contextos/Contexto__Filtros/contexto';

export type FiltrosVisualizacaoVariante = FiltrosGraphQLVariante;

export type FiltrosVisualizacaoProps = {
    readonly valor?: ContextoFiltrosVisualizacaoValor<object>;
    readonly titulo?: string;
    readonly variante?: FiltrosVisualizacaoVariante;
    readonly contador?: ReactNode;
};

function FiltrosVisualizacaoComContexto(props: { readonly titulo: string; readonly variante: FiltrosVisualizacaoVariante; readonly contador?: ReactNode; }) {
    const valor = useContextoFiltrosVisualizacao<object>();

    return <FiltrosVisualizacaoInterno valor={valor} titulo={props.titulo} variante={props.variante} contador={props.contador} />;
};

function FiltrosVisualizacaoInterno({ valor, titulo, variante, contador }: { readonly valor: ContextoFiltrosVisualizacaoValor<object>; readonly titulo: string; readonly variante: FiltrosVisualizacaoVariante; readonly contador?: ReactNode; }) {
    const { campos, filtros, setFiltros, registrosOriginais } = valor;
    const totalCamposFiltro = contaCamposComFiltro(filtros);

    function limpaFiltros() {
        setFiltros([]);
    };

    return (
        <FiltrosGraphQL
            campos={campos}
            filtros={filtros}
            setFiltros={setFiltros}
            registrosOriginais={registrosOriginais}
            titulo={titulo}
            variante={variante}
            modo="visualizacao"
            acoes={(
                <>
                    <span className={styles.resumo_filtros}>{contador ?? (totalCamposFiltro > 0 ? `${totalCamposFiltro} ativo(s)` : 'Sem refinamento')}</span>
                    {totalCamposFiltro > 0 && <button type="button" onClick={limpaFiltros} className={styles.botao_secundario_filtro}>Limpar</button>}
                </>
            )}
        />
    );
};

export default function FiltrosVisualizacao(props: FiltrosVisualizacaoProps) {
    const titulo = props.titulo ?? 'Refinar esta lista';
    const variante = props.variante ?? 'visualizacao';

    if (props.valor) return <FiltrosVisualizacaoInterno valor={props.valor} titulo={titulo} variante={variante} contador={props.contador} />;

    return <FiltrosVisualizacaoComContexto titulo={titulo} variante={variante} contador={props.contador} />;
};