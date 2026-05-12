'use client';

import { ReactNode } from 'react';
import { GraphqlFiltroCampoTipo, GraphqlFiltroControleVisualizacao, GraphqlFiltroVisualizacaoCampoDef } from 'types-nora-api';

import styles from './styles.module.css';

import CampoFiltroDataRange from 'Componentes/Filtros/CamposFiltro/DataRange/DataRange';
import CampoFiltroMultiSelect from 'Componentes/Filtros/CamposFiltro/MultiSelect/MultiSelect';
import CampoFiltroValorUnico from 'Componentes/Filtros/CamposFiltro/ValorUnico/ValorUnico';
import { ContextoFiltrosVisualizacaoValor, useContextoFiltrosVisualizacao } from '@/contextos/Contexto__Filtros/contexto';
import { NoraGraphQLFiltroVisualizacaoAtivo } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

export type FiltrosVisualizacaoVariante = 'consulta' | 'visualizacao';

export type FiltrosVisualizacaoProps = {
    readonly valor?: ContextoFiltrosVisualizacaoValor<object>;
    readonly titulo?: string;
    readonly variante?: FiltrosVisualizacaoVariante;
    readonly contador?: ReactNode;
};

const LABEL_PARTES_CAMPO: Record<string, string> = {
    id: 'ID',
    dataCriacao: 'Data Criação',
    detalheData: 'Data',
    tipoPorExtenso: 'Tipo',
    usuarioMestre: 'Mestre',
    username: 'Username',
    nome: 'Nome',
    email: 'E-mail',
    dadosArteCapa: 'Arte de Capa',
    caminhoArquivoArteCapa: 'Caminho da Arte',
    nomeGeralArquivo: 'Nome do arquivo',
    tipoArquivoNome: 'Tipo de arquivo',
    usuarioAdicionouUsername: 'Usuário',
    tipoPersonagem: 'Tipo',
};

const CAMPOS_MULTISELECT = new Set<string>([
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

function humanizaLabelCampo(campo: GraphqlFiltroVisualizacaoCampoDef<object>): string {
    if (campo.label && campo.label !== campo.campo) return campo.label;

    return campo.path.map(humanizaParteCampo).join(' / ');
};

function resolveClasseFiltros(variante: FiltrosVisualizacaoVariante): string {
    if (variante === 'consulta') return `${styles.filtros} ${styles.filtros_consulta}`;

    return `${styles.filtros} ${styles.filtros_visualizacao}`;
};

function contaCamposComFiltro(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]): number {
    return new Set(filtros.map(filtro => filtro.campo)).size;
};

function campoPossuiControleMultiselect(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.MULTISELECT;
};

function campoPossuiControleDataRange(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.DATA_RANGE;
};

function campoPossuiControleValorUnico(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.VALOR_UNICO;
};

function campoPossuiControleTexto(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    return campo.controleVisualizacao === GraphqlFiltroControleVisualizacao.TEXTO;
};

function campoEstaNoLegadoMultiselect(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    if (CAMPOS_MULTISELECT.has(campo.campo)) return true;

    return CAMPOS_MULTISELECT.has(campo.path.join('.'));
};

function campoEhDataRange(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    if (campoPossuiControleDataRange(campo)) return true;
    if (campoPossuiControleMultiselect(campo)) return false;
    if (campoPossuiControleValorUnico(campo)) return false;
    if (campoPossuiControleTexto(campo)) return false;

    return campo.tipo === GraphqlFiltroCampoTipo.DATE;
};

function campoEhMultiselect(campo: GraphqlFiltroVisualizacaoCampoDef<object>): boolean {
    if (campoPossuiControleMultiselect(campo)) return true;
    if (campoPossuiControleDataRange(campo)) return false;
    if (campoPossuiControleValorUnico(campo)) return false;
    if (campoPossuiControleTexto(campo)) return false;

    return campoEstaNoLegadoMultiselect(campo);
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

    if (campos.length === 0) return null;

    return (
        <section className={resolveClasseFiltros(variante)} aria-label={titulo}>
            <div className={styles.barra_filtros}>
                <div className={styles.trilho_filtros}>
                    {campos.map(campo => campoEhDataRange(campo) ? (
                        <CampoFiltroDataRange key={campo.campo} campo={campo} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ) : campoEhMultiselect(campo) ? (
                        <CampoFiltroMultiSelect key={campo.campo} campo={campo} registros={registrosOriginais} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ) : (
                        <CampoFiltroValorUnico key={campo.campo} campo={campo} filtros={filtros} setFiltros={setFiltros} label={humanizaLabelCampo(campo)} />
                    ))}
                </div>
                <div className={styles.acoes_filtros_fixas}>
                    <span className={styles.resumo_filtros}>{contador ?? (totalCamposFiltro > 0 ? `${totalCamposFiltro} ativo(s)` : 'Sem refinamento')}</span>
                    {totalCamposFiltro > 0 && <button type="button" onClick={limpaFiltros} className={styles.botao_secundario_filtro}>Limpar</button>}
                </div>
            </div>
        </section>
    );
};

export default function FiltrosVisualizacao(props: FiltrosVisualizacaoProps) {
    const titulo = props.titulo ?? 'Refinar esta lista';
    const variante = props.variante ?? 'visualizacao';

    if (props.valor) return <FiltrosVisualizacaoInterno valor={props.valor} titulo={titulo} variante={variante} contador={props.contador} />;

    return <FiltrosVisualizacaoComContexto titulo={titulo} variante={variante} contador={props.contador} />;
};