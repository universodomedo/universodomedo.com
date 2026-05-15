'use client';

import { ComponentProps, ReactNode } from 'react';
import { GraphqlFiltroCampoTipo, GraphqlFiltroControleVisualizacao, type GraphqlOpcaoFiltroConsulta, type GraphqlOpcoesFiltroConsultaCampo } from 'types-nora-api';

import styles from '../FiltrosVisualizacao/styles.module.css';

import CampoFiltroBooleano from 'Componentes/Filtros/CamposFiltro/Booleano/Booleano';
import CampoFiltroDataRange from 'Componentes/Filtros/CamposFiltro/DataRange/DataRange';
import CampoFiltroMultiSelect from 'Componentes/Filtros/CamposFiltro/MultiSelect/MultiSelect';
import CampoFiltroValorUnico from 'Componentes/Filtros/CamposFiltro/ValorUnico/ValorUnico';

export type FiltrosGraphQLVariante = 'consulta' | 'visualizacao';

export type FiltrosGraphQLModo = 'consulta' | 'visualizacao';

export type FiltrosGraphQLCampo = ComponentProps<typeof CampoFiltroMultiSelect>['campo'];

export type FiltrosGraphQLFiltros = ComponentProps<typeof CampoFiltroMultiSelect>['filtros'];

export type FiltrosGraphQLSetFiltros = ComponentProps<typeof CampoFiltroMultiSelect>['setFiltros'];

export type FiltrosGraphQLProps = {
    readonly campos: readonly FiltrosGraphQLCampo[];
    readonly filtros: FiltrosGraphQLFiltros;
    readonly setFiltros: FiltrosGraphQLSetFiltros;
    readonly registrosOriginais: readonly object[];
    readonly titulo: string;
    readonly variante: FiltrosGraphQLVariante;
    readonly modo: FiltrosGraphQLModo;
    readonly opcoesPorCampo?: readonly GraphqlOpcoesFiltroConsultaCampo[];
    readonly acoes?: ReactNode;
};

const LABEL_PARTES_CAMPO: Record<string, string> = {
    id: 'ID',
    dataCriacao: 'Data Criação',
    dataPrevisaoInicio: 'Data Prevista',
    dataInicio: 'Data Início',
    duracaoEmSegundos: 'Duração',
    detalheData: 'Data',
    tipoPorExtenso: 'Tipo',
    usuarioMestre: 'Mestre',
    username: 'Username',
    nome: 'Nome',
    email: 'E-mail',
    usuario: 'Usuário',
    dadosArteCapa: 'Arte de Capa',
    caminhoArquivoArteCapa: 'Caminho da Arte',
    nomeGeralArquivo: 'Nome do arquivo',
    tipoArquivoNome: 'Tipo de arquivo',
    usuarioAdicionouUsername: 'Usuário',
    tipoPersonagem: 'Tipo',
    possuiAvatarPendente: 'Possui Avatar Pendente',
};

const CAMPOS_MULTISELECT_LEGADO = new Set<string>([
    'tipoArquivoNome',
    'usuarioAdicionouUsername',
    'tipoArquivo.nome',
    'usuarioAdicionou.username',
]);

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

function humanizaLabelCampo(campo: FiltrosGraphQLCampo): string {
    if (campo.label && campo.label !== campo.campo) return campo.label;

    return campo.path.map(humanizaParteCampo).join(' / ');
};

function resolveClasseFiltros(variante: FiltrosGraphQLVariante): string {
    if (variante === 'consulta') return `${styles.filtros} ${styles.filtros_consulta}`;

    return `${styles.filtros} ${styles.filtros_visualizacao}`;
};

function campoPossuiControleMultiselect(campo: FiltrosGraphQLCampo): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.MULTISELECT;
};

function campoPossuiControleDataRange(campo: FiltrosGraphQLCampo): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.DATA_RANGE;
};

function campoPossuiControleValorUnico(campo: FiltrosGraphQLCampo): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.VALOR_UNICO;
};

function campoPossuiControleTexto(campo: FiltrosGraphQLCampo): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.TEXTO;
};

function campoUsaBoolean(campo: FiltrosGraphQLCampo): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.BOOLEAN;
};

function campoEstaNoLegadoMultiselect(campo: FiltrosGraphQLCampo): boolean {
    if (CAMPOS_MULTISELECT_LEGADO.has(campo.campo)) return true;

    return CAMPOS_MULTISELECT_LEGADO.has(campo.path.join('.'));
};

function campoUsaDataRange(campo: FiltrosGraphQLCampo): boolean {
    if (campoPossuiControleDataRange(campo)) return true;
    if (campoUsaBoolean(campo)) return false;
    if (campoPossuiControleMultiselect(campo)) return false;
    if (campoPossuiControleValorUnico(campo)) return false;
    if (campoPossuiControleTexto(campo)) return false;

    return campo.tipo === GraphqlFiltroCampoTipo.DATE;
};

function campoUsaMultiSelect(campo: FiltrosGraphQLCampo, modo: FiltrosGraphQLModo): boolean {
    if (campoPossuiControleMultiselect(campo)) return true;
    if (campoUsaBoolean(campo)) return false;
    if (campoPossuiControleDataRange(campo)) return false;
    if (campoPossuiControleValorUnico(campo)) return false;
    if (campoPossuiControleTexto(campo)) return false;
    if (modo === 'consulta') return false;

    return campoEstaNoLegadoMultiselect(campo);
};

function obtemOpcoesConsultaCampo(opcoesPorCampo: readonly GraphqlOpcoesFiltroConsultaCampo[] | undefined, campo: string): readonly GraphqlOpcaoFiltroConsulta[] | undefined {
    return opcoesPorCampo?.find(opcoesCampo => opcoesCampo.campo === campo)?.opcoes;
};

function obtemRegistrosBooleano(props: FiltrosGraphQLProps): readonly object[] | undefined {
    if (props.modo !== 'visualizacao') return undefined;

    return props.registrosOriginais;
};

export function contaCamposComFiltro(filtros: FiltrosGraphQLFiltros): number {
    return new Set(filtros.map(filtro => filtro.campo)).size;
};

export default function FiltrosGraphQL(props: FiltrosGraphQLProps) {
    if (props.campos.length === 0) return null;

    return (
        <section className={resolveClasseFiltros(props.variante)} aria-label={props.titulo}>
            <div className={styles.barra_filtros}>
                <div className={styles.trilho_filtros}>
                    {props.campos.map(campo => campoUsaBoolean(campo) ? (
                        <CampoFiltroBooleano key={campo.campo} campo={campo} filtros={props.filtros} setFiltros={props.setFiltros} label={humanizaLabelCampo(campo)} registros={obtemRegistrosBooleano(props)} />
                    ) : campoUsaMultiSelect(campo, props.modo) ? (
                        <CampoFiltroMultiSelect key={campo.campo} campo={campo} registros={props.registrosOriginais} filtros={props.filtros} setFiltros={props.setFiltros} label={humanizaLabelCampo(campo)} opcoesExternas={obtemOpcoesConsultaCampo(props.opcoesPorCampo, campo.campo)} />
                    ) : campoUsaDataRange(campo) ? (
                        <CampoFiltroDataRange key={campo.campo} campo={campo} filtros={props.filtros} setFiltros={props.setFiltros} label={humanizaLabelCampo(campo)} />
                    ) : (
                        <CampoFiltroValorUnico key={campo.campo} campo={campo} filtros={props.filtros} setFiltros={props.setFiltros} label={humanizaLabelCampo(campo)} />
                    ))}
                </div>
                {props.acoes && (
                    <div className={styles.acoes_filtros_fixas}>
                        {props.acoes}
                    </div>
                )}
            </div>
        </section>
    );
};