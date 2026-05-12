'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { GraphqlFiltroCampoDef, GraphqlFiltroOperador, pluralize, type GraphqlOpcaoFiltroConsulta } from 'types-nora-api';

import { NoraGraphQLFiltroVisualizacaoAtivo, NoraGraphQLFiltroVisualizacaoValor, NoraGraphQLFiltroVisualizacaoValorEscalar } from 'Hooks/useNoraGraphQLFiltroVisualizacao';

type ValorOpcaoFiltro = Exclude<NoraGraphQLFiltroVisualizacaoValorEscalar, null>;

type ValorOpcaoFiltroExterno = Exclude<GraphqlOpcaoFiltroConsulta['valor'], null>;

type ValorCaminhoFiltro = ValorOpcaoFiltro | null | undefined | ObjetoCaminhoFiltro | readonly ValorCaminhoFiltro[];

type ObjetoCaminhoFiltro = {
    readonly [key: string]: ValorCaminhoFiltro;
};

type PosicaoPopover = {
    readonly top: number;
    readonly left: number;
};

type OpcaoFiltroMultiSelect = {
    readonly chave: string;
    readonly valor: ValorOpcaoFiltro;
    readonly label: string;
    readonly total: number;
};

type CampoFiltroMultiSelectProps = {
    readonly campo: GraphqlFiltroCampoDef<object>;
    readonly registros: readonly object[];
    readonly filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[];
    readonly setFiltros: (filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[]) => void;
    readonly label: string;
    readonly opcoesExternas?: readonly GraphqlOpcaoFiltroConsulta[];
};

function criaIdFiltro(campo: string, valor: NoraGraphQLFiltroVisualizacaoValor): string {
    return `${campo}-${String(valor)}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function valorEhListaCaminhoFiltro(valor: ValorCaminhoFiltro): valor is readonly ValorCaminhoFiltro[] {
    return Array.isArray(valor);
};

function valorEhObjetoCaminhoFiltro(valor: ValorCaminhoFiltro): valor is ObjetoCaminhoFiltro {
    if (valor === null) return false;
    if (valor === undefined) return false;
    if (valor instanceof Date) return false;
    if (valorEhListaCaminhoFiltro(valor)) return false;

    return typeof valor === 'object';
};

function obtemValorPorPath(registro: object, path: readonly string[]): ValorCaminhoFiltro {
    let valorAtual: ValorCaminhoFiltro = registro as ObjetoCaminhoFiltro;

    for (const parte of path) {
        if (!valorEhObjetoCaminhoFiltro(valorAtual)) return undefined;

        valorAtual = valorAtual[parte];
    }

    return valorAtual;
};

function extraiValorOpcao(valor: ValorCaminhoFiltro): ValorOpcaoFiltro | null {
    if (valor === null) return null;
    if (valor === undefined) return null;
    if (valorEhListaCaminhoFiltro(valor)) return null;
    if (valorEhObjetoCaminhoFiltro(valor)) return null;
    if (typeof valor === 'string' && valor.trim().length === 0) return null;

    return valor;
};

function normalizaTextoComparacao(valor: string): string {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

function criaChaveOpcao(valor: ValorOpcaoFiltro): string {
    if (valor instanceof Date) return `date:${valor.toISOString()}`;
    if (typeof valor === 'string') return `string:${normalizaTextoComparacao(valor)}`;
    if (typeof valor === 'number') return `number:${valor}`;
    if (typeof valor === 'boolean') return `boolean:${valor}`;

    return String(valor);
};

function formataValorOpcao(valor: ValorOpcaoFiltro): string {
    if (valor instanceof Date) return valor.toLocaleDateString('pt-BR');
    if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não';

    return String(valor);
};

function criaOpcaoFiltro(valor: ValorOpcaoFiltro): OpcaoFiltroMultiSelect {
    return {
        chave: criaChaveOpcao(valor),
        valor,
        label: formataValorOpcao(valor),
        total: 1,
    };
};

function valorExternoEhValorOpcao(valor: GraphqlOpcaoFiltroConsulta['valor']): valor is ValorOpcaoFiltroExterno {
    return valor !== null;
};

function criaOpcaoFiltroExterna(opcao: GraphqlOpcaoFiltroConsulta): OpcaoFiltroMultiSelect | null {
    if (!valorExternoEhValorOpcao(opcao.valor)) return null;

    return {
        chave: criaChaveOpcao(opcao.valor),
        valor: opcao.valor,
        label: opcao.label,
        total: opcao.total,
    };
};

function montaOpcoesFiltroExternas(opcoesExternas: readonly GraphqlOpcaoFiltroConsulta[]): readonly OpcaoFiltroMultiSelect[] {
    const opcoes: OpcaoFiltroMultiSelect[] = [];

    for (const opcaoExterna of opcoesExternas) {
        const opcao = criaOpcaoFiltroExterna(opcaoExterna);
        if (opcao) opcoes.push(opcao);
    }

    return opcoes.sort((a, b) => a.label.localeCompare(b.label));
};

function montaOpcoesFiltroPorRegistros(registros: readonly object[], campo: GraphqlFiltroCampoDef<object>): readonly OpcaoFiltroMultiSelect[] {
    const mapaOpcoes = new Map<string, OpcaoFiltroMultiSelect>();

    for (const registro of registros) {
        const valor = extraiValorOpcao(obtemValorPorPath(registro, campo.path));
        if (valor === null) continue;

        const chave = criaChaveOpcao(valor);
        const opcaoAtual = mapaOpcoes.get(chave);

        if (opcaoAtual) {
            mapaOpcoes.set(chave, { ...opcaoAtual, total: opcaoAtual.total + 1 });
            continue;
        }

        mapaOpcoes.set(chave, criaOpcaoFiltro(valor));
    }

    return Array.from(mapaOpcoes.values()).sort((a, b) => a.label.localeCompare(b.label));
};

function montaOpcoesFiltro(registros: readonly object[], campo: GraphqlFiltroCampoDef<object>, opcoesExternas: readonly GraphqlOpcaoFiltroConsulta[] | undefined): readonly OpcaoFiltroMultiSelect[] {
    if (opcoesExternas) return montaOpcoesFiltroExternas(opcoesExternas);

    return montaOpcoesFiltroPorRegistros(registros, campo);
};

function removeFiltrosCampo(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): readonly NoraGraphQLFiltroVisualizacaoAtivo[] {
    return filtros.filter(filtro => filtro.campo !== campo);
};

function obtemFiltroCampo(filtros: readonly NoraGraphQLFiltroVisualizacaoAtivo[], campo: string): NoraGraphQLFiltroVisualizacaoAtivo | null {
    return filtros.find(filtro => filtro.campo === campo) ?? null;
};

function valorFiltroEhLista(valor: NoraGraphQLFiltroVisualizacaoValor): valor is readonly ValorOpcaoFiltro[] {
    return Array.isArray(valor);
};

function obtemValoresSelecionados(filtro: NoraGraphQLFiltroVisualizacaoAtivo | null): readonly ValorOpcaoFiltro[] {
    if (!filtro) return [];
    if (valorFiltroEhLista(filtro.valor)) return filtro.valor;
    if (filtro.valor === null) return [];

    return [filtro.valor];
};

function valorSelecionadoPossuiOpcao(valores: readonly ValorOpcaoFiltro[], opcao: OpcaoFiltroMultiSelect): boolean {
    return valores.some(valor => criaChaveOpcao(valor) === opcao.chave);
};

function removeValorSelecionado(valores: readonly ValorOpcaoFiltro[], opcao: OpcaoFiltroMultiSelect): readonly ValorOpcaoFiltro[] {
    return valores.filter(valor => criaChaveOpcao(valor) !== opcao.chave);
};

function resolveResumoSelecionados(totalSelecionado: number, totalOpcoes: number): string {
    if (totalOpcoes === 0) return 'Nenhuma opção';
    if (totalSelecionado === 0) return 'Todos';
    if (totalSelecionado === 1) return '1 selecionado';

    return `${totalSelecionado} selecionados`;
};

function montaEstiloPopover(posicao: PosicaoPopover | null): CSSProperties {
    if (!posicao) return {};

    return {
        top: posicao.top,
        left: posicao.left,
    };
};

export default function CampoFiltroMultiSelect({ campo, registros, filtros, setFiltros, label, opcoesExternas }: CampoFiltroMultiSelectProps) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const opcoes = useMemo(() => montaOpcoesFiltro(registros, campo, opcoesExternas), [campo, opcoesExternas, registros]);
    const filtroCampoAtual = useMemo(() => obtemFiltroCampo(filtros, campo.campo), [campo.campo, filtros]);
    const valoresSelecionados = useMemo(() => obtemValoresSelecionados(filtroCampoAtual), [filtroCampoAtual]);
    const [aberto, setAberto] = useState(false);
    const [posicaoPopover, setPosicaoPopover] = useState<PosicaoPopover | null>(null);

    useEffect(() => {
        if (!aberto) return;

        function atualizaPosicaoPopover() {
            const trigger = triggerRef.current;
            if (!trigger) return;

            const margem = 12;
            const espacamento = 8;
            const rect = trigger.getBoundingClientRect();
            const larguraPopover = popoverRef.current?.getBoundingClientRect().width ?? 320;
            const alturaPopover = popoverRef.current?.getBoundingClientRect().height ?? 360;
            const leftMaximo = window.innerWidth - larguraPopover - margem;
            const topAbaixo = rect.bottom + espacamento;
            const topAcima = rect.top - alturaPopover - espacamento;
            const left = Math.max(margem, Math.min(rect.left, leftMaximo));
            const top = topAbaixo + alturaPopover > window.innerHeight - margem ? Math.max(margem, topAcima) : topAbaixo;

            setPosicaoPopover({ top, left });
        };

        function fechaAoClicarFora(event: PointerEvent) {
            const alvo = event.target;
            if (!(alvo instanceof Node)) return;
            if (triggerRef.current?.contains(alvo)) return;
            if (popoverRef.current?.contains(alvo)) return;

            setAberto(false);
        };

        function fechaComEsc(event: KeyboardEvent) {
            if (event.key === 'Escape') setAberto(false);
        };

        const rafId = window.requestAnimationFrame(atualizaPosicaoPopover);

        window.addEventListener('resize', atualizaPosicaoPopover);
        window.addEventListener('scroll', atualizaPosicaoPopover, true);
        document.addEventListener('pointerdown', fechaAoClicarFora);
        document.addEventListener('keydown', fechaComEsc);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener('resize', atualizaPosicaoPopover);
            window.removeEventListener('scroll', atualizaPosicaoPopover, true);
            document.removeEventListener('pointerdown', fechaAoClicarFora);
            document.removeEventListener('keydown', fechaComEsc);
        };
    }, [aberto]);

    function atualizaValoresSelecionados(valores: readonly ValorOpcaoFiltro[]) {
        const filtrosSemCampo = removeFiltrosCampo(filtros, campo.campo);

        if (valores.length === 0) {
            setFiltros(filtrosSemCampo);
            return;
        }

        setFiltros([...filtrosSemCampo, { id: criaIdFiltro(campo.campo, valores), campo: campo.campo, operador: GraphqlFiltroOperador.IGUAL, valor: valores }]);
    };

    function alternaOpcao(opcao: OpcaoFiltroMultiSelect) {
        if (valorSelecionadoPossuiOpcao(valoresSelecionados, opcao)) {
            atualizaValoresSelecionados(removeValorSelecionado(valoresSelecionados, opcao));
            return;
        }

        atualizaValoresSelecionados([...valoresSelecionados, opcao.valor]);
    };

    function limpaFiltro() {
        setFiltros(removeFiltrosCampo(filtros, campo.campo));
    };

    return (
        <article className={styles.campo_filtro}>
            <button ref={triggerRef} type="button" onClick={() => setAberto(valorAtual => !valorAtual)} className={styles.botao_resumo_multiselect} title={label}>
                <span className={styles.campo_filtro_textos}>
                    <strong className={styles.campo_filtro_label}>{label}</strong>
                    <span className={styles.campo_filtro_status}>{resolveResumoSelecionados(valoresSelecionados.length, opcoes.length)}</span>
                </span>
            </button>
            {valoresSelecionados.length > 0 && <button type="button" onClick={limpaFiltro} className={styles.botao_limpar_campo} aria-label={`Limpar filtro ${label}`}>×</button>}
            {aberto && (
                <div ref={popoverRef} className={styles.popover_multiselect} style={montaEstiloPopover(posicaoPopover)}>
                    <div className={styles.cabecalho_popover}>
                        <strong>{label}</strong>
                        <span>{opcoes.length} {pluralize(opcoes.length, 'opção', 'opções')}</span>
                    </div>
                    <div className={styles.lista_opcoes}>
                        {opcoes.length === 0 ? (
                            <span className={styles.estado_vazio}>Nenhuma opção encontrada.</span>
                        ) : opcoes.map(opcao => (
                            <button key={opcao.chave} type="button" onClick={() => alternaOpcao(opcao)} className={valorSelecionadoPossuiOpcao(valoresSelecionados, opcao) ? `${styles.opcao} ${styles.opcao_selecionada}` : styles.opcao}>
                                <span className={styles.marcador_opcao}>{valorSelecionadoPossuiOpcao(valoresSelecionados, opcao) ? '✓' : ''}</span>
                                <span className={styles.label_opcao}>{opcao.label}</span>
                                <span className={styles.total_opcao}>{opcao.total}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.rodape_popover}>
                        <button type="button" onClick={limpaFiltro} disabled={valoresSelecionados.length === 0} className={styles.botao_rodape}>Limpar</button>
                        <button type="button" onClick={() => setAberto(false)} className={styles.botao_rodape}>Fechar</button>
                    </div>
                </div>
            )}
        </article>
    );
};