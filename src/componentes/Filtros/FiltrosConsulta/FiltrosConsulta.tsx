'use client';

import styles from '../FiltrosVisualizacao/styles.module.css';

import FiltrosGraphQL, { FiltrosGraphQLVariante, contaCamposComFiltro } from 'Componentes/Filtros/FiltrosGraphQL/FiltrosGraphQL';
import { ContextoFiltrosConsultaValor, useContextoFiltrosConsulta } from 'Contextos/Contexto__FiltrosConsulta/contexto';

export type FiltrosConsultaVariante = FiltrosGraphQLVariante;

export type FiltrosConsultaProps = {
    readonly valor?: ContextoFiltrosConsultaValor<object>;
    readonly titulo?: string;
    readonly variante?: FiltrosConsultaVariante;
};

type ContextoFiltrosConsultaValorComRegistros = ContextoFiltrosConsultaValor<object> & {
    readonly registrosOriginais?: readonly object[];
};

function obtemRegistrosOriginais(valor: ContextoFiltrosConsultaValor<object>): readonly object[] {
    if (!('registrosOriginais' in valor)) return [];

    const valorComRegistros = valor as ContextoFiltrosConsultaValorComRegistros;

    return valorComRegistros.registrosOriginais ?? [];
};

function FiltrosConsultaComContexto(props: { readonly titulo: string; readonly variante: FiltrosConsultaVariante; }) {
    const valor = useContextoFiltrosConsulta<object>();

    return <FiltrosConsultaInterno valor={valor} titulo={props.titulo} variante={props.variante} />;
};

function FiltrosConsultaInterno({ valor, titulo, variante }: { readonly valor: ContextoFiltrosConsultaValor<object>; readonly titulo: string; readonly variante: FiltrosConsultaVariante; }) {
    const { campos, filtros, filtrosAplicados, setFiltros, possuiAlteracaoPendente, aplicaFiltros, limpaFiltros, opcoesPorCampo } = valor;
    const registrosOriginais = obtemRegistrosOriginais(valor);
    const totalCamposFiltro = contaCamposComFiltro(filtros);
    const totalCamposAplicados = contaCamposComFiltro(filtrosAplicados);

    return (
        <FiltrosGraphQL
            campos={campos}
            filtros={filtros}
            setFiltros={setFiltros}
            registrosOriginais={registrosOriginais}
            titulo={titulo}
            variante={variante}
            modo="consulta"
            opcoesPorCampo={opcoesPorCampo}
            acoes={(
                <>
                    <span className={styles.resumo_filtros}>{possuiAlteracaoPendente ? 'Busca pendente' : totalCamposAplicados > 0 ? `${totalCamposAplicados} aplicado(s)` : 'Sem busca ativa'}</span>
                    <button type="button" onClick={aplicaFiltros} disabled={!possuiAlteracaoPendente} className={styles.botao_principal_filtro}>Buscar</button>
                    {(totalCamposFiltro > 0 || totalCamposAplicados > 0) && <button type="button" onClick={limpaFiltros} className={styles.botao_secundario_filtro}>Limpar</button>}
                </>
            )}
        />
    );
};

export default function FiltrosConsulta(props: FiltrosConsultaProps) {
    const titulo = props.titulo ?? 'Buscar registros';
    const variante = props.variante ?? 'consulta';

    if (props.valor) return <FiltrosConsultaInterno valor={props.valor} titulo={titulo} variante={variante} />;

    return <FiltrosConsultaComContexto titulo={titulo} variante={variante} />;
};