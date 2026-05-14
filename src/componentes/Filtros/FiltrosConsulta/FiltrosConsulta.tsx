'use client';

import { GraphqlFiltroCampoTipo, GraphqlFiltroConsultaCampoDef, GraphqlFiltroControleVisualizacao, type GraphqlOpcaoFiltroConsulta, type GraphqlOpcoesFiltroConsultaCampo } from 'types-nora-api';

import styles from '../FiltrosVisualizacao/styles.module.css';

import CampoFiltroBooleano from 'Componentes/Filtros/CamposFiltro/Booleano/Booleano';
import CampoFiltroDataRange from 'Componentes/Filtros/CamposFiltro/DataRange/DataRange';
import CampoFiltroMultiSelect from 'Componentes/Filtros/CamposFiltro/MultiSelect/MultiSelect';
import CampoFiltroValorUnico from 'Componentes/Filtros/CamposFiltro/ValorUnico/ValorUnico';
import { ContextoFiltrosConsultaValor, useContextoFiltrosConsulta } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import { NoraGraphQLFiltroConsultaAtivo } from 'Hooks/useNoraGraphQLFiltroConsulta';

export type FiltrosConsultaVariante = 'consulta' | 'visualizacao';

export type FiltrosConsultaProps = {
    readonly valor?: ContextoFiltrosConsultaValor<object>;
    readonly titulo?: string;
    readonly variante?: FiltrosConsultaVariante;
};

type ContextoFiltrosConsultaValorComRegistros = ContextoFiltrosConsultaValor<object> & {
    readonly registrosOriginais?: readonly object[];
};

const LABEL_PARTES_CAMPO: Record<string, string> = {
    id: 'ID',
    dataCriacao: 'Data Criação',
    dataPrevisaoInicio: 'Data Prevista',
    dataInicio: 'Data Início',
    duracaoEmSegundos: 'Duração',
    nome: 'Nome',
    usuario: 'Usuário',
    username: 'Username',
    tipoPersonagem: 'Tipo',
    possuiAvatarPendente: 'Possui Avatar Pendente',
};

function separaCamelCase(texto: string): string {
    return texto.replace(/([a-z])([A-Z])/g, '$1 $2');
};

function capitalizaPalavra(texto: string): string {
    if (texto.length === 0) return texto;

    return `${texto[0].toUpperCase()}${texto.slice(1)}`;
};

function humanizaParteCampo(parte: string): string {
    const labelMapeado = LABEL_PARTES_CAMPO[parte];
    if (labelMapeado) return labelMapeado;

    return separaCamelCase(parte).split(' ').map(capitalizaPalavra).join(' ');
};

function humanizaLabelCampo(campo: GraphqlFiltroConsultaCampoDef<object>): string {
    if (campo.label && campo.label !== campo.campo) return campo.label;

    return campo.path.map(humanizaParteCampo).join(' / ');
};

function resolveClasseFiltros(variante: FiltrosConsultaVariante): string {
    if (variante === 'visualizacao') return `${styles.filtros} ${styles.filtros_visualizacao}`;

    return `${styles.filtros} ${styles.filtros_consulta}`;
};

function contaCamposComFiltro(filtros: readonly NoraGraphQLFiltroConsultaAtivo[]): number {
    return new Set(filtros.map(filtro => filtro.campo)).size;
};

function obtemRegistrosOriginais(valor: ContextoFiltrosConsultaValor<object>): readonly object[] {
    if (!('registrosOriginais' in valor)) return [];

    const valorComRegistros = valor as ContextoFiltrosConsultaValorComRegistros;

    return valorComRegistros.registrosOriginais ?? [];
};

function obtemOpcoesConsultaCampo(opcoesPorCampo: readonly GraphqlOpcoesFiltroConsultaCampo[] | undefined, campo: string): readonly GraphqlOpcaoFiltroConsulta[] | undefined {
    return opcoesPorCampo?.find(opcoesCampo => opcoesCampo.campo === campo)?.opcoes;
};

function campoUsaBoolean(campo: GraphqlFiltroConsultaCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.BOOLEAN;
};

function campoUsaMultiSelect(campo: GraphqlFiltroConsultaCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.MULTISELECT;
};

function campoUsaDataRange(campo: GraphqlFiltroConsultaCampoDef<object>): boolean {
    if (campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.DATA_RANGE) return true;

    return !campo.controleVisualizacao && campo.tipo === GraphqlFiltroCampoTipo.DATE;
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

    if (campos.length === 0) return null;

    return (
        <section className={resolveClasseFiltros(variante)} aria-label={titulo}>
            <div className={styles.barra_filtros}>
                <div className={styles.trilho_filtros}>
                    {campos.map(campo => campoUsaBoolean(campo) ? (
                        <CampoFiltroBooleano key={campo.campo} campo={campo} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ) : campoUsaMultiSelect(campo) ? (
                        <CampoFiltroMultiSelect key={campo.campo} campo={campo} registros={registrosOriginais} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} opcoesExternas={obtemOpcoesConsultaCampo(opcoesPorCampo, campo.campo)} />
                    ) : campoUsaDataRange(campo) ? (
                        <CampoFiltroDataRange key={campo.campo} campo={campo} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ) : (
                        <CampoFiltroValorUnico key={campo.campo} campo={campo} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ))}
                </div>
                <div className={styles.acoes_filtros_fixas}>
                    <span className={styles.resumo_filtros}>{possuiAlteracaoPendente ? 'Busca pendente' : totalCamposAplicados > 0 ? `${totalCamposAplicados} aplicado(s)` : 'Sem busca ativa'}</span>
                    <button type="button" onClick={aplicaFiltros} disabled={!possuiAlteracaoPendente} className={styles.botao_principal_filtro}>Buscar</button>
                    {(totalCamposFiltro > 0 || totalCamposAplicados > 0) && <button type="button" onClick={limpaFiltros} className={styles.botao_secundario_filtro}>Limpar</button>}
                </div>
            </div>
        </section>
    );
};

export default function FiltrosConsulta(props: FiltrosConsultaProps) {
    const titulo = props.titulo ?? 'Buscar registros';
    const variante = props.variante ?? 'consulta';

    if (props.valor) return <FiltrosConsultaInterno valor={props.valor} titulo={titulo} variante={variante} />;

    return <FiltrosConsultaComContexto titulo={titulo} variante={variante} />;
};