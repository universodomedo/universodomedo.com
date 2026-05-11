'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GraphqlFiltroCampoDef, GraphqlFiltroCampoTipo, GraphqlFiltroOperador } from 'types-nora-api';

import { NoraGraphQLFiltroVisualizacaoAtivo, NoraGraphQLFiltroVisualizacaoValor } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type CampoFiltroValorUnicoProps = {
    readonly campo: GraphqlFiltroCampoDef<object>;
    readonly filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
    readonly setFiltros: (filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]) => void;
    readonly label: string;
};

const TEMPO_DEBOUNCE_TEXTO_MS = 450;

const LABEL_OPERADOR: Record<GraphqlFiltroOperador, string> = {
    [GraphqlFiltroOperador.CONTEM]: 'contém',
    [GraphqlFiltroOperador.IGUAL]: 'igual a',
    [GraphqlFiltroOperador.DIFERENTE]: 'diferente de',
    [GraphqlFiltroOperador.MAIOR_QUE]: 'maior que',
    [GraphqlFiltroOperador.MAIOR_OU_IGUAL]: 'maior ou igual a',
    [GraphqlFiltroOperador.MENOR_QUE]: 'menor que',
    [GraphqlFiltroOperador.MENOR_OU_IGUAL]: 'menor ou igual a',
    [GraphqlFiltroOperador.ESTA_NULO]: 'está vazio',
};

function criaIdFiltro(campo: string, operador: GraphqlFiltroOperador, valor: NoraGraphQLFiltroVisualizacaoValor): string {
    return `${campo}-${operador}-${String(valor)}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function campoAceitaValor(operador: GraphqlFiltroOperador): boolean {
    return operador !== GraphqlFiltroOperador.ESTA_NULO;
};

function campoEhTexto(campo: GraphqlFiltroCampoDef<object>): boolean {
    return campo.tipo === GraphqlFiltroCampoTipo.STRING;
};

function obtemOperadorPadrao(campo: GraphqlFiltroCampoDef<object>): GraphqlFiltroOperador {
    if (campo.tipo === GraphqlFiltroCampoTipo.STRING && campo.operadores.includes(GraphqlFiltroOperador.CONTEM)) return GraphqlFiltroOperador.CONTEM;
    if (campo.operadores.includes(GraphqlFiltroOperador.IGUAL)) return GraphqlFiltroOperador.IGUAL;

    return campo.operadores[0];
};

function obtemTipoInput(campo: GraphqlFiltroCampoDef<object>): string {
    if (campo.tipo === GraphqlFiltroCampoTipo.NUMBER) return 'number';
    if (campo.tipo === GraphqlFiltroCampoTipo.DATE) return 'date';

    return 'text';
};

function resolveValorFiltro(campo: GraphqlFiltroCampoDef<object>, operador: GraphqlFiltroOperador, valorTexto: string): NoraGraphQLFiltroVisualizacaoValor | null {
    const valorTextoTratado = valorTexto.trim();

    if (!campoAceitaValor(operador)) return null;
    if (valorTextoTratado.length === 0) return null;
    if (campo.tipo === GraphqlFiltroCampoTipo.STRING) return valorTextoTratado;
    if (campo.tipo === GraphqlFiltroCampoTipo.DATE) return valorTextoTratado;

    if (campo.tipo === GraphqlFiltroCampoTipo.NUMBER) {
        const numero = Number(valorTextoTratado);
        return Number.isFinite(numero) ? numero : null;
    }

    if (campo.tipo === GraphqlFiltroCampoTipo.BOOLEAN) return valorTextoTratado === 'true';

    return valorTextoTratado;
};

function formataValorInput(valor: NoraGraphQLFiltroVisualizacaoValor): string {
    if (Array.isArray(valor)) return valor.map(formataValorInput).join(', ');
    if (valor === null) return '';
    if (valor instanceof Date) return valor.toISOString().slice(0, 10);

    return String(valor);
};

function formataValorHumano(valor: NoraGraphQLFiltroVisualizacaoValor): string {
    if (Array.isArray(valor)) return valor.map(formataValorHumano).join(', ');
    if (valor === null) return '';
    if (valor instanceof Date) return valor.toLocaleDateString('pt-BR');
    if (typeof valor === 'boolean') return valor ? 'sim' : 'não';

    return String(valor);
};

function normalizaValorComparacao(valor: NoraGraphQLFiltroVisualizacaoValor): string {
    if (Array.isArray(valor)) return valor.map(normalizaValorComparacao).sort().join('|');
    if (valor === null) return 'null';
    if (valor instanceof Date) return valor.toISOString();

    return String(valor).trim().toLowerCase();
};

function removeFiltrosCampo(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): readonly NoraGraphQLFiltroVisualizacaoAtivo[] {
    return filtros.filter(filtro => filtro.campo !== campo);
};

function obtemFiltroCampo(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): NoraGraphQLFiltroVisualizacaoAtivo | null {
    return filtros.find(filtro => filtro.campo === campo) ?? null;
};

function filtroPossuiMesmoEstado(filtro: NoraGraphQLFiltroVisualizacaoAtivo | null, operador: GraphqlFiltroOperador, valor: NoraGraphQLFiltroVisualizacaoValor): boolean {
    if (!filtro) return false;
    if (filtro.operador !== operador) return false;

    return normalizaValorComparacao(filtro.valor) === normalizaValorComparacao(valor);
};

function resolveStatusFiltro(filtro: NoraGraphQLFiltroVisualizacaoAtivo | null): string {
    if (!filtro) return 'Sem filtro';
    if (!campoAceitaValor(filtro.operador)) return LABEL_OPERADOR[filtro.operador];

    return `${LABEL_OPERADOR[filtro.operador]} ${formataValorHumano(filtro.valor)}`;
};

export default function CampoFiltroValorUnico({ campo, filtros, setFiltros, label }: CampoFiltroValorUnicoProps) {
    const filtrosRef = useRef(filtros);
    const filtroCampoAtual = useMemo(() => obtemFiltroCampo(filtros, campo.campo), [campo.campo, filtros]);
    const [operadorSelecionado, setOperadorSelecionado] = useState<GraphqlFiltroOperador>(filtroCampoAtual?.operador ?? obtemOperadorPadrao(campo));
    const [valorTexto, setValorTexto] = useState(filtroCampoAtual ? formataValorInput(filtroCampoAtual.valor) : '');

    useEffect(() => {
        filtrosRef.current = filtros;
    }, [filtros]);

    useEffect(() => {
        if (!filtroCampoAtual) {
            setOperadorSelecionado(obtemOperadorPadrao(campo));
            setValorTexto('');
            return;
        }

        setOperadorSelecionado(filtroCampoAtual.operador);
        setValorTexto(formataValorInput(filtroCampoAtual.valor));
    }, [campo, filtroCampoAtual]);

    useEffect(() => {
        if (!campoEhTexto(campo)) return;

        const timeoutId = window.setTimeout(() => atualizaFiltro(operadorSelecionado, valorTexto), TEMPO_DEBOUNCE_TEXTO_MS);

        return () => window.clearTimeout(timeoutId);
    }, [campo, operadorSelecionado, valorTexto]);

    function atualizaFiltro(operador: GraphqlFiltroOperador, texto: string) {
        const filtrosBase = filtrosRef.current;
        const filtroAtual = obtemFiltroCampo(filtrosBase, campo.campo);
        const filtrosSemCampo = removeFiltrosCampo(filtrosBase, campo.campo);

        if (!campoAceitaValor(operador)) {
            if (filtroPossuiMesmoEstado(filtroAtual, operador, null)) return;

            setFiltros([...filtrosSemCampo, { id: criaIdFiltro(campo.campo, operador, null), campo: campo.campo, operador, valor: null }]);
            return;
        }

        const valor = resolveValorFiltro(campo, operador, texto);

        if (valor === null) {
            if (filtrosSemCampo.length === filtrosBase.length) return;

            setFiltros(filtrosSemCampo);
            return;
        }

        if (filtroPossuiMesmoEstado(filtroAtual, operador, valor)) return;

        setFiltros([...filtrosSemCampo, { id: criaIdFiltro(campo.campo, operador, valor), campo: campo.campo, operador, valor }]);
    };

    function selecionaOperador(operador: GraphqlFiltroOperador) {
        setOperadorSelecionado(operador);
        if (!campoAceitaValor(operador)) setValorTexto('');
        atualizaFiltro(operador, campoAceitaValor(operador) ? valorTexto : '');
    };

    function alteraValor(valor: string) {
        setValorTexto(valor);
        if (!campoEhTexto(campo)) atualizaFiltro(operadorSelecionado, valor);
    };

    function limpaCampo() {
        setValorTexto('');
        setFiltros(removeFiltrosCampo(filtrosRef.current, campo.campo));
    };

    if (campoEhTexto(campo)) {
        return (
            <article className={`${styles.campo_filtro} ${styles.campo_filtro_texto}`} aria-label={label}>
                <div className={styles.campo_texto_linha}>
                    <span className={styles.icone_busca} aria-hidden="true">⌕</span>
                    <input value={valorTexto} onChange={event => alteraValor(event.target.value)} type="text" className={styles.input_texto_campo} placeholder={label} aria-label={label} />
                    {filtroCampoAtual && <button type="button" onClick={limpaCampo} className={styles.botao_limpar_texto} title="Limpar filtro">×</button>}
                </div>
            </article>
        );
    }

    return (
        <article className={styles.campo_filtro}>
            <div className={styles.campo_filtro_cabecalho}>
                <strong className={styles.campo_filtro_label}>{label}</strong>
                <span className={styles.campo_filtro_status}>{resolveStatusFiltro(filtroCampoAtual)}</span>
            </div>
            <div className={styles.campo_filtro_controles}>
                <select value={operadorSelecionado} onChange={event => selecionaOperador(event.target.value as GraphqlFiltroOperador)} className={styles.select_operador_campo}>
                    {campo.operadores.map(operador => <option key={operador} value={operador}>{LABEL_OPERADOR[operador]}</option>)}
                </select>
                {campo.tipo === GraphqlFiltroCampoTipo.BOOLEAN && campoAceitaValor(operadorSelecionado) ? (
                    <select value={valorTexto} onChange={event => alteraValor(event.target.value)} className={styles.input_valor_campo}>
                        <option value="">Todos</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                ) : (
                    <input value={valorTexto} onChange={event => alteraValor(event.target.value)} disabled={!campoAceitaValor(operadorSelecionado)} type={obtemTipoInput(campo)} className={styles.input_valor_campo} placeholder={campoAceitaValor(operadorSelecionado) ? 'Filtrar...' : 'Sem valor'} />
                )}
                {filtroCampoAtual && <button type="button" onClick={limpaCampo} className={styles.botao_limpar_campo}>Limpar</button>}
            </div>
        </article>
    );
};