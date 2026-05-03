'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { GraphqlFiltroCampoTipo, GraphqlFiltroConsultaCampoDef, GraphqlFiltroOperador } from 'types-nora-api';

import styles from '../FiltrosVisualizacao/styles.module.css';

import { ContextoFiltrosConsultaValor, useContextoFiltrosConsulta } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import { NoraGraphQLFiltroConsultaAtivo, NoraGraphQLFiltroConsultaValor } from 'Hooks/useNoraGraphQLFiltroConsulta';

export type FiltrosConsultaProps = {
    readonly valor?: ContextoFiltrosConsultaValor<object>;
};

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

const LABEL_PARTES_CAMPO: Record<string, string> = {
    id: 'ID',
    dataCriacao: 'Data Criação',
    dataPrevisaoInicio: 'Data Prevista',
    dataInicio: 'Data Início',
    duracaoEmSegundos: 'Duração',
};

function criaIdFiltroConsulta(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function campoAceitaValor(operador: GraphqlFiltroOperador): boolean {
    return operador !== GraphqlFiltroOperador.ESTA_NULO;
};

function obtemTipoInput(campo: GraphqlFiltroConsultaCampoDef<object> | undefined): string {
    if (!campo) return 'text';
    if (campo.tipo === GraphqlFiltroCampoTipo.NUMBER) return 'number';
    if (campo.tipo === GraphqlFiltroCampoTipo.DATE) return 'date';

    return 'text';
};

function resolveValorFiltro(campo: GraphqlFiltroConsultaCampoDef<object>, operador: GraphqlFiltroOperador, valorTexto: string): NoraGraphQLFiltroConsultaValor | null {
    const valorTextoTratado = valorTexto.trim();

    if (!campoAceitaValor(operador)) return null;
    if (campo.tipo === GraphqlFiltroCampoTipo.STRING) return valorTextoTratado;
    if (campo.tipo === GraphqlFiltroCampoTipo.DATE) return valorTextoTratado;

    if (campo.tipo === GraphqlFiltroCampoTipo.NUMBER) {
        const numero = Number(valorTextoTratado);
        return Number.isFinite(numero) ? numero : null;
    }

    if (campo.tipo === GraphqlFiltroCampoTipo.BOOLEAN) return valorTextoTratado === 'true';

    return valorTextoTratado;
};

function formataValorFiltro(valor: NoraGraphQLFiltroConsultaValor): string {
    if (valor === null) return '';
    if (valor instanceof Date) return valor.toLocaleDateString('pt-BR');
    if (typeof valor === 'boolean') return valor ? 'sim' : 'não';

    return String(valor);
};

function normalizaValorFiltroParaComparacao(valor: NoraGraphQLFiltroConsultaValor): string {
    if (valor === null) return 'null';
    if (valor instanceof Date) return valor.toISOString();

    return String(valor).trim().toLowerCase();
};

function filtroJaExiste(filtros: readonly NoraGraphQLFiltroConsultaAtivo[], campo: string, operador: GraphqlFiltroOperador, valor: NoraGraphQLFiltroConsultaValor): boolean {
    return filtros.some(filtro => filtro.campo === campo && filtro.operador === operador && normalizaValorFiltroParaComparacao(filtro.valor) === normalizaValorFiltroParaComparacao(valor));
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

function obtemLabelCampo(campos: readonly GraphqlFiltroConsultaCampoDef<object>[], campo: string): string {
    const campoEncontrado = campos.find(campoFiltro => campoFiltro.campo === campo);
    if (!campoEncontrado) return campo;

    return humanizaLabelCampo(campoEncontrado);
};

function FiltrosConsultaComContexto() {
    const valor = useContextoFiltrosConsulta<object>();

    return <FiltrosConsultaInterno valor={valor} />;
};

function FiltrosConsultaInterno({ valor }: { readonly valor: ContextoFiltrosConsultaValor<object>; }) {
    const { campos, filtros, filtrosAplicados, setFiltros, possuiAlteracaoPendente, aplicaFiltros, limpaFiltros } = valor;
    const [campoSelecionado, setCampoSelecionado] = useState<string>(campos[0]?.campo ?? '');
    const campoAtual = useMemo(() => campos.find(campo => campo.campo === campoSelecionado), [campos, campoSelecionado]);
    const [operadorSelecionado, setOperadorSelecionado] = useState<GraphqlFiltroOperador>(campoAtual?.operadores[0] ?? GraphqlFiltroOperador.IGUAL);
    const [valorTexto, setValorTexto] = useState('');

    const valorFiltroAtual = useMemo(() => {
        if (!campoAtual) return null;

        return resolveValorFiltro(campoAtual, operadorSelecionado, valorTexto);
    }, [campoAtual, operadorSelecionado, valorTexto]);

    const podeAdicionarFiltro = useMemo(() => {
        if (!campoAtual) return false;
        if (campoAceitaValor(operadorSelecionado) && valorFiltroAtual === null) return false;
        if (typeof valorFiltroAtual === 'string' && valorFiltroAtual.trim().length === 0) return false;

        return !filtroJaExiste(filtros, campoAtual.campo, operadorSelecionado, valorFiltroAtual);
    }, [campoAtual, filtros, operadorSelecionado, valorFiltroAtual]);

    useEffect(() => {
        if (campos.length === 0) return;
        if (campos.some(campo => campo.campo === campoSelecionado)) return;

        const primeiroCampo = campos[0];

        setCampoSelecionado(primeiroCampo.campo);
        setOperadorSelecionado(primeiroCampo.operadores[0]);
        setValorTexto('');
    }, [campos, campoSelecionado]);

    useEffect(() => {
        if (!campoAtual) return;
        if (campoAtual.operadores.includes(operadorSelecionado)) return;

        setOperadorSelecionado(campoAtual.operadores[0]);
        setValorTexto('');
    }, [campoAtual, operadorSelecionado]);

    useEffect(() => {
        if (campoAceitaValor(operadorSelecionado)) return;

        setValorTexto('');
    }, [operadorSelecionado]);

    function selecionaCampo(campo: string) {
        const novoCampo = campos.find(campoFiltro => campoFiltro.campo === campo);
        if (!novoCampo) return;

        setCampoSelecionado(novoCampo.campo);
        setOperadorSelecionado(novoCampo.operadores[0]);
        setValorTexto('');
    };

    function selecionaOperador(operador: GraphqlFiltroOperador) {
        setOperadorSelecionado(operador);
        setValorTexto('');
    };

    function adicionaFiltro(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault();

        if (!campoAtual) return;
        if (!podeAdicionarFiltro) return;

        setFiltros([...filtros, { id: criaIdFiltroConsulta(), campo: campoAtual.campo, operador: operadorSelecionado, valor: valorFiltroAtual }]);
        setValorTexto('');
    };

    function removeFiltro(id: string) {
        setFiltros(filtros.filter(filtro => filtro.id !== id));
    };

    if (campos.length === 0) return null;

    return (
        <section className={styles.filtros}>
            <div className={styles.cabecalho}>
                <strong>Filtros de consulta</strong>
                <span>{filtrosAplicados.length > 0 ? `${filtrosAplicados.length} aplicado(s)` : 'Nenhum filtro aplicado'}</span>
            </div>
            <form onSubmit={adicionaFiltro} className={styles.formulario}>
                <select value={campoSelecionado} onChange={event => selecionaCampo(event.target.value)} className={styles.campo}>
                    {campos.map(campo => (
                        <option key={campo.campo} value={campo.campo}>{humanizaLabelCampo(campo)}</option>
                    ))}
                </select>
                <select value={operadorSelecionado} onChange={event => selecionaOperador(event.target.value as GraphqlFiltroOperador)} className={styles.operador}>
                    {campoAtual?.operadores.map(operador => (
                        <option key={operador} value={operador}>{LABEL_OPERADOR[operador]}</option>
                    ))}
                </select>
                {campoAtual?.tipo === GraphqlFiltroCampoTipo.BOOLEAN && campoAceitaValor(operadorSelecionado) ? (
                    <select value={valorTexto} onChange={event => setValorTexto(event.target.value)} className={styles.valor}>
                        <option value="">Selecione</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                ) : (
                    <input value={valorTexto} onChange={event => setValorTexto(event.target.value)} disabled={!campoAceitaValor(operadorSelecionado)} type={obtemTipoInput(campoAtual)} className={styles.valor} placeholder={campoAceitaValor(operadorSelecionado) ? 'Valor' : 'Sem valor'} />
                )}
                <button type="submit" disabled={!podeAdicionarFiltro} className={styles.botao}>Adicionar</button>
                <button type="button" onClick={aplicaFiltros} disabled={!possuiAlteracaoPendente} className={styles.botao}>Aplicar</button>
                {(filtros.length > 0 || filtrosAplicados.length > 0) && <button type="button" onClick={limpaFiltros} className={styles.botao_secundario}>Limpar</button>}
            </form>
            {filtros.length > 0 && (
                <div className={styles.filtros_ativos}>
                    {filtros.map((filtro: NoraGraphQLFiltroConsultaAtivo) => (
                        <button key={filtro.id} type="button" onClick={() => removeFiltro(filtro.id)} className={styles.filtro_ativo}>
                            {obtemLabelCampo(campos, filtro.campo)} {LABEL_OPERADOR[filtro.operador]} {campoAceitaValor(filtro.operador) ? formataValorFiltro(filtro.valor) : ''}
                            <span>×</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default function FiltrosConsulta(props: FiltrosConsultaProps) {
    if (props.valor) return <FiltrosConsultaInterno valor={props.valor} />;

    return <FiltrosConsultaComContexto />;
};