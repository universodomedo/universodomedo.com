'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { GraphqlFiltroCampoDef, GraphqlFiltroOperador } from 'types-nora-api';

import styles from '../MultiSelect/styles.module.css';

type CampoFiltroBooleanoValor = string | number | boolean | Date | null | readonly (string | number | boolean | Date | null)[];

type CampoFiltroBooleanoAtivoBase = {
    readonly id: string;
    readonly campo: string;
    readonly operador: GraphqlFiltroOperador;
    readonly valor: CampoFiltroBooleanoValor;
};

type CampoFiltroBooleanoProps<TFiltro extends CampoFiltroBooleanoAtivoBase> = {
    readonly campo: GraphqlFiltroCampoDef<object>;
    readonly filtros: readonly TFiltro[];
    readonly setFiltros: (filtros: readonly TFiltro[]) => void;
    readonly label: string;
};

type CampoFiltroBooleanoOpcao = {
    readonly valor: boolean;
    readonly label: string;
};

type CampoFiltroBooleanoPosicaoPopover = {
    readonly top: number;
    readonly left: number;
};

const OPCOES_BOOLEANAS: readonly CampoFiltroBooleanoOpcao[] = [
    { valor: true, label: 'Sim' },
    { valor: false, label: 'Não' },
];

function criaIdFiltro(campo: string, valor: readonly boolean[]): string {
    return `${campo}-${GraphqlFiltroOperador.IGUAL}-${valor.map(String).join('|')}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function criaFiltroBooleano<TFiltro extends CampoFiltroBooleanoAtivoBase>(campo: string, valor: readonly boolean[]): TFiltro {
    return {
        id: criaIdFiltro(campo, valor),
        campo,
        operador: GraphqlFiltroOperador.IGUAL,
        valor,
    } as TFiltro;
};

function valorEhBooleano(valor: CampoFiltroBooleanoValor): valor is boolean {
    return typeof valor === 'boolean';
};

function valorEhListaBooleanos(valor: CampoFiltroBooleanoValor): valor is readonly boolean[] {
    return Array.isArray(valor) && valor.every(valorItem => typeof valorItem === 'boolean');
};

function removeFiltrosCampo<TFiltro extends CampoFiltroBooleanoAtivoBase>(filtros: readonly TFiltro[], campo: string): readonly TFiltro[] {
    return filtros.filter(filtro => filtro.campo !== campo);
};

function obtemValoresSelecionados<TFiltro extends CampoFiltroBooleanoAtivoBase>(filtros: readonly TFiltro[], campo: string): readonly boolean[] {
    const filtroCampo = filtros.find(filtro => filtro.campo === campo);

    if (!filtroCampo) return [];

    const valorFiltro = filtroCampo.valor;

    if (valorEhBooleano(valorFiltro)) return [valorFiltro];
    if (valorEhListaBooleanos(valorFiltro)) return OPCOES_BOOLEANAS.map(opcao => opcao.valor).filter(valor => valorFiltro.includes(valor));

    return [];
};

function valorEstaSelecionado(valoresSelecionados: readonly boolean[], valor: boolean): boolean {
    return valoresSelecionados.includes(valor);
};

function alternaValorSelecionado(valoresSelecionados: readonly boolean[], valor: boolean): readonly boolean[] {
    if (valorEstaSelecionado(valoresSelecionados, valor)) return valoresSelecionados.filter(valorSelecionado => valorSelecionado !== valor);

    return OPCOES_BOOLEANAS.map(opcao => opcao.valor).filter(valorOpcao => valorOpcao === valor || valoresSelecionados.includes(valorOpcao));
};

function obtemLabelValor(valor: boolean): string {
    return OPCOES_BOOLEANAS.find(opcao => opcao.valor === valor)?.label ?? String(valor);
};

function resolveStatus(valoresSelecionados: readonly boolean[]): string {
    if (valoresSelecionados.length === 0) return 'Selecione';
    if (valoresSelecionados.length === 1) return obtemLabelValor(valoresSelecionados[0]);

    return `${valoresSelecionados.length} selecionados`;
};

function resolveClasseOpcao(selecionado: boolean): string {
    if (selecionado) return `${styles.opcao} ${styles.opcao_selecionada}`;

    return styles.opcao;
};

function calculaPosicaoPopover(elemento: HTMLElement): CampoFiltroBooleanoPosicaoPopover {
    const rect = elemento.getBoundingClientRect();

    return {
        top: rect.bottom + 6,
        left: rect.left,
    };
};

function criaEstiloPopover(posicaoPopover: CampoFiltroBooleanoPosicaoPopover | null): CSSProperties {
    if (!posicaoPopover) return {};

    return {
        top: `${posicaoPopover.top}px`,
        left: `${posicaoPopover.left}px`,
    };
};

export default function CampoFiltroBooleano<TFiltro extends CampoFiltroBooleanoAtivoBase>({ campo, filtros, setFiltros, label }: CampoFiltroBooleanoProps<TFiltro>) {
    const recipienteRef = useRef<HTMLElement | null>(null);
    const [aberto, setAberto] = useState(false);
    const [posicaoPopover, setPosicaoPopover] = useState<CampoFiltroBooleanoPosicaoPopover | null>(null);
    const valoresSelecionados = useMemo(() => obtemValoresSelecionados(filtros, campo.campo), [campo.campo, filtros]);

    useEffect(() => {
        if (!aberto) return;

        function atualizaPosicaoPopover() {
            if (!recipienteRef.current) return;

            setPosicaoPopover(calculaPosicaoPopover(recipienteRef.current));
        };

        function fechaAoClicarFora(event: MouseEvent) {
            if (!(event.target instanceof Node)) return;
            if (recipienteRef.current?.contains(event.target)) return;

            setAberto(false);
        };

        atualizaPosicaoPopover();
        document.addEventListener('mousedown', fechaAoClicarFora);
        window.addEventListener('resize', atualizaPosicaoPopover);
        window.addEventListener('scroll', atualizaPosicaoPopover, true);

        return () => {
            document.removeEventListener('mousedown', fechaAoClicarFora);
            window.removeEventListener('resize', atualizaPosicaoPopover);
            window.removeEventListener('scroll', atualizaPosicaoPopover, true);
        };
    }, [aberto]);

    function atualizaValores(novosValores: readonly boolean[]) {
        const filtrosSemCampo = removeFiltrosCampo(filtros, campo.campo);

        if (novosValores.length === 0) {
            setFiltros(filtrosSemCampo);
            return;
        }

        setFiltros([...filtrosSemCampo, criaFiltroBooleano<TFiltro>(campo.campo, novosValores)]);
    };

    function alternaOpcao(valor: boolean) {
        atualizaValores(alternaValorSelecionado(valoresSelecionados, valor));
    };

    function limpaCampo() {
        setFiltros(removeFiltrosCampo(filtros, campo.campo));
    };

    function alternaPopover() {
        if (!aberto && recipienteRef.current) setPosicaoPopover(calculaPosicaoPopover(recipienteRef.current));

        setAberto(!aberto);
    };

    return (
        <article ref={recipienteRef} className={styles.campo_filtro} aria-label={label}>
            <button type="button" onClick={alternaPopover} className={styles.botao_resumo_multiselect} aria-expanded={aberto}>
                <span className={styles.campo_filtro_textos}>
                    <strong className={styles.campo_filtro_label}>{label}</strong>
                    <span className={styles.campo_filtro_status}>{resolveStatus(valoresSelecionados)}</span>
                </span>
            </button>
            {valoresSelecionados.length > 0 && <button type="button" onClick={limpaCampo} className={styles.botao_limpar_campo} title="Limpar filtro">×</button>}
            {aberto && (
                <div className={styles.popover_multiselect} style={criaEstiloPopover(posicaoPopover)}>
                    <div className={styles.cabecalho_popover}>
                        <strong>{label}</strong>
                        <span>{valoresSelecionados.length} selecionado(s)</span>
                    </div>
                    <div className={styles.lista_opcoes}>
                        {OPCOES_BOOLEANAS.map(opcao => {
                            const selecionado = valorEstaSelecionado(valoresSelecionados, opcao.valor);

                            return (
                                <button key={opcao.label} type="button" onClick={() => alternaOpcao(opcao.valor)} className={resolveClasseOpcao(selecionado)}>
                                    <span className={styles.marcador_opcao}>{selecionado ? '✓' : ''}</span>
                                    <span className={styles.label_opcao}>{opcao.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.rodape_popover}>
                        <button type="button" onClick={limpaCampo} disabled={valoresSelecionados.length === 0} className={styles.botao_rodape}>Limpar</button>
                        <button type="button" onClick={() => setAberto(false)} className={styles.botao_rodape}>Fechar</button>
                    </div>
                </div>
            )}
        </article>
    );
};