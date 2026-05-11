'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { GraphqlFiltroCampoDef, GraphqlFiltroOperador } from 'types-nora-api';

import { NoraGraphQLFiltroVisualizacaoAtivo, NoraGraphQLFiltroVisualizacaoValor } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type DiaCalendario = {
    readonly iso: string | null;
    readonly diaMes: number | null;
};

type PosicaoCalendario = {
    readonly top: number;
    readonly left: number;
};

type CampoFiltroDataRangeProps = {
    readonly campo: GraphqlFiltroCampoDef<object>;
    readonly filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
    readonly setFiltros: (filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]) => void;
    readonly label: string;
};

function criaIdFiltroData(campo: string, operador: GraphqlFiltroOperador, valor: NoraGraphQLFiltroVisualizacaoValor): string {
    return `${campo}-${operador}-${String(valor)}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function normalizaNumeroData(valor: number): string {
    return String(valor).padStart(2, '0');
};

function formataDataIso(data: Date): string {
    return `${data.getFullYear()}-${normalizaNumeroData(data.getMonth() + 1)}-${normalizaNumeroData(data.getDate())}`;
};

function normalizaDataIso(valor: NoraGraphQLFiltroVisualizacaoValor): string | null {
    if (Array.isArray(valor)) return null;
    if (valor === null) return null;
    if (valor instanceof Date) return formataDataIso(valor);
    if (typeof valor !== 'string') return null;

    const partes = valor.trim().split('T')[0].split('-');
    if (partes.length !== 3) return null;

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    if (!Number.isFinite(ano) || !Number.isFinite(mes) || !Number.isFinite(dia)) return null;
    if (ano < 1 || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;

    return `${String(ano).padStart(4, '0')}-${normalizaNumeroData(mes)}-${normalizaNumeroData(dia)}`;
};

function criaDataLocal(dataIso: string): Date {
    const partes = dataIso.split('-');
    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    return new Date(ano, mes - 1, dia);
};

function adicionaDiasIso(dataIso: string, dias: number): string {
    const data = criaDataLocal(dataIso);
    data.setDate(data.getDate() + dias);

    return formataDataIso(data);
};

function formataDataHumana(dataIso: string | null): string {
    if (!dataIso) return '';
    const partes = dataIso.split('-');

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

function capitalizaPrimeiraLetra(texto: string): string {
    if (texto.length === 0) return texto;

    return `${texto[0].toUpperCase()}${texto.slice(1)}`;
};

function obtemNomeMes(dataIso: string): string {
    return capitalizaPrimeiraLetra(criaDataLocal(dataIso).toLocaleDateString('pt-BR', { month: 'long' }));
};

function obtemNomeMesAnoPorIso(dataIso: string): string {
    return capitalizaPrimeiraLetra(criaDataLocal(dataIso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
};

function obtemAnoIso(dataIso: string): string {
    return dataIso.split('-')[0];
};

function obtemMesIso(dataIso: string): string {
    return dataIso.split('-')[1];
};

function resolveResumoIntervalo(dataInicio: string | null, dataFim: string | null): string {
    if (!dataInicio && !dataFim) return 'Selecionar período';
    if (dataInicio && !dataFim) return `Desde ${formataDataHumana(dataInicio)}`;
    if (!dataInicio && dataFim) return `Até ${formataDataHumana(dataFim)}`;

    if (!dataInicio || !dataFim) return 'Selecionar período';
    if (dataInicio === dataFim) return formataDataHumana(dataInicio);

    const mesmoAno = obtemAnoIso(dataInicio) === obtemAnoIso(dataFim);
    const mesmoMes = mesmoAno && obtemMesIso(dataInicio) === obtemMesIso(dataFim);

    if (mesmoMes) return `${dataInicio.split('-')[2]} - ${dataFim.split('-')[2]} ${obtemNomeMesAnoPorIso(dataInicio)}`;
    if (mesmoAno) return `${obtemNomeMes(dataInicio)} - ${obtemNomeMesAnoPorIso(dataFim)}`;

    return `${obtemNomeMesAnoPorIso(dataInicio)} - ${obtemNomeMesAnoPorIso(dataFim)}`;
};

function removeFiltrosCampo(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): readonly NoraGraphQLFiltroVisualizacaoAtivo[] {
    return filtros.filter(filtro => filtro.campo !== campo);
};

function obtemDataInicialFiltro(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): string | null {
    const filtroMaiorOuIgual = filtros.find(filtro => filtro.campo === campo && filtro.operador === GraphqlFiltroOperador.MAIOR_OU_IGUAL);
    const filtroMaiorQue = filtros.find(filtro => filtro.campo === campo && filtro.operador === GraphqlFiltroOperador.MAIOR_QUE);
    const dataMaiorOuIgual = filtroMaiorOuIgual ? normalizaDataIso(filtroMaiorOuIgual.valor) : null;
    const dataMaiorQue = filtroMaiorQue ? normalizaDataIso(filtroMaiorQue.valor) : null;

    if (dataMaiorOuIgual) return dataMaiorOuIgual;
    if (dataMaiorQue) return adicionaDiasIso(dataMaiorQue, 1);

    return null;
};

function obtemDataFinalFiltro(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): string | null {
    const filtroMenorQue = filtros.find(filtro => filtro.campo === campo && filtro.operador === GraphqlFiltroOperador.MENOR_QUE);
    const filtroMenorOuIgual = filtros.find(filtro => filtro.campo === campo && filtro.operador === GraphqlFiltroOperador.MENOR_OU_IGUAL);
    const dataMenorQue = filtroMenorQue ? normalizaDataIso(filtroMenorQue.valor) : null;
    const dataMenorOuIgual = filtroMenorOuIgual ? normalizaDataIso(filtroMenorOuIgual.valor) : null;

    if (dataMenorOuIgual) return dataMenorOuIgual;
    if (dataMenorQue) return adicionaDiasIso(dataMenorQue, -1);

    return null;
};

function ordenaIntervaloDatas(dataInicio: string | null, dataFim: string | null): { readonly dataInicio: string | null; readonly dataFim: string | null; } {
    if (!dataInicio || !dataFim) return { dataInicio, dataFim };
    if (dataInicio <= dataFim) return { dataInicio, dataFim };

    return { dataInicio: dataFim, dataFim: dataInicio };
};

function montaFiltrosIntervaloData(campo: string, dataInicio: string | null, dataFim: string | null): readonly NoraGraphQLFiltroVisualizacaoAtivo[] {
    const filtros: NoraGraphQLFiltroVisualizacaoAtivo[] = [];

    if (dataInicio) filtros.push({ id: criaIdFiltroData(campo, GraphqlFiltroOperador.MAIOR_OU_IGUAL, dataInicio), campo, operador: GraphqlFiltroOperador.MAIOR_OU_IGUAL, valor: dataInicio });
    if (dataFim) filtros.push({ id: criaIdFiltroData(campo, GraphqlFiltroOperador.MENOR_QUE, adicionaDiasIso(dataFim, 1)), campo, operador: GraphqlFiltroOperador.MENOR_QUE, valor: adicionaDiasIso(dataFim, 1) });

    return filtros;
};

function criaDiasCalendario(mesVisualizado: Date): readonly DiaCalendario[] {
    const ano = mesVisualizado.getFullYear();
    const mes = mesVisualizado.getMonth();
    const primeiroDiaMes = new Date(ano, mes, 1);
    const ultimoDiaMes = new Date(ano, mes + 1, 0);
    const dias: DiaCalendario[] = [];

    for (let indice = 0; indice < primeiroDiaMes.getDay(); indice++) dias.push({ iso: null, diaMes: null });
    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) dias.push({ iso: formataDataIso(new Date(ano, mes, dia)), diaMes: dia });
    while (dias.length % 7 !== 0) dias.push({ iso: null, diaMes: null });

    return dias;
};

function resolveStatusIntervalo(dataInicio: string | null, dataFim: string | null): string {
    if (dataInicio && dataFim) return `${formataDataHumana(dataInicio)} até ${formataDataHumana(dataFim)}`;
    if (dataInicio) return `A partir de ${formataDataHumana(dataInicio)}`;
    if (dataFim) return `Até ${formataDataHumana(dataFim)}`;

    return 'Sem período definido';
};

function resolveClasseDia(params: { readonly iso: string | null; readonly dataInicio: string | null; readonly dataFim: string | null; readonly hoje: string; }): string {
    const classes = [styles.dia_calendario];

    if (!params.iso) {
        classes.push(styles.dia_calendario_vazio);
        return classes.join(' ');
    }

    if (params.iso === params.hoje) classes.push(styles.dia_calendario_hoje);
    if (params.dataInicio && params.iso === params.dataInicio) classes.push(styles.dia_calendario_inicio);
    if (params.dataFim && params.iso === params.dataFim) classes.push(styles.dia_calendario_fim);
    if (params.dataInicio && params.dataFim && params.iso > params.dataInicio && params.iso < params.dataFim) classes.push(styles.dia_calendario_intervalo);

    return classes.join(' ');
};

function obtemNomeMesAno(data: Date): string {
    return capitalizaPrimeiraLetra(data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
};

function criaMesVisualizadoInicial(dataInicio: string | null, dataFim: string | null): Date {
    const dataBase = dataInicio ?? dataFim;

    if (dataBase) return criaDataLocal(dataBase);

    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
};

function montaEstiloPopover(posicao: PosicaoCalendario | null): CSSProperties {
    if (!posicao) return {};

    return {
        top: posicao.top,
        left: posicao.left,
    };
};

export default function CampoFiltroDataRange({ campo, filtros, setFiltros, label }: CampoFiltroDataRangeProps) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const dataInicio = useMemo(() => obtemDataInicialFiltro(filtros, campo.campo), [campo.campo, filtros]);
    const dataFim = useMemo(() => obtemDataFinalFiltro(filtros, campo.campo), [campo.campo, filtros]);
    const [calendarioAberto, setCalendarioAberto] = useState(false);
    const [posicaoCalendario, setPosicaoCalendario] = useState<PosicaoCalendario | null>(null);
    const [mesVisualizado, setMesVisualizado] = useState(() => criaMesVisualizadoInicial(dataInicio, dataFim));
    const diasCalendario = useMemo(() => criaDiasCalendario(mesVisualizado), [mesVisualizado]);
    const hoje = useMemo(() => formataDataIso(new Date()), []);
    const resumoIntervalo = resolveResumoIntervalo(dataInicio, dataFim);
    const statusIntervalo = resolveStatusIntervalo(dataInicio, dataFim);

    useEffect(() => {
        const dataBase = dataInicio ?? dataFim;
        if (!dataBase) return;

        const data = criaDataLocal(dataBase);
        setMesVisualizado(new Date(data.getFullYear(), data.getMonth(), 1));
    }, [dataInicio, dataFim]);

    useEffect(() => {
        if (!calendarioAberto) return;

        function atualizaPosicaoCalendario() {
            const trigger = triggerRef.current;
            if (!trigger) return;

            const margem = 12;
            const espacamento = 8;
            const rect = trigger.getBoundingClientRect();
            const larguraPopover = popoverRef.current?.getBoundingClientRect().width ?? 328;
            const alturaPopover = popoverRef.current?.getBoundingClientRect().height ?? 420;
            const leftMaximo = window.innerWidth - larguraPopover - margem;
            const topAbaixo = rect.bottom + espacamento;
            const topAcima = rect.top - alturaPopover - espacamento;
            const left = Math.max(margem, Math.min(rect.left, leftMaximo));
            const top = topAbaixo + alturaPopover > window.innerHeight - margem ? Math.max(margem, topAcima) : topAbaixo;

            setPosicaoCalendario({ top, left });
        };

        function fechaAoClicarFora(event: PointerEvent) {
            const alvo = event.target;
            if (!(alvo instanceof Node)) return;
            if (triggerRef.current?.contains(alvo)) return;
            if (popoverRef.current?.contains(alvo)) return;

            setCalendarioAberto(false);
        };

        function fechaComEsc(event: KeyboardEvent) {
            if (event.key === 'Escape') setCalendarioAberto(false);
        };

        const rafId = window.requestAnimationFrame(atualizaPosicaoCalendario);

        window.addEventListener('resize', atualizaPosicaoCalendario);
        window.addEventListener('scroll', atualizaPosicaoCalendario, true);
        document.addEventListener('pointerdown', fechaAoClicarFora);
        document.addEventListener('keydown', fechaComEsc);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener('resize', atualizaPosicaoCalendario);
            window.removeEventListener('scroll', atualizaPosicaoCalendario, true);
            document.removeEventListener('pointerdown', fechaAoClicarFora);
            document.removeEventListener('keydown', fechaComEsc);
        };
    }, [calendarioAberto]);

    function aplicaIntervalo(dataInicioNovo: string | null, dataFimNovo: string | null) {
        const intervalo = ordenaIntervaloDatas(dataInicioNovo, dataFimNovo);
        const filtrosSemCampo = removeFiltrosCampo(filtros, campo.campo);
        const filtrosIntervalo = montaFiltrosIntervaloData(campo.campo, intervalo.dataInicio, intervalo.dataFim);

        setFiltros([...filtrosSemCampo, ...filtrosIntervalo]);
    };

    function selecionaDiaCalendario(dataIso: string) {
        if (!dataInicio || dataFim) {
            aplicaIntervalo(dataIso, null);
            return;
        }

        aplicaIntervalo(dataInicio, dataIso);
        setCalendarioAberto(false);
    };

    function alteraDataInicio(valor: string) {
        const dataIso = valor.trim().length > 0 ? valor : null;
        aplicaIntervalo(dataIso, dataFim);
    };

    function alteraDataFim(valor: string) {
        const dataIso = valor.trim().length > 0 ? valor : null;
        aplicaIntervalo(dataInicio, dataIso);
    };

    function mudaMes(delta: number) {
        setMesVisualizado(dataAtual => new Date(dataAtual.getFullYear(), dataAtual.getMonth() + delta, 1));
    };

    function limpaIntervalo() {
        setFiltros(removeFiltrosCampo(filtros, campo.campo));
        setCalendarioAberto(false);
    };

    return (
        <article className={styles.campo_filtro}>
            <button ref={triggerRef} type="button" onClick={() => setCalendarioAberto(valorAtual => !valorAtual)} className={styles.botao_resumo_data} title={statusIntervalo}>
                <span className={styles.campo_filtro_textos}>
                    <strong className={styles.campo_filtro_label}>{label}</strong>
                    <span className={styles.campo_filtro_status}>{resumoIntervalo}</span>
                </span>
            </button>
            {(dataInicio || dataFim) && (
                <button type="button" onClick={limpaIntervalo} className={styles.botao_limpar_campo} aria-label={`Limpar filtro ${label}`}>×</button>
            )}
            {calendarioAberto && (
                <div ref={popoverRef} className={styles.popover_calendario} style={montaEstiloPopover(posicaoCalendario)}>
                    <div className={styles.cabecalho_calendario}>
                        <button type="button" onClick={() => mudaMes(-1)} className={styles.botao_mes}>‹</button>
                        <strong>{obtemNomeMesAno(mesVisualizado)}</strong>
                        <button type="button" onClick={() => mudaMes(1)} className={styles.botao_mes}>›</button>
                    </div>
                    <div className={styles.grade_calendario}>
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((diaSemana, indice) => <span key={`${diaSemana}-${indice}`} className={styles.dia_semana}>{diaSemana}</span>)}
                        {diasCalendario.map((dia, indice) => dia.iso ? (
                            <button key={dia.iso} type="button" onClick={() => selecionaDiaCalendario(dia.iso!)} className={resolveClasseDia({ iso: dia.iso, dataInicio, dataFim, hoje })}>{dia.diaMes}</button>
                        ) : (
                            <span key={`vazio-${indice}`} className={resolveClasseDia({ iso: null, dataInicio, dataFim, hoje })} />
                        ))}
                    </div>
                    <div className={styles.controles_datas_popover}>
                        <label className={styles.grupo_data_input}>
                            <span>Início</span>
                            <input type="date" value={dataInicio ?? ''} onChange={event => alteraDataInicio(event.target.value)} className={styles.input_data} />
                        </label>
                        <label className={styles.grupo_data_input}>
                            <span>Fim</span>
                            <input type="date" value={dataFim ?? ''} onChange={event => alteraDataFim(event.target.value)} className={styles.input_data} />
                        </label>
                    </div>
                    <div className={styles.rodape_calendario}>
                        <span>{dataInicio && !dataFim ? 'Escolha a data final para fechar o período.' : 'Selecione início e fim do período.'}</span>
                        <button type="button" onClick={() => setCalendarioAberto(false)} className={styles.botao_fechar_calendario}>Fechar</button>
                    </div>
                </div>
            )}
        </article>
    );
};